$("#window_characterCutin_create .slider").slider({min: 1,max: 12, step:1, stop: (e, ui) => {
    $("#characterCutin_create_leftIndex").val(ui.value);
  }
});

ddf.cmd.effectList_create = effectList_create;
function effectList_create(){
  $("#window_characterCutin table tbody tr:gt(0)").remove();

  for(item of ddf.roomState.effects){
    if(item.name){
      tr  = `<tr>`;
      tr += `<td><button class="change" value="${item.effectId}"oid="${item.effectId}">変更</button></td>`;
      tr += `<td>${encode(item.name)}</td>`;
      tr += `<td>${encode(item.state)}</td>`;
      tr += `<td>${encode(item.leftIndex)}</td>`;
      tr += `<td><p>${encode(item.source)}</p></td>`;
      tr += `<td><button class="delete" value="${item.effectId}" oid="${item.effectId}">削除</button></td>`;
      tr += `</tr>`;
      $("#window_characterCutin table tbody").append($(tr));
    }
  }
}

$("#btn_characterList").on('click', (e) => {
  $("#window_characterCutin").show().css("zIndex", 151);
  $(".draggable:not(#window_characterCutin)").css("zIndex", 150);
});

$(document).on('click', '#window_characterCutin button.change', (e) => {
  characterCutin_show($(e.target).attr("oid"));
});
$(document).on('click', '#window_characterCutin button.delete', (e) => {
  if(confirm("立ち絵を削除してよろしいですか？")){
    ddf.removeEffect([$(e.target).attr("oid")]);
  }
});

$("#characterCutin_create").on('click', (e) => {
  characterCutin_show("0");
});

$("#characterCutin_close, #characterCutin_close2").on('click', (e) => {
  $("#window_characterCutin").hide();
});

function characterCutin_show(effectId){

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

    $("#characterCutin_create_tagbox").empty();
    for(item of tagList){
      $("#characterCutin_create_tagbox").append($(`<option>${encode(item)}</option>`));
    }
      $("#characterCutin_create_tagbox").append($(`<option>${encode(item)}</option>`));
    characterCutin_create_setTag(tagList[0]);
  });

  effect = ddf.roomState.effects.find((v)=>{return v.effectId == effectId;});
  if(effect){
    $("#window_characterCutin_create .title").text("立ち絵追加");
    $("#characterCutin_create_send").text("追加");
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

    $("#window_characterCutin_create .title").text("立ち絵変更");
    $("#characterCutin_create_send").text("変更");
  }

  $("#characterCutin_create_effectId").val(effect.effectId);
  $("#characterCutin_create_name").val(effect.name);
  $("#characterCutin_create_state").val(effect.state);
  $("#characterCutin_create_leftIndex").val(effect.leftIndex);
  $("#window_characterCutin_create .slider").slider('value', effect.leftIndex);
  $("#characterCutin_create_motion").val(effect.motion);

  $("#characterCutin_create_imageName").val(effect.source);
  $("#characterCutin_create_image").css("backgroundImage", `url(${ddf.base_url + effect.source})`);
  $("#characterCutin_create_mirrored").prop("checked", effect.mirrored);

  $("#window_characterCutin_create").show().css("zIndex", 151);
  $(".draggable:not(#window_characterCutin_create)").css("zIndex", 150);
}

$("#characterCutin_create_close, #characterCutin_create_close2").on('click', (e) => {
  $("#window_characterCutin_create").hide();
});


$("#characterCutin_create_tagbox").on('change', (e) => {
  characterCutin_create_setTag($("#characterCutin_create_tagbox").val());
});

function characterCutin_create_setTag(tag){
  $("#characterCutin_create_imagearea").empty();
  let password = $("#characterCutin_create_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#characterCutin_create_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#characterCutin_create_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}
$(document).on('click', '#characterCutin_create_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#characterCutin_create_imageName").val(img.replace(ddf.base_url, ""));
  $("#characterCutin_create_image").css("backgroundImage", `url(${img})`);
});

$("#characterCutin_create_mirrored").on('click', (e) => {
  if($("#characterCutin_create_mirrored").prop("checked")){
    $("#characterCutin_create_image").addClass("mirrored");
  }else{
    $("#characterCutin_create_image").removeClass("mirrored");
  }
});
$("#characterCutin_create_btnpassword").on('click', (e) => {
  $("#characterCutin_create_btnpassword").hide();
  $("#characterCutin_create_password").show().focus();
});
$("#characterCutin_create_password").on('focusout', (e) => {
  $("#characterCutin_create_btnpassword").show();
  $("#characterCutin_create_password").hide();
  imageDelete_setTag($("#characterCutin_create_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#characterCutin_create_password").blur();
  }
});

$("#characterCutin_create_send").on('click', (e) => {

  effect = ddf.roomState.effects.find((v)=>{return v.effectId == $("#characterCutin_create_effectId").val();});
  if(effect){
    effect.effectId = $("#characterCutin_create_effectId").val();
    effect.source = $("#characterCutin_create_imageName").val();
    effect.name = $("#characterCutin_create_name").val();
    effect.state = $("#characterCutin_create_state").val();
    effect.leftIndex = $("#characterCutin_create_leftIndex").val();
    effect.motiron = $("#characterCutin_create_motion").val();
    effect.mirrored = $("#characterCutin_create_mirrored").prop("checked");

    ddf.changeEffectCharacter(effect.effectId, effect.name, effect.state, effect.motion, effect.source, effect.mirroed, effect.leftIndex).then((r) => {
      $("#window_characterCutin_create").hide();
    });
  }else{
    effect = {
      type: "standingGraphicInfos",
    };

    effect.effectId = $("#characterCutin_create_effectId").val();
    effect.source = $("#characterCutin_create_imageName").val();
    effect.name = $("#characterCutin_create_name").val();
    effect.state = $("#characterCutin_create_state").val();
    effect.leftIndex = $("#characterCutin_create_leftIndex").val();
    effect.motiron = $("#characterCutin_create_motion").val();
    effect.mirrored = $("#characterCutin_create_mirrored").prop("checked");

    ddf.addEffectCharacter(effect.name, effect.state, effect.motion, effect.source, effect.mirroed, effect.leftIndex);
  }
});