
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#chatPalette_color").val(c.toHex());

  id = $("#chatPalette_tabs .active").attr("id");
  ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id].color = parseInt("0x"+c.toHex());
  
  ddf.cmd.saveUserState();
};
$("#chatPalette_color2").spectrum(sp_param);

$("#chatPalette_edit").on('click', (e) => {
  if($("#chatPalette_edit").text() == "編集"){

    $("#chatPalette_text").show();
    $("#chatPalette_main").hide();
    $("#chatPalette_edit").text("編集終了");
  }else{
    $("#chatPalette_main").html(`<p>${encode($("#chatPalette_text").val()).replace(/\n/g,"</p><p>")}</p>`);

    ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][$("#chatPalette_tabs .active").attr("id")].text = $("#chatPalette_text").val();

    ddf.cmd.saveUserState();

    $("#chatPalette_text").hide();
    $("#chatPalette_main").show();
    $("#chatPalette_edit").text("編集");
  }
});

$(document).on('click', '#chatPalette_main p', (e) => {
  $("#chatPalette_chattext").val(parseParams($(e.target).text(), $("#chatPalette_senderName").val(), $("#chatPalette_text").val()));
});

function parseParams(msg, name, palette){
  list = {};
  reg = /(\/\/|／／)\s*([^＝=\s]*)\s*(=|＝)\s*([^\n\s]*)\s*/g;
  while(v = reg.exec(palette)){
    list[v[2]] = v[4];
  }

  for(item in ddf.characters){
    if(ddf.characters[item].data.name == name){
      for(item2 of ddf.roomState.roundTimeData.counterNames){
        if(item2[0] != "*"){
          list[item2] = ((imageId, counterName) => {
            return (v) => {
              return ddf.characters[imageId].data.counters[counterName];
            };
          })(item, item2);
        }
      }
      break;
    }
  }

  depth = 0;
  while(/{[^}]+}/.test(msg) && depth++ < 10){
    msg = msg.replace(/{([^}]+)}/g, (original, match) => {
      if(list[match] == null){
        return original;
      }else if(list[match] instanceof Function){
          return list[match]();
      }else{
        return list[match];
      }
    });
  }
  return msg;
}

$("#chatPalette_save").on('click', (e) => {
  tab = [];
  for(item in ddf.userState.chatPalette[ddf.base_url+ddf.userState.room]){
    palette = ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][item];
    palette && tab.push({
      lines: palette.text.split("\n"),
      name: palette.name,
      tabName: palette.tabName,
      color: palette.color
    });
  }
  data = JSON.stringify({
    saveData: {
      tabInfos: tab
    },
    saveDataTypeName: "ChatPalette2"
  });
    let buffer = new Buffer(data);
    let filename = `ChatPalette_${ddf.base_url+ddf.userState.room}.cpd`;
    a = $(`<a href="data://text/html;base64,${buffer.toString('base64')}" download="${filename}">.</a>`);
    $(document.body).append(a);
    a[0].click();
    a.remove();
});

$("#chatPalette_load").on('click', (e) => {
  $("#window_chatPalette_import").show().css("zIndex", 151);
  $(".draggable:not(#window_chatPalette_import)").css("zIndex", 150);
});

let $form = $("#chatPalette_import_droparea");

(($form) => {
  $("#chatPalette_import_droparea ~ .overwrap").on('dragenter', () => {
    $form.addClass('is-dragover');
  });

  $form.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
  })
  .on('dragover dragenter', () => {
    $form.addClass('is-dragover');
  })
  .on('dragleave dragend drop', () => {
    $form.removeClass('is-dragover');
  })
  .on('drop', (e) => {
    droppedFiles = e.originalEvent.dataTransfer.files;

    chatPalette_import_uploadfiles(droppedFiles);
  });
})($form);

$("#window_chatPalette_import :file").on('change', (e) => {
  arr = [];
  for(item of $("#window_chatPalette_import :file")[0].files){
    arr.push(item);
  }
  chatPalette_import_uploadfiles(arr);
});

function chatPalette_import_uploadfiles(droppedFiles){
  for(file of droppedFiles){
    new Promise((success, error)=>{
      let fr = new FileReader();

      fr.onload = success;

      if(/^(plain\/text|appilication\/json|)$/.test(file.type)){
        fr.readAsText(file);
      }
    }).then((r) => {
      console.log(r);
      let data = JSON.parse(r.target.result);

      if(data.saveDataTypeName == "ChatPalette2" && data.saveData){
        for(item of data.saveData.tabInfos){
          item.tabName == "" && (item.tabName = "id"+ddf.util.getUniqueId());
          ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][item.tabName] = {
            tabName: item.tabName,
            text: item.lines.join("\n"),
            name: item.name,
            color: item.color
          }
          $("#chatPalette_tabs").append($(`<p id="${item.tabName}">${/^id/.test(item.tabName)?$("#chatPalette_tabs p").length+1:item.tabName}</p>`))
        }
      }
      ddf.cmd.saveUserState();
    });
  }
  $("#window_chatPalette_import").hide();
}


$("#window_chatPalette_import .overwrap a").on('click', (e) => {
  $("#window_chatPalette_import .overwrap :file").click();
  return false;
});

$("#chatPalette_import_close").on('click', (e) => {
  $("#window_chatPalette_import").hide();
});

$("#chatPalette_tabAdd").on('click', (e) => {
  id = "id"+ddf.util.getUniqueId();
  item = {
    tabName: id,
    text: "",
    name: "",
    color: 0xFFFFFF
  };
  ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id] = item;

  ddf.cmd.saveUserState();

  $("#chatPalette_tabs").append($(`<p id="${id}">${$("#chatPalette_tabs p").length+1}</p>`));
  $("#chatPalette_tabs p:last").click();
});

$(document).on('click', "#chatPalette_tabs > p:not(.active)", (e) => {
  $("#chatPalette_tabs .active").removeClass("active");
  $(e.target).addClass("active");

  item = ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][$(e.target).attr("id")];

  color = new tinycolor("rgb("+[item.color / 65536 & 0xFF,item.color / 256 & 0xFF,item.color & 0xFF]+")").toHex();
  
  $("#chatPalette_senderName").val(item.name);
  $("#chatPalette_color").val(color);
  $("#chatPalette_color2").spectrum('set', "#"+color);
  $("#chatPalette_tabName").val(/^id/.test(item.tabName)?"":item.tabName);
  $("#chatPalette_text").val(item.text);
  $("#chatPalette_main").html(`<p>${item.text.replace(/\n/g,"</p><p>")}</p>`);

  $("#chatPalette_text").hide();
  $("#chatPalette_main").show();
  $("#chatPalette_edit").text("編集");
  
});

$("#chatPalette_senderName").on('change', (e) => {
  id = $("#chatPalette_tabs .active").attr("id");
  ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id].name = $("#chatPalette_senderName").val();
  
  ddf.cmd.saveUserState();
});
$("#chatPalette_tabName").on('change', (e) => {
  id = $("#chatPalette_tabs .active").attr("id");
  tabName = $("#chatPalette_tabName").val();
  item = ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id];
  if(tabName != id && tabName != ""){
    item.tabName = tabName;
    ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][tabName] = item;
    ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id] = null;
    $("#chatPalette_tabs .active").attr("id", tabName);
    $("#chatPalette_tabs .active").text(tabName);
  }else if(tabName != id){
    item.tabName = "ib"+ddf.util.getUniqueId();
    ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][tabName] = item;
    ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id] = null;
    $("#chatPalette_tabs .active").attr("id", tabName);
    $("#chatPalette_tabs .active").text($("#chatPalette_tabs .active").prevAll().length+1);
  }

  ddf.cmd.saveUserState();
});

$("#chatPalette_tabEdit").on('click', (e) => {
  id = $("#chatPalette_tabs .active").attr("id");
  ddf.userState.chatPalette[ddf.base_url+ddf.userState.room][id] = null;
  
  ddf.cmd.saveUserState();

  $("#chatPalette_tabs .active").remove();
  $(`#chatPalette_tabs p:eq(0)`).click();
});

$("#chatPalette_chattext").on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#chatPalette_send").click();
    return false;
  }
});

$("#chatPalette_send").on('click', (e) => {
  ddf.cmd.sendChatMessage(
    ddf.userState.channel,
    $("#chatPalette_senderName").val()==""?$("#chatname").val():$("#chatPalette_senderName").val(),
    "",
    $("#dicebot").val(),
    $("#chatPalette_chattext").val(),
    $("#chatPalette_color").val()=="ffffff"?ddf.userState.chatColor:$("#chatPalette_color").val()
  );
  $("#chatPalette_chattext").val("");
})