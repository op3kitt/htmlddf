$("#btn_rangemg").on("click", (e) => {
  ddf.cmd.magicRangeMG_show("0");
});

$("#magicRangeMG_close, #magicRangeMG_close2").on('click', (e) => {
  $("#window_magicRangeMG").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeMG_color").val(c.toHex());
};
$("#magicRangeMG_color2").spectrum(sp_param);

ddf.cmd.magicRangeMG_show = magicRangeMG_show;
function magicRangeMG_show(imgId, x = 0, y = 0){
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeMG .title").text("攻撃範囲変更");
    $("#magicRangeMG_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "MetallicGuardianDamageRange",
      name: index + 1,
      maxRange: 1,
      minRange: 0,
      color: 0,
      size: 0,
      x: x,
      y: y,
      draggable: true,
      imageName: "",
      imgId: "0",
      rotation: 0
    };
    $("#window_magicRangeMG .title").text("攻撃範囲追加");
    $("#magicRangeMG_send").text("追加");
  }
  $("#magicRangeMG_imgId").val(character.imgId);
  $("#magicRangeMG_name").val(character.name);
  $("#magicRangeMG_maxRange").val(character.maxRange);
  $("#magicRangeMG_minRange").val(character.minRange);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeMG_color").val(color);
  $("#magicRangeMG_color2").spectrum("set", "#"+color);

  $("#window_magicRangeMG").show().css("zIndex", 151);
  $(".draggable:not(#window_magicRangeMG)").css("zIndex", 150);
}

$("#magicRangeMG_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeMG_imgId").val()]){

    character.data.name = $("#magicRangeMG_name").val();
    character.data.maxRange = $("#magicRangeMG_maxRange").val();
    character.data.minRange = $("#magicRangeMG_minRange").val();
    character.data.color = parseInt("0x"+$("#magicRangeMG_color").val());

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeMG").hide();
    });
  }else{

    character = {
      type: "MetallicGuardianDamageRange",
      minRange: 0,
      maxRange: 0,
      x: 1,
      y: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      rotation: 0
    };
    character.name = $("#magicRangeMG_name").val();
    character.maxRange = $("#magicRangeMG_maxRange").val();
    character.minRange = $("#magicRangeMG_minRange").val();
    character.color = parseInt("0x"+$("#magicRangeMG_color").val());

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeMG").hide();
    });
  }
});
