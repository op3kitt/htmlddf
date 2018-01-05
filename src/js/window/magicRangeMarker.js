$("#btn_rangedd3").on("click", (e) => {
  ddf.cmd.magicRangeMarker_show("");
});

$("#magicRangeMarker_close, #magicRangeMarker_close2").on('click', (e) => {
  $("#window_magicRangeMarker").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeMarker_color").val(c.toHex());
};
$("#magicRangeMarker_color2").spectrum(sp_param);

ddf.cmd.magicRangeMarker_show = magicRangeMarker_show
function magicRangeMarker_show(imgId, x = 0, y = 0){
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeMarker .title").text("魔法範囲変更");
    $("#magicRangeMarker_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "magicRangeMarker",
      name: index + 1,
      rangeType: "circle",
      feets: 5,
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
    $("#window_magicRangeMarker .title").text("魔法範囲作成");
    $("#magicRangeMarker_send").text("追加");
  }
  $("#magicRangeMarker_imgId").val(character.imgId);
  $("#magicRangeMarker_name").val(character.name);
  $("#magicRangeMarker_rangeType").val(character.rangeType);
  $("#magicRangeMarker_feets").val(character.feets);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeMarker_color").val(color);
  $("#magicRangeMarker_color2").spectrum("set", "#"+color);
  $("#magicRangeMarker_timeRange").val(character.timeRange);
  $("#magicRangeMarker_info").val(character.info);
  $("#magicRangeMarker_isHide").prop("checked", !character.isHide);

  $("#window_magicRangeMarker").show().css("zIndex", 151);
  $(".draggable:not(#window_magicRangeMarker)").css("zIndex", 150);
}

$("#magicRangeMarker_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeMarker_imgId").val()]){

    character.data.name = $("#magicRangeMarker_name").val();
    character.data.rangeType = $("#magicRangeMarker_rangeType").val();
    character.data.feets = $("#magicRangeMarker_feets").val();
    character.data.color = parseInt("0x"+$("#magicRangeMarker_color").val());
    character.data.timeRange = $("#magicRangeMarker_timeRange").val();
    character.data.info = $("#magicRangeMarker_info").val();
    character.data.isHide = !$("#magicRangeMarker_isHide").prop("checked");

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeMarker").hide();
    });
  }else{

    character = {
      type: "magicRangeMarker",
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
    character.name = $("#magicRangeMarker_name").val();
    character.rangeType = $("#magicRangeMarker_rangeType").val();
    character.feets = $("#magicRangeMarker_feets").val();
    character.color = parseInt("0x"+$("#magicRangeMarker_color").val());
    character.timeRange = $("#magicRangeMarker_timeRange").val();
    character.info = $("#magicRangeMarker_info").val();
    character.isHide = !$("#magicRangeMarker_isHide").prop("checked");

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeMarker").hide();
      ddf.cmd.initiative_sort(true);
    });
  }
});
