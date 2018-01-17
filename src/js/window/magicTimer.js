$("#btn_magictimer").on("click", (e) => {
  ddf.cmd.magicTimer_show("");
});

$("#magicTimer_close, #magicTimer_close2").on('click', (e) => {
  $("#window_magicTimer").hide();
});

ddf.cmd.magicTimer_show = magicTimer_show
function magicTimer_show(imgId){
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicTimer .title").text("魔法タイマー変更");
    $("#magicTimer_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "MagicTimer",
      name: index + 1,
      createRound: ddf.roomState.roundTimeData.round,
      timeRange: 1,
      initiative: ddf.roomState.roundTimeData.initiative,
      info: "",
      counters: {},
      statusAlias: {},
      imgId: "0",
      rotation: 0
    };
    $("#window_magicTimer .title").text("魔法タイマー作成");
    $("#magicTimer_send").text("追加");
  }
  $("#magicTimer_imgId").val(character.imgId);
  $("#magicTimer_name").val(character.name);
  $("#magicTimer_timeRange").val(character.timeRange);
  $("#magicTimer_createRound").val(character.createRound);
  $("#magicTimer_initiative").val(character.initiative);
  $("#magicTimer_info").val(character.info);

  $("#window_magicTimer").show().css("zIndex", 151);
  $(".draggable:not(#window_magicTimer)").css("zIndex", 150);
}

$("#magicTimer_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicTimer_imgId").val()]){

    character.data.name = $("#magicTimer_name").val();
    character.data.timeRange = $("#magicTimer_timeRange").val();
    character.data.createRound = $("#magicTimer_createRound").val();
    character.data.initiative = $("#magicTimer_initiative").val();
    character.data.info = $("#magicTimer_info").val();

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicTimer").hide();
    });
  }else{

    character = {
      type: "MagicTimer",
      counters: {},
      statusAlias: {},
      imgId: "0"
    };
    character.name = $("#magicTimer_name").val();
    character.timeRange = $("#magicTimer_timeRange").val();
    character.createRound = $("#magicTimer_createRound").val();
    character.initiative = $("#magicTimer_initiative").val();
    character.info = $("#magicTimer_info").val();

    ddf.addCharacter(character).then((r) => {
      $("#window_magicTimer").hide();
      ddf.cmd.initiative_sort(true);
    });
  }
});
