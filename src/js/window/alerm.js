$("#btn_alerm").on('click', (e) => {
  $("#alerm_name").empty();
  $("#alerm_name").append("<option>（全員）</option>")
  for(item of ddf.roomState.loginUserInfo){
    $("#alerm_name").append(`<option>${item.userName}</option>`);
  }
  $("#alerm_name").val("（全員）");
  $("#alerm_file").val("./sound/alarm.mp3");
  $("#alerm_second").val(0);
  $("#window_alerm").show().css("zIndex", 151);
  $(".draggable:not(#window_alerm)").css("zIndex", 150);
});

$("#alerm_send").on("click", (e) => {
  ddf.sendChatMessage(0, ddf.userState.name+"\t", `[アラーム発生：${$("#alerm_name").val()}]:${$("#alerm_file").val()}${parseInt($("#alerm_second").val())>0?":"+$("#alerm_second").val()+"秒後":""}`, ddf.userState.chatColor);
  $("#window_alerm").hide();
});

$("#alerm_close, #alerm_close2").on('click', (e) => {
  $("#window_alerm").hide();
});

