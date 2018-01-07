$("#btn_createchit").on("click", (e) => {
  chit_show("");
});

$("#window_chit input").on('change', chit_previewUpdate);

ddf.cmd.chit_show = chit_show;
function chit_show(imgId){
  $("#window_chit").show().css("zIndex", 151);
  $(".draggable:not(#window_chit)").css("zIndex", 150);

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
  };

  $("#chit_imgId").val(character.imgId);

  $("#chit_width").val(character.width);
  $("#chit_height").val(character.height);
  $("#chit_info").val(character.info);
  $("#chit_imageUrl").val(character.imageUrl);

  chit_previewUpdate();
}

function chit_previewUpdate(){
  zoom = Math.min(1, 4.6 / $("#chit_width").val(),4.8 / $("#chit_height").val());
  $("#chit_preview").css("transform", `scale(${zoom})`);
  $("#chit_preview").css({
    width: $("#chit_width").val() * 50,
    height: $("#chit_height").val() * 50,
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
        type: "chit",
        width: $("#chit_width").val(),
        height: $("#chit_height").val(),
        info: $("#chit_info").val(),
        isPaint: $("#chit_isPaint").prop("checked"),
        imageUrl: $("#chit_imageUrl").val(),
        imgId: "",
        draggable: !$("#chit_draggable").prop("checked"),
        rotation: 0,
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
      $("#window_chit").hide();
    },
});
