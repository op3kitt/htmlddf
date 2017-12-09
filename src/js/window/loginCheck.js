$("#loginCheck_close, #loginCheck_close2").on('click', (e) => {
  $("#window_loginCheck").hide();
});

ddf.cmd.loginCheck_show = loginCheck_show;
function loginCheck_show(roomNumber){
    room = ddf.roomInfos[roomNumber]

    $("#loginCheck_roomNumber").val(roomNumber);
    $("#loginCheck_playRoomName").text(room.playRoomName);
    if(room.canVisit){
      $("#loginCheck_canVisit").show();
    }else{
      $("#loginCheck_canVisit").hide();
    }
    if(room.passwordLockState){
      $("#loginCheck_passwordLockState").show();
    }else{
      $("#loginCheck_passwordLockState").hide();
    }
    $("[name=isVisit][value=0]").prop("checked");
    $("#loginCheck_password").val("");

    $("#window_loginCheck").show().css("zIndex", 151);
    $(".draggable:not(#window_loginCheck)").css("zIndex", 150);
}

$("#loginCheck_send").on('click', (e) => {
  roomNumber = parseInt($("#loginCheck_roomNumber").val());
  ddf.loginPassword(roomNumber, $("#loginCheck_password").val(), $("[name=isVisit]:checked").val()==1).then((r) => {
    if(r.resultText == "OK"){
      ddf.cmd.checkRoomStatus(parseInt($("#loginCheck_roomNumber").val()),$("[name=isVisit]:checked").val()==1,$("#loginCheck_password").val());
    }else{
      alert("パスワードが違います。");
    }
  });
});