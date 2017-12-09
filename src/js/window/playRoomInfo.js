
$("#btn_member").on('click', (e) => {
  playRoomInfo_show();
});

$("#playRoomInfo_close, #playRoomInfo_close2").on('click', (e) => {
  $("#window_playRoomInfo").hide();
});

playRoomInfo_show = () => {
  text = `【${ddf.roomState.playRoomName}】\n\nログイン中メンバー一覧\n`;

  text += ddf.roomState.loginUserInfo.map((v)=>{return `${v.userName}（ユーザーID：${v.userId.split("\t")[0]}）`}).join("\n");

  $("#playRoomInfo_main").html(text.replace(/\n/g, "<br>"));
  $("#window_playRoomInfo").show();
};
