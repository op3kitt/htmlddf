$("#btn_createchit").on("click", (e) => {
  chit_show("");
});

$("#window_chit input").on('change', chit_previewUpdate);

$(document).on('click', '#chit_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#chit_imageUrl").val(img.replace(ddf.base_url, ""));
  $("#chit_preview .inner").css("backgroundImage", `url(${img})`);
});

$("#chit_imageChange").on('click', (e) => {
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

    $("#chit_tagbox").empty();
    for(item of tagList){
      $("#chit_tagbox").append($(`<option>${encode(item)}</option>`));
    }
      $("#chit_tagbox").append($(`<option>${encode(item)}</option>`));
    chit_setTag(tagList[0]);
  });

  $("#chit_image").hide();
  $("#chit_imageSelect").show();
});


function chit_setTag(tag){
  $("#chit_imagearea").empty();
  let password = $("#chit_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#chit_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#chit_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}

ddf.cmd.chit_show = chit_show;
function chit_show(imgId){
  $("#window_chit").show().css("zIndex", 151);
  $(".draggable:not(#window_chit)").css("zIndex", 150);
  $("#chit_image").show();
  $("#chit_imageSelect").hide();

  var character;
  index = 0;
  reg = /^(\d+)$/;
  for(item in ddf.characters){
    if(v = reg.exec(ddf.characters[item].data.name)){
      index = Math.max(index, parseInt(v[1]));
    }
  }

  character = {
    type: "chit",
    width: 1,
    height: 1,
    imgId: "",
    draggable: true,
    imageUrl: "./image/defaultImageSet/pawn/pawnBlack.png",
    rotation: 0,
    info: "",
    x: 0,
    y: 0
  };

  $("#chit_imgId").val(character.imgId);

  $("#chit_width").val(character.width);
  $("#chit_height").val(character.height);
  $("#chit_info").val(character.info);
  $("#chit_imageUrl").val(character.imageUrl);

  chit_previewUpdate();
}

$("#chit_btnpassword").on('click', (e) => {
  $("#chit_btnpassword").hide();
  $("#chit_password").show().focus();
});

$("#chit_password").on('focusout', (e) => {
  $("#chit_btnpassword").show();
  $("#chit_password").hide();
  chit_setTag($("#chit_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#chit_password").blur();
  }
});

$("#chit_tagbox").on('change', (e) => {
  chit_setTag($("#chit_tagbox").val());
});

function chit_previewUpdate(){
  zoom = Math.min(1, 1 / $("#chit_width").val(), 1 / $("#chit_height").val());
  $("#chit_preview").css({
    width: $("#chit_width").val() * 50,
    height: $("#chit_height").val() * 50,
    transform: `scale(${zoom})`
  });
  $("#chit_preview .inner").css({
    backgroundImage: "url("+ddf.base_url+$("#chit_imageUrl").val()+")"
  });
}

$("#chit_close, #chit_close2").on("click", (e) => {
  $("#window_chit").hide();
});

var click = {
  x:0,
  y:0
};

$("#chit_preview").draggable({
  start: (event) => {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#chit_preview").clone();
    obj.addClass("chitFrame");
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
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece && !event.altKey){
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
        type: "chit",
        width: $("#chit_width").val(),
        height: $("#chit_height").val(),
        info: $("#chit_info").val(),
        imageUrl: $("#chit_imageUrl").val(),
        imgId: "",
        rotation: 0,
        info: $("#chit_info").val(),
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
      $("#window_chit").hide();
    },
});
