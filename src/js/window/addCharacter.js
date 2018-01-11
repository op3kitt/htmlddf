$("#btn_createcharacter").on("click", (e) => {
  addCharacter_show("0");
});

ddf.cmd.addCharacter_show = addCharacter_show;
function addCharacter_show(imgId){
  $("#window_addCharacter_sub").hide();

  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["キャラクター画像"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }
    tagList.push("（全て）");

    $("#addCharacter_tagbox").empty();
    for(item of tagList){
      $("#addCharacter_tagbox").append($(`<option>${encode(item)}</option>`));
    }
      $("#addCharacter_tagbox").append($(`<option>${encode(item)}</option>`));
    addCharacter_setTag(tagList[0]);
  });

  if((character = ddf.characters[imgId])){
    character = character.data;

    $("#window_addCharacter .title").text("キャラクター変更");
    $("#addCharacter_send").text("変更");
  }else{
    character = {
      imgId: imgId,
      name: "",
      dogTag: "",
      size: 1,
      url: "",
      draggable: true,
      imageName: "./image/defaultImageSet/pawn/pawnBlack.png",
      images: ["./image/defaultImageSet/pawn/pawnBlack.png"],
      info: "",
      initiative: 0,
      isHide: false,
      mirrored: false,
      rotation: 0,
      statusAlias: {},
      type: "characterData",
      x: 0,
      y: 0
    };

    $("#window_addCharacter .title").text("キャラクター追加");
    $("#addCharacter_send").text("追加");
  }

  $("#addCharacter_imgId").val(character.imgId);
  $("#addCharacter_name").val(character.name);
  $("#addCharacter_dogTag").val(character.dogTag);
  $("#addCharacter_size").val(character.size);
  $("#addCharacter_url").val(character.url);
  $("#addCharacter_info").val(character.info);
  $("#addCharacter_imageName").val(character.imageName);
  $("#addCharacter_image").css("backgroundImage", `url(${ddf.base_url + character.imageName})`);
  $("#addCharacter_mirrored").prop("checked", character.mirrored);
  if(character.mirrored){
    $("#addCharacter_image").addClass("mirrored");
  }else{
    $("#addCharacter_image").removeClass("mirrored");
  }

  $("#addCharacter_counters").empty();
  character.counters == null && (character.counters = {});

  thead = $("<tr></tr>");
  tbody = $("<tr></tr>");
  
  thead.append($(`<th>イニシアティブ</th>`));
  tbody.append($(`<td><input id="addCharacter_initiative" type="number" value="${character.initiative|0}"></td>`));
  thead.append($(`<th>修正値</th>`));
  tbody.append($(`<td><input id="addCharacter_initiative2" type="number" value="${character.initiative * 100 % 100 | 0}" min="-9" max="90"></td>`));
  count = 0;
  for(item of ddf.roomState.roundTimeData.counterNames){
    character.counters[item]==undefined && (character.counters[item] = 0)
    if(!!(match = /^\*(.*)/.exec(item))){
      thead.append($(`<th>${match[1]}</th>`));
      tbody.append($(`<td><input name="addCharacter_counters[${count++}]" type="checkbox" value="1" ${character.counters[item]!=0?"checked":""}></td>`));
    }else{
      thead.append($(`<th>${item}</th>`));
      tbody.append($(`<td><input name="addCharacter_counters[${count++}]" type="number" value="${character.counters[item]}"></td>`));
    }
  }
  $("#addCharacter_counters").append(thead);
  $("#addCharacter_counters").append(tbody);

  $("#window_addCharacter").show().css("zIndex", 151);
  $(".draggable:not(#window_addCharacter)").css("zIndex", 150);
}

$("#addCharacter_close, #addCharacter_close2").on("click", (e) => {
  $("#window_addCharacter").hide();
});

$("#addCharacter_sub_close").on("click", (e) => {
  $("#window_addCharacter_sub").hide();
});

$("#addCharacter_tagbox").on('change', (e) => {
  addCharacter_setTag($("#addCharacter_tagbox").val());
});

function addCharacter_setTag(tag){
  $("#addCharacter_imagearea").empty();
  let password = $("#addCharacter_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#addCharacter_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#addCharacter_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}

$(document).on('click', '#addCharacter_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#addCharacter_imageName").val(img.replace(ddf.base_url, ""));
  $("#addCharacter_image").css("backgroundImage", `url(${img})`);
});

$("#addCharacter_mirrored").on('click', (e) => {
  if($("#addCharacter_mirrored").prop("checked")){
    $("#addCharacter_image").addClass("mirrored");
  }else{
    $("#addCharacter_image").removeClass("mirrored");
  }
});

$("#addCharacter_btnpassword").on('click', (e) => {
  $("#addCharacter_btnpassword").hide();
  $("#addCharacter_password").show().focus();
});

$("#addCharacter_password").on('focusout', (e) => {
  $("#addCharacter_btnpassword").show();
  $("#addCharacter_password").hide();
  addCharacter_setTag($("#addCharacter_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#addCharacter_password").blur();
  }
});

$("#addCharacter_send").on('click', (e) => {

  if((character = ddf.characters[$("#addCharacter_imgId").val()])){

    character.data.name = $("#addCharacter_name").val();
    character.data.dogTag = $("#addCharacter_dogTag").val();
    character.data.size = $("#addCharacter_size").val();
    character.data.url = $("#addCharacter_url").val();
    character.data.info = $("#addCharacter_info").val();
    character.data.mirrored = $("#addCharacter_mirrored").prop("checked");
    character.data.imageName = $("#addCharacter_imageName").val();
    character.data.initiative = parseInt($("#addCharacter_initiative").val()) + ($("#addCharacter_initiative2").val() / 100);
    character.data.isHide = $("#addCharacter_isHide").prop("checked");
    count = 0;
    for(item of ddf.roomState.roundTimeData.counterNames){
      obj = $(`[name=addCharacter_counters\\[${count++}\\]]`);
      if(obj.attr("type")=="checkbox"){
        character.data.counters[item] = obj.prop("checked");
      }else{
        character.data.counters[item] = obj.val();
      }
    }

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_addCharacter").hide();
    });
  }else{
    $("#addCharacter_sub_multiple").prop("checked", false);
    $("#addCharacter_sub_name").text($("#addCharacter_name").val());
    $("#addCharacter_sub_character").css("backgroundImage", $("#addCharacter_image").css("backgroundImage"));
    $("#window_addCharacter_sub").show();
    $("#window_addCharacter").hide();
  }
});

var click = {};
$("#window_addCharacter_sub .characterFrame").draggable({
  start: (event) =>  {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#window_addCharacter_sub .characterFrame").clone();
    obj.css("width", $("#addCharacter_size").val() * 50 + "px");
    obj.css("height", $("#addCharacter_size").val() * 50 + "px");
    obj.appendTo("#mapSurface");
    return obj;
  },
  drag: (event, ui) =>  {
      // This is the parameter for scale()
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

      // jQuery will simply use the same object we alter here
      ui.position = {
          left: (event.clientX - click.x + original.left) / zoom,
          top:  (event.clientY - click.y + original.top ) / zoom
      };
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece){
        if(ddf.roomState.mapData.isAlternately && ddf.roomState.mapData.gridInterval % 2 == 1){
          if((Math.floor(ui.position.top / 50 / ddf.roomState.mapData.gridInterval) & 1)){
            ui.position = {
                left: ((Math.floor(ui.position.left / 25) | 1) ^ 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }else{
            ui.position = {
                left: (Math.floor(ui.position.left / 25) | 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }
        }else{
          ui.position = {
              left: Math.floor(ui.position.left / 50) * 50,
              top: Math.floor(ui.position.top / 50) * 50
          };
        }
      }
    },
    stop: (event, ui) => {
      character = {
        counters: {},
        imgId: $("#addCharacter_imgId").val(),
        name: $("#addCharacter_name").val(),
        dogTag: $("#addCharacter_dogTag").val(),
        size: $("#addCharacter_size").val(),
        url: $("#addCharacter_url").val(),
        draggable: true,
        imageName: $("#addCharacter_imageName").val(),
        images: [$("#addCharacter_imageName").val()],
        info: $("#addCharacter_info").val(),
        initiative: parseInt($("#addCharacter_initiative").val())+($("#addCharacter_initiative2").val() / 100),
        isHide: $("#addCharacter_isHide").prop("checked"),
        mirrored: $("#addCharacter_mirrored").prop("checked"),
        rotation: 0,
        statusAlias: {},
        type: "characterData",
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      count = 0;
      for(item of ddf.roomState.roundTimeData.counterNames){
        obj = $(`[name=addCharacter_counters\\[${count++}\\]]`);
        if(obj.attr("type")=="checkbox"){
          character.counters[item] = obj.prop("checked");
        }else{
          character.counters[item] = obj.val();
        }
      }
        ddf.addCharacter(character).then((r) => {;
          ddf.cmd.initiative_sort(true);
        });
      if($("#addCharacter_sub_multiple").prop("checked")){
        basename = $("#addCharacter_name").val().replace(/_\d+$/, "");
        reg = new RegExp(basename+"_(\\d+)");
        index = 0;
        if(v = reg.exec($("#addCharacter_name").val())){
          index = Math.max(index, parseInt(v[1]))
        }
        for(item in ddf.characters){
          if(v = reg.exec(ddf.characters[item].data.name)){
            index = Math.max(index, parseInt(v[1]))
          }
        }
        $("#addCharacter_name").val(basename+"_"+(index + 1));
        $("#addCharacter_dogTag").val(index + 1);
        $("#addCharacter_sub_name").text(basename+"_"+(index + 1));
      }else{
        $("#window_addCharacter_sub").hide();
      }
    }
});