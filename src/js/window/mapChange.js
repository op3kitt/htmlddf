$("#btn_mapchange").on("click", (e) => {
  mapChange_show();
});

$("#window_mapChange input").on('change', mapChange_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapChange_color").val(c.toHex());
  mapChange_previewUpdate();
};
$("#mapChange_color2").spectrum(sp_param);

function mapChange_show(){
  $("#window_mapChange").show().css("zIndex", 151);
  $(".draggable:not(#window_mapChange)").css("zIndex", 150);

  color = new tinycolor("rgb("+[ddf.roomState.mapData.gridColor / 65536 & 0xFF,ddf.roomState.mapData.gridColor / 256 & 0xFF,ddf.roomState.mapData.gridColor & 0xFF]+")").toHex();
  $("#mapChange_width").val(ddf.roomState.mapData.xMax);
  $("#mapChange_height").val(ddf.roomState.mapData.yMax);
  $("#mapChange_isAlternately").prop("checked", ddf.roomState.mapData.isAlternately);
  //ddf.roomState.mapData.mirrored
  $("#mapChange_gridInterval").val(ddf.roomState.mapData.gridInterval);
  $("#mapChange_color").val(color);
  $("#mapChange_color2").spectrum("set", "#"+color);
  switch(ddf.roomState.mapData.mapType){
    case "imageGraphic":
      $("#mapChange_imageSource").val(ddf.roomState.mapData.imageSource);
      if($("#mapChange_imageSource").val() == "image/whiteBack.png"){
        $("#mapChange_blank").prop("checked", true);
      }else{
        $("#mapChange_blank").prop("checked", false);
      }
      $("#mapChange_mirrored").prop("checked", ddf.roomState.mapData.mirrored);
  }

  mapChange_previewUpdate();
}

function mapChange_previewUpdate(){
  param = {
      x: $("#mapChange_width").val(),
      y: $("#mapChange_height").val(),
      border: true,
      alt: $("#mapChange_isAlternately").prop("checked"),
      num: true,
      size: $("#mapChange_gridInterval").val(),
      color: "#"+$("#mapChange_color").val()
  };
  zoom = Math.min(1, 7.26 / param.y,8 / param.x);
  $("#mapChange_preview").css("transform", `scale(${zoom})`);
  $("#mapChange_grid, #mapChange_map").css({width: param.x * 50, height: param.y * 50});
  $("#mapChange_grid").attr("data", "img/grid.svg?"+$.map(param, (v,k) => {return k+"="+v;}).join("&"));
  $("#mapChange_map").attr("src", ddf.base_url + ($("#mapChange_blank").prop("checked")?"image/whiteBack.png":$("#mapChange_imageSource").val()));
  if($("#mapChange_mirrored").prop("checked")){
    $("#mapChange_map").addClass("mirrored");
  }else{
    $("#mapChange_map").removeClass("mirrored");
  }
}

$("#mapChange_close, #mapChange_close2").on("click", (e) => {
  $("#mapChange_image").show();
  $("#mapChange_imageSelect").hide();
  $("#window_mapChange").hide();
});

$("#mapChange_imageChange").on('click', (e) => {
  $("#mapChange_image").hide();
  $("#mapChange_imageSelect").show();

  
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

    $("#mapChange_tagbox").empty();
    for(item of tagList){
      $("#mapChange_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    mapChange_setTag(tagList[0]);
  });
});

$("#mapChange_tagbox").on('change', (e) => {
  mapChange_setTag($("#mapChange_tagbox").val());
});

function mapChange_setTag(tag){
  $("#mapChange_imagearea").empty();
  let password = $("#mapChange_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#mapChange_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#mapChange_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}
$(document).on('click', '#mapChange_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#mapChange_imageSource").val(img.replace(ddf.base_url, ""));
  $("#mapChange_blank").prop("checked", false);
  $("#mapChange_mirrored").prop("checked", $("#mapChange_mirrored2").prop("checked"));
  mapChange_previewUpdate();
});

$("#mapChange_btnpassword").on('click', (e) => {
  $("#mapChange_btnpassword").hide();
  $("#mapChange_password").show().focus();
});

$("#mapChange_password").on('focusout', (e) => {
  $("#mapChange_btnpassword").show();
  $("#mapChange_password").hide();
  imageDelete_setTag($("#mapChange_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#mapChange_password").blur();
  }
});

$("#mapChange_send").on('click', (e) => {
  ddf.changeMap(
    "imageGraphic",
    $("#mapChange_blank").prop("checked")?"image/whiteBack.png":$("#mapChange_imageSource").val(),
    $("#mapChange_width").val(),
    $("#mapChange_height").val(),
    $("#mapChange_gridInterval").val(),
    $("#mapChange_isAlternately").prop("checked"),
    $("#mapChange_mirrored").prop("checked"),
    parseInt("0x"+$("#mapChange_color").val()),
    ddf.roomState.mapData.mapMarksAlpha,
    ddf.roomState.mapData.mapMarks).then((r) => {
    $("#mapChange_image").show();
    $("#mapChange_imageSelect").hide();
    $("#window_mapChange").hide();
  });
});