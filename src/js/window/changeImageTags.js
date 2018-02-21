$("#btn_imagetagedit").on('click', (e) => {
  $("#window_changeImageTags").show().css("zIndex", 151);
  $(".draggable:not(#window_changeImageTags)").css("zIndex", 150);

  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["（全て）"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }

    $("#changeImageTags_tagbox").empty();
    for(item of tagList){
      $("#changeImageTags_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    changeImageTags_setTag(tagList[0]);
  });
});

$(document).on('click', '#changeImageTags_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src").replace(ddf.base_url, "");
  $("#changeImageTags_imageName").val(img);
  $("#changeImageTags_image").css("backgroundImage", `url(${ddf.base_url+img})`);
  $("#changeImageTags_tag").val(ddf.images.tagInfos[img].tags.join(" "));
  $("#changeImageTags_password2").val(ddf.images.tagInfos[img].password);
  $("#changeImageTags_btnpassword2").text($("#changeImageTags_password2").val()==""?"パスワードなし":"パスワードあり");
});

$("#changeImageTags_tagbox").on('change', (e) => {
  changeImageTags_setTag($("#changeImageTags_tagbox").val());
});

$("#changeImageTags_close, #changeImageTags_close2").on('click', (e) => {
  $("#window_changeImageTags").hide();
  $("#changeImageTags_password").val("");
});

function changeImageTags_setTag(tag){
  $("#changeImageTags_imagearea").empty();
  let password = $("#changeImageTags_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#changeImageTags_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#changeImageTags_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}

$("#changeImageTags_btnpassword").on('click', (e) => {
  $("#changeImageTags_btnpassword").hide();
  $("#changeImageTags_password").show().focus();
});

$("#changeImageTags_password").on('focusout', (e) => {
  $("#changeImageTags_btnpassword").show();
  $("#changeImageTags_password").hide();
  changeImageTags_setTag($("#changeImageTags_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#changeImageTags_password").blur();
  }
});
$("#changeImageTags_btnpassword2").on('click', (e) => {
  $("#changeImageTags_btnpassword2").hide();
  $("#changeImageTags_password2").show().focus();
});

$("#changeImageTags_password2").on('focusout', (e) => {
  $("#changeImageTags_btnpassword2").show().text($("#changeImageTags_password2").val()==""?"パスワードなし":"パスワードあり");
  $("#changeImageTags_password2").hide();
  changeImageTags_setTag($("#changeImageTags_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#changeImageTags_password2").blur();
  }
});
$("#changeImageTags_tagbox2").on('change', (e)=>{
  $("#changeImageTags_tag").val($("#changeImageTags_tagbox2").val()+"　");
});

$("button#changeImageTags_send").on('click', (e) => {
  source = $("#changeImageTags_imageName").val();
  tagInfo = ddf.images.tagInfos[source];

  if(tagInfo){
    tagInfo.password = $("#changeImageTags_password2").val();
    tagInfo.tags = $("#changeImageTags_tag").val().split(/[ 　]/);
  }
  //ddf.changeImageTags(source, tagInfo).then((r) => {
  ddf.sendMsg({
    room: ddf.userState.room,
    own: ddf.info.uniqueId + ddf.userState.own,
    params: {
      source: source,
      tagInfo: tagInfo
    },
    cmd: "changeImageTags"
  }).then((r) => {
    ddf.getImageTagsAndImageList().then((r) => {
      tagList = ["（全て）"];
      ddf.images = r;
      for(item of ddf.images.imageList){
        if(ddf.images.tagInfos[item]){
          for(tag of ddf.images.tagInfos[item].tags){
            if(tag == ""){continue;}
            tagList.includes(tag) || tagList.push(tag);
          }
        }
      }

      $("#changeImageTags_tagbox").empty();
      for(item of tagList){
        $("#changeImageTags_tagbox").append($(`<option>${encode(item)}</option>`));
      }
      changeImageTags_setTag(tagList[0]);
    });
  });
});