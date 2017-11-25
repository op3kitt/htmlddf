$("#btn_imagedelete").on('click', (e) => {
  $("#window_imageDelete").show().css("z-index", 61);
  $(".draggable:not(#window_imageDelete)").css("z-index", 60);

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

    $("#imageDelete_tagbox").empty();
    for(item of tagList){
      $("#imageDelete_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    imageDelete_setTag(tagList[0]);
  });
});

$("#imageDelete_tagbox").on('change', (e) => {
  imageDelete_setTag($("#imageDelete_tagbox").val());
});

$("#imageDelete_close, #imageDelete_close2").on('click', (e) => {
  $("#window_imageDelete").hide();
  $("#imageDelete_password").val("");
});

function imageDelete_setTag(tag){
  $("#imageDelete_imagearea").empty();
  let password = $("#imageDelete_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#imageDelete_imagearea").append($(`<div><img src="${ddf.base_url + item}" /><input type="checkbox" value="${item}"></div>`));
      }
    }else if(tag == "（全て）"){
      $("#imageDelete_imagearea").append($(`<div><img src="${ddf.base_url + item}" /><input type="checkbox" value="${item}"></div>`));
    }
  }
}

$("#imageDelete_btnpassword").on('click', (e) => {
  $("#imageDelete_btnpassword").hide();
  $("#imageDelete_password").show().focus();
});

$("#imageDelete_password").on('focusout', (e) => {
  $("#imageDelete_btnpassword").show();
  $("#imageDelete_password").hide();
  imageDelete_setTag($("#imageDelete_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#imageDelete_password").blur();
  }
});

$("button#imageDelete_delete").on('click', (e) => {
  imageList = [];
  for(obj of $("#imageDelete_imagearea :checked")){
    imageList.push(obj.value);
    ddf.images.imageList.splice(ddf.images.imageList.indexOf(obj.value), 1);
  }
  ddf.deleteImage(imageList).then((r) => {
    imageDelete_setTag($("#imageDelete_tagbox").val());
    $("#imageDelete_result").text(r.resultText);
  });
});