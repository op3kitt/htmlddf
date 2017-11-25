$("#btn_rangedd4").on("click", (e) => {
  ddf.cmd.magicRangeDD4th_show("");
});

$("#magicRangeDD4th_close, #magicRangeDD4th_close2").on('click', (e) => {
  $("#window_magicRangeDD4th").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeDD4th_color").val(c.toHex());
};
$("#magicRangeDD4th_color2").spectrum(sp_param);

ddf.cmd.magicRangeDD4th_show = (imgId, x = 0, y = 0) => {
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeDD4th .title").text("魔法範囲変更（Ｄ＆Ｄ４版）");
    $("#magicRangeDD4th_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "magicRangeMarkerDD4th",
      name: index + 1,
      rangeType: "closeBurstDD4th",
      feets: 15,
      color: 0,
      timeRange: 1,
      info: "",
      isHide: false,
      size: 0,
      x: x,
      y: y,
      counters: {},
      statusAlias: {},
      createRound: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      initiative: 1,
      rotation: 0,
      size: 0
    };
    $("#window_magicRangeDD4th .title").text("魔法範囲作成（Ｄ＆Ｄ４版）");
    $("#magicRangeDD4th_send").text("追加");
  }
  $("#magicRangeDD4th_imgId").val(character.imgId);
  $("#magicRangeDD4th_name").val(character.name);
  $("#magicRangeDD4th_rangeType").val(character.rangeType);
  $("#magicRangeDD4th_feets").val(character.feets / 5);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeDD4th_color").val(color);
  $("#magicRangeDD4th_color2").spectrum("set", "#"+color);
  $("#magicRangeDD4th_timeRange").val(character.timeRange);
  $("#magicRangeDD4th_info").val(character.info);
  $("#magicRangeDD4th_isHide").prop("checked", !character.isHide);

  $("#window_magicRangeDD4th").show().css("zIndex", 61);
  $(".draggable:not(#window_magicRangeDD4th)").css("zIndex", 60);
};

$("#magicRangeDD4th_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeDD4th_imgId").val()]){

    character.data.name = $("#magicRangeDD4th_name").val();
    character.data.rangeType = $("#magicRangeDD4th_rangeType").val();
    character.data.feets = $("#magicRangeDD4th_feets").val() * 5;
    character.data.color = parseInt("0x"+$("#magicRangeDD4th_color").val());
    character.data.timeRange = $("#magicRangeDD4th_timeRange").val();
    character.data.info = $("#magicRangeDD4th_info").val();
    character.data.isHide = !$("#magicRangeDD4th_isHide").prop("checked");

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeDD4th").hide();
    });
  }else{

    character = {
      type: "magicRangeMarkerDD4th",
      /*name: index + 1,
      rangeType: "closeBurstDD4th",
      feets: 15,
      color: 0,
      timeRange: 1,
      info: "",
      isHide: false,*/
      size: 0,
      x: 1,
      y: 1,
      counters: {},
      statusAlias: {},
      createRound: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      initiative: 1,
      rotation: 0,
      size: 0
    };
    character.name = $("#magicRangeDD4th_name").val();
    character.rangeType = $("#magicRangeDD4th_rangeType").val();
    character.feets = $("#magicRangeDD4th_feets").val() * 5;
    character.color = parseInt("0x"+$("#magicRangeDD4th_color").val());
    character.timeRange = $("#magicRangeDD4th_timeRange").val();
    character.info = $("#magicRangeDD4th_info").val();
    character.isHide = !$("#magicRangeDD4th_isHide").prop("checked");

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeDD4th").hide();
    });
  }
});
