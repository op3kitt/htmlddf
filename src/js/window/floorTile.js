function safeDragDestroy(){
  try{
    $(".floorTileFrame.draggableObj").draggable("destroy");
  }catch(e){}
}

$("#btn_maptile").on("click", (e) => {
  floorTile_show("");
});
$("#window_floorTile input").on('change', floorTile_previewUpdate);

$(document).on('click', '#floorTile_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#floorTile_imageUrl").val(img.replace(ddf.base_url, ""));
  $("#floorTile_preview .inner").css("backgroundImage", `url(${img})`);
});

$("#floorTile_imageChange").on('click', (e) => {
  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["フロアタイル画像"];
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

    $("#floorTile_tagbox").empty();
    for(item of tagList){
      $("#floorTile_tagbox").append($(`<option>${encode(item)}</option>`));
    }
      $("#floorTile_tagbox").append($(`<option>${encode(item)}</option>`));
    floorTile_setTag(tagList[0]);
  });

  $("#floorTile_image").hide();
  $("#floorTile_imageSelect").show();
});


function floorTile_setTag(tag){
  $("#floorTile_imagearea").empty();
  let password = $("#floorTile_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#floorTile_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#floorTile_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}

ddf.cmd.floorTile_show = floorTile_show;
function floorTile_show(imgId){
  $("#map").addClass("floorTileEditing");
  $(".floorTileFrame.dragprev").removeClass("dragprev");
  $(".floorTileFrame.draggableObj").draggable(ddf.dragOption);
  $("#window_floorTile").show().css("zIndex", 151);
  $(".draggable:not(#window_floorTile)").css("zIndex", 150);
  $("#floorTile_image").show();
  $("#floorTile_imageSelect").hide();

  var character;
  index = 0;
  reg = /^(\d+)$/;
  for(item in ddf.characters){
    if(v = reg.exec(ddf.characters[item].data.name)){
      index = Math.max(index, parseInt(v[1]));
    }
  }

  character = {
    type: "floorTile",
    width: 10,
    height: 10,
    imgId: "",
    draggable: true,
    imageUrl: "./image/defaultImageSet/floorTiles/floorTile_001.jpg",
    rotation: 0,
    x: 0,
    y: 0
  };

  $("#floorTile_imgId").val(character.imgId);

  $("#floorTile_width").val(character.width);
  $("#floorTile_height").val(character.height);
  $("#floorTile_imageUrl").val(character.imageUrl);

  floorTile_previewUpdate();
}

$("#floorTile_btnpassword").on('click', (e) => {
  $("#floorTile_btnpassword").hide();
  $("#floorTile_password").show().focus();
});

$("#floorTile_password").on('focusout', (e) => {
  $("#floorTile_btnpassword").show();
  $("#floorTile_password").hide();
  floorTile_setTag($("#floorTile_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#floorTile_password").blur();
  }
});

$("#floorTile_tagbox").on('change', (e) => {
  floorTile_setTag($("#floorTile_tagbox").val());
});

function floorTile_previewUpdate(){
  zoom = Math.min(1, 3 / $("#floorTile_width").val(), 3 / $("#floorTile_height").val());
  $("#floorTile_preview").css({
    width: $("#floorTile_width").val() * 50,
    height: $("#floorTile_height").val() * 50,
    transform: `scale(${zoom})`
  });
  $("#floorTile_preview .inner").css({
    backgroundImage: "url("+ddf.base_url+$("#floorTile_imageUrl").val()+")"
  });
}

$("#floorTile_close, #floorTile_close2").on("click", (e) => {
  $("#window_floorTile").hide();
  $(".floorTileFrame").addClass("dragprev");
  safeDragDestroy();
  ddf.cmd.safeDragDestroy();
  $(".draggableObj").draggable(ddf.dragOption);
  $("#map").removeClass("floorTileEditing");
});

var click = {
  x:0,
  y:0
};

$("#floorTile_preview").draggable({
  start: (event) => {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#floorTile_preview").clone();
    obj.addClass("floorTileFrame draggableObj");
    obj.css("transform", "");
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
        type: "floorTile",
        width: $("#floorTile_width").val(),
        height: $("#floorTile_height").val(),
        imageUrl: $("#floorTile_imageUrl").val(),
        imgId: "",
        draggable: true,
        rotation: 0,
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
    },
});
