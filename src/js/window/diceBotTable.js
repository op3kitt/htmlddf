$("#btn_diceBotTable").on('click', (e) => {
  ddf.getBotTableInfos().then((r) => {
    $("#window_diceBotTable table tbody").empty();
    for(item of r.tableInfos){
      tr  = `<tr>`;
      tr += `<td><button class="edit" command="${item.command}" gameType="${item.gameType}">変更</button></td>`;
      tr += `<td><button class="copy" command="${item.command}" gameType="${item.gameType}">コピー</button></td>`;
      tr += `<td>${encode(item.command)}</td>`;
      tr += `<td>${encode(item.gameType)}</td>`;
      tr += `<td>${encode(item.title)}</td>`;
      tr += `<td><button class="delete"  command="${item.command}" gameType="${item.gameType}">削除</button></td>`;
      tr += `</tr>`;
      $("#window_diceBotTable table tbody").append($(tr));
    }
  });

  $("#window_diceBotTable").show().css("zIndex", 151);
  $(".draggable:not(#window_diceBotTable)").css("zIndex", 150);
});

$(document).on('click', '#window_diceBotTable button.edit', (e) => {
  diceBotTable_show($(e.target).attr("gameType"), $(e.target).attr("command"), false);
});
$(document).on('click', '#window_diceBotTable button.copy', (e) => {
  diceBotTable_show($(e.target).attr("gameType"), $(e.target).attr("command"), true);
});
$(document).on('click', '#window_diceBotTable button.delete', (e) => {
  if(confirm($(e.target).attr("command")+"を削除します、よろしいですか？")){
    ddf.removeBotTable($(e.target).attr("command"));
  }
});

$("#diceBotTable_create").on('click', (e) => {
  diceBotTable_show("", "", true);
});

$("#diceBotTable_close, #diceBotTable_close2").on('click', (e) => {
  $("#window_diceBotTable").hide();
});

function diceBotTable_show(effectId){

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

    $("#diceBotTable_create_tagbox").empty();
    for(item of tagList){
      $("#diceBotTable_create_tagbox").append($(`<option>${encode(item)}</option>`));
    }
      $("#diceBotTable_create_tagbox").append($(`<option>${encode(item)}</option>`));
    diceBotTable_create_setTag(tagList[0]);
  });

  effect = ddf.roomState.effects.find((v)=>{return v.effectId == effectId;});
  if(effect){
    $("#window_diceBotTable_create .title").text("立ち絵追加");
    $("#diceBotTable_create_send").text("追加");
  }else{
    effect = {
      effectId: "0",
      name: "",
      state: "",
      leftIndex: 1,
      source: "",
      type: "standingGraphicInfos",
      motion: "",
      mirrored: false
    };

    $("#window_diceBotTable_create .title").text("立ち絵変更");
    $("#diceBotTable_create_send").text("変更");
  }

  $("#diceBotTable_create_effectId").val(effect.effectId);
  $("#diceBotTable_create_name").val(effect.name);
  $("#diceBotTable_create_state").val(effect.state);
  $("#diceBotTable_create_leftIndex").val(effect.leftIndex);
  $("#window_diceBotTable_create .slider").slider('value', effect.leftIndex);
  $("#diceBotTable_create_motion").val(effect.motion);

  $("#diceBotTable_create_imageName").val(effect.source);
  $("#diceBotTable_create_image").css("backgroundImage", `url(${ddf.base_url + effect.source})`);
  $("#diceBotTable_create_mirrored").prop("checked", effect.mirrored);

  $("#window_diceBotTable_create").show().css("zIndex", 151);
  $(".draggable:not(#window_diceBotTable_create)").css("zIndex", 150);
}

$("#diceBotTable_create_close, #diceBotTable_create_close2").on('click', (e) => {
  $("#window_diceBotTable_create").hide();
});


$("#diceBotTable_create_tagbox").on('change', (e) => {
  diceBotTable_create_setTag($("#diceBotTable_create_tagbox").val());
});

function diceBotTable_create_setTag(tag){
  $("#diceBotTable_create_imagearea").empty();
  let password = $("#diceBotTable_create_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#diceBotTable_create_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#diceBotTable_create_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}
$(document).on('click', '#diceBotTable_create_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#diceBotTable_create_imageName").val(img.replace(ddf.base_url, ""));
  $("#diceBotTable_create_image").css("backgroundImage", `url(${img})`);
});

$("#diceBotTable_create_mirrored").on('click', (e) => {
  if($("#diceBotTable_create_mirrored").prop("checked")){
    $("#diceBotTable_create_image").addClass("mirrored");
  }else{
    $("#diceBotTable_create_image").removeClass("mirrored");
  }
});
$("#diceBotTable_create_btnpassword").on('click', (e) => {
  $("#diceBotTable_create_btnpassword").hide();
  $("#diceBotTable_create_password").show().focus();
});
$("#diceBotTable_create_password").on('focusout', (e) => {
  $("#diceBotTable_create_btnpassword").show();
  $("#diceBotTable_create_password").hide();
  diceBotTable_setTag($("#diceBotTable_create_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#diceBotTable_create_password").blur();
  }
});

$("#diceBotTable_create_send").on('click', (e) => {

  effect = ddf.roomState.effects.find((v)=>{return v.effectId == $("#diceBotTable_create_effectId").val();});
  if(effect){
    effect.effectId = $("#diceBotTable_create_effectId").val();
    effect.source = $("#diceBotTable_create_imageName").val();
    effect.name = $("#diceBotTable_create_name").val();
    effect.state = $("#diceBotTable_create_state").val();
    effect.leftIndex = $("#diceBotTable_create_leftIndex").val();
    effect.motiron = $("#diceBotTable_create_motion").val();
    effect.mirrored = $("#diceBotTable_create_mirrored").prop("checked");

    ddf.changeEffectCharacter(effect.effectId, effect.name, effect.state, effect.motion, effect.source, effect.mirroed, effect.leftIndex).then((r) => {
      $("#window_diceBotTable_create").hide();
    });
  }else{
    effect = {
      type: "standingGraphicInfos",
    };

    effect.effectId = $("#diceBotTable_create_effectId").val();
    effect.source = $("#diceBotTable_create_imageName").val();
    effect.name = $("#diceBotTable_create_name").val();
    effect.state = $("#diceBotTable_create_state").val();
    effect.leftIndex = $("#diceBotTable_create_leftIndex").val();
    effect.motiron = $("#diceBotTable_create_motion").val();
    effect.mirrored = $("#diceBotTable_create_mirrored").prop("checked");

    ddf.addEffectCharacter(effect.name, effect.state, effect.motion, effect.source, effect.mirroed, effect.leftIndex);
  }
});