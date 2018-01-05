$("#btn_mapMarker").on("click", (e) => {
  ddf.mapMarker_show("");
});

$("#window_mapMarker .slider").slider({min: 0,max: 1, step:0.05, stop: (e, ui) => {
    $("#mapMarker_alpha").val(ui.value);
    mapMarker_previewUpdate();
  }
});

$("#window_mapMarker input").on('change', mapMarker_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapMarker_color").val(c.toHex());
  mapMarker_previewUpdate();
};
$("#mapMarker_color2").spectrum(sp_param);

ddf.cmd.mapMarker_show = mapMarker_show;
function mapMarker_show(imgId){
  $("#window_mapMarker").show().css("zIndex", 151);
  $(".draggable:not(#window_mapMarker)").css("zIndex", 150);

  var character;
  if(ddf.characters[imgId] != null){
    character = ddf.characters[imgId].data;
    $("#mapMarker_change").show();
    $("#mapMarker_create").hide();
    $("#mapMarker_preview").addClass("edit");
    $("#mapMarker_title").text("マップマーカー変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }

    character = {
      type: "mapMarker",
      name: index + 1,
      width: 1,
      height: 1,
      color: 0,
      imgId: "",
      isPaint: false,
      draggable: true,
      rotation: 0,
      message: "",
      x: 0,
      y: 0
    }

    $("#mapMarker_change").hide();
    $("#mapMarker_create").show();
    $("#mapMarker_preview").removeClass("edit");
    $("#mapMarker_title").text("マップマーカー作成");
  }

  $("#mapMarker_imgId").val(character.imgId);

  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#mapMarker_width").val(character.width);
  $("#mapMarker_height").val(character.height);
  $("#mapMarker_color").val(color);
  $("#mapMarker_color2").spectrum("set", "#"+color);
  $("#mapMarker_message").val(character.message);
  $("#mapMarker_isPaint").prop("checked", character.isPaint);
  $("#mapMarker_draggable").prop("checked", !character.draggable);

  mapMarker_previewUpdate();
}

function mapMarker_previewUpdate(){
  zoom = Math.min(1, 4.6 / $("#mapMarker_width").val(),4.8 / $("#mapMarker_height").val());
  $("#mapMarker_preview").css("transform", `scale(${zoom})`);
  $("#mapMarker_preview").css({
    width: $("#mapMarker_width").val() * 50,
    height: $("#mapMarker_height").val() * 50,
    backgroundColor: $("#mapMarker_isPaint").prop("checked")?"#"+$("#mapMarker_color").val():""
  });
  color = parseInt("0x" + $("#mapMarker_color").val());
  refColor = [255 - (color / 65536 & 0xFF), 255 - (color / 256 & 0xFF), 255 - (color & 0xFF)];
  $("#mapMarker_preview .message").text($("#mapMarker_message").val());
  $("#mapMarker_preview .message").css({
    color: "rgb("+refColor+")"
  });
}

$("#mapMarker_close, #mapMarker_close2").on("click", (e) => {
  $("#window_mapMarker").hide();
});

var click = {
  x:0,
  y:0
};

$("#mapMarker_preview").draggable({
  start: (event) =>  {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#mapMarker_preview").clone();
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
        type: "mapMarker",
        width: $("#mapMarker_width").val(),
        height: $("#mapMarker_height").val(),
        color: parseInt("0x"+$("#mapMarker_color").val()),
        message: $("#mapMarker_message").val(),
        isPaint: $("#mapMarker_isPaint").prop("checked"),
        imgId: "",
        draggable: !$("#mapMarker_draggable").prop("checked"),
        rotation: 0,
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
      if(!$("#mapMarker_multiple").prop("checked")){
        $("#window_mapMarker").hide();
      }
    },
    cancel: ".edit"
});


$("#mapMarker_send").on('click', (e) => {
  imgId = $("#mapMarker_imgId").val();
  character = ddf.characters[imgId].data;

  character.color = parseInt("0x"+$("#mapMarker_color").val());
  character.width = $("#mapMarker_width").val();
  character.height = $("#mapMarker_height").val();
  character.message = $("#mapMarker_message").val();
  character.isPaint = $("#mapMarker_isPaint").prop("checked");
  character.draggable = !$("#mapMarker_draggable").prop("checked");

  ddf.changeCharacter(character).then((r) => {
    ddf.characters[imgId].data = character;
    ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character], "dummy\t"]]});
    $("#window_mapMarker").hide();
  });
});