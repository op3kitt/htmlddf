$("#btn_mapmask").on("click", (e) => {
  ddf.mapMask_show("");
});

$("#window_mapMask .slider").slider({min: 0,max: 1, step:0.05, stop: (e, ui) => {
    $("#mapMask_alpha").val(ui.value);
    mapMask_previewUpdate();
  }
});

$("#window_mapMask input").on('change', mapMask_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapMask_color").val(c.toHex());
  mapMask_previewUpdate();
};
$("#mapMask_color2").spectrum(sp_param);

ddf.mapMask_show = (imageId) => {
  $("#window_mapMask").show().css("zIndex", 151);
  $(".draggable:not(#window_mapMask)").css("zIndex", 150);

  var character;
  if(ddf.characters[imageId] != null){
    character = ddf.characters[imageId].data;
    $("#mapMask_change").show();
    $("#mapMask_create").hide();
    $("#mapMask_preview").addClass("edit");
    $("#mapMask_title").text("マスク変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }

    character = {
      type: "mapMask",
      name: index + 1,
      width: 3,
      height: 3,
      color: 0,
      alpha: 1,
      imgId: "",
      draggable: true,
      rotation: 0,
      x: 0,
      y: 0
    }

    $("#mapMask_change").hide();
    $("#mapMask_create").show();
    $("#mapMask_preview").removeClass("edit");
    $("#mapMask_title").text("マスク作成");
  }

  $("#mapMask_alpha").val(character.alpha);
  $("#window_mapMask .slider").slider("value", character.alpha);
  $("#mapMask_imageId").val(character.imgId);
  $("#mapMask_name").val(character.name);

  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#mapMask_width").val(character.width);
  $("#mapMask_height").val(character.height);
  $("#mapMask_color").val(color);
  $("#mapMask_color2").spectrum("set", "#"+color);

  mapMask_previewUpdate();
}

function mapMask_previewUpdate(){
  zoom = Math.min(1, 4.6 / $("#mapMask_width").val(),4.8 / $("#mapMask_height").val());
  $("#mapMask_preview").css("transform", `scale(${zoom})`);
  $("#mapMask_preview").css({
    width: $("#mapMask_width").val() * 50,
    height: $("#mapMask_height").val() * 50,
    opacity: $("#mapMask_alpha").val(),
    backgroundColor: "#"+$("#mapMask_color").val()
  });
}

$("#mapMask_close, #mapMask_close2").on("click", (e) => {
  $("#window_mapMask").hide();
});

var click = {
  x:0,
  y:0
};

$("#mapMask_preview").draggable({
  start: (event) =>  {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#mapMask_preview").clone();
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
        type: "mapMask",
        name: $("#mapMask_name").val(),
        width: $("#mapMask_width").val(),
        height: $("#mapMask_height").val(),
        color: parseInt("0x"+$("#mapMask_color").val()),
        alpha: $("#mapMask_alpha").val(),
        imgId: "",
        draggable: true,
        rotation: 0,
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
      if($("#mapMask_multiple").prop("checked")){
        $("#mapMask_name").val(parseInt($("#mapMask_name").val()) + 1)
      }else{
        $("#window_mapMask").hide();
      }
    },
    cancel: ".edit"
});


$("#mapMask_send").on('click', (e) => {
  imageId = $("#mapMask_imageId").val();
  character = ddf.characters[imageId].data;

  character.name = $("#mapMask_name").val();
  character.color = parseInt("0x"+$("#mapMask_color").val());
  character.width = $("#mapMask_width").val();
  character.height = $("#mapMask_height").val();
  character.alpha = $("#mapMask_alpha").val();

  ddf.changeCharacter(character).then((r) => {
    ddf.characters[imageId].data = character;
    ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character], "dummy\t"]]});
    $("#window_mapMask").hide();
  });
});