$("#btn_rangelh").on("click", (e) => {
  ddf.cmd.magicRangeLH_show("0");
});

$("#magicRangeLH_close, #magicRangeLH_close2").on('click', (e) => {
  $("#window_magicRangeLH").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeLH_color").val(c.toHex());
};
$("#magicRangeLH_color2").spectrum(sp_param);

ddf.cmd.magicRangeLH_show = magicRangeLH_show;
function magicRangeLH_show(imgId, x = 0, y = 0){
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeLH .title").text("攻撃範囲変更");
    $("#magicRangeLH_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "LogHorizonRange",
      name: index + 1,
      range: 1,
      color: 0,
      size: 0,
      x: x,
      y: y,
      draggable: true,
      imageName: "",
      imgId: "0",
      rotation: 0,
      size: 0
    };
    $("#window_magicRangeLH .title").text("攻撃範囲追加");
    $("#magicRangeLH_send").text("追加");
  }
  $("#magicRangeLH_imgId").val(character.imgId);
  $("#magicRangeLH_name").val(character.name);
  $("#magicRangeLH_range").val(character.range);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeLH_color").val(color);
  $("#magicRangeLH_color2").spectrum("set", "#"+color);

  $("#window_magicRangeLH").show().css("zIndex", 151);
  $(".draggable:not(#window_magicRangeLH)").css("zIndex", 150);
}

$("#magicRangeLH_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeLH_imgId").val()]){

    character.data.name = $("#magicRangeLH_name").val();
    character.data.range = $("#magicRangeLH_range").val();
    character.data.color = parseInt("0x"+$("#magicRangeLH_color").val());

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeLH").hide();
    });
  }else{

    character = {
      type: "LogHorizonRange",
      size: 0,
      x: 1,
      y: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      rotation: 0,
      size: 0
    };
    character.name = $("#magicRangeLH_name").val();
    character.range = $("#magicRangeLH_range").val();
    character.color = parseInt("0x"+$("#magicRangeLH_color").val());

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeLH").hide();
    });
  }
});
