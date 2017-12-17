
ddf.cmd.roomDelete_show = roomDelete_show;
function roomDelete_show(roomNumber) {
  $("#roomDelete_roomNumber").val(roomNumber);
  $("#roomDelete_Number").text(roomNumber);
  $("#roomDelete_password").val("");
  
  $("#window_roomDelete").show().css("zIndex", 151);
  $(".draggable:not(#window_roomDelete)").css("zIndex", 150);
}

$("#roomDelete_close, #roomDelete_close2").on('click', (e) => {
  $("#window_roomDelete").hide();
});

$("#roomDelete_send, #roomDelete_close2").on('click', (e) => {
  ddf.removePlayRoom(
    $("#roomDelete_roomNumber").val(),
    true,
    $("#roomDelete_password").val()
  ).then((r) => {
    if(r.deletedRoomNumbers.length > 0){
      $("#window_roomDelete").hide();
      $("#playRoomInfos tbody").empty();
      ddf.cmd.getPlayRoomInfo();
    }else{
      alert("パスワードが違います。");
    }
  });
});