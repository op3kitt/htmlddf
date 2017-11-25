
$("#btn_private").on('click', (e) => {
});
/*$("#btn_help").on('click', (e) => {
});*/
$("#btn_diceBotTable").on('click', (e) => {
});
$("#btn_novel").on('click', (e) => {
});
$("#btn_chatDelete").on('click', (e) => {
  if(confirm('チャットログを全て削除します。よろしいですか？') && confirm('削除したログは復旧できませんが、本当によろしいですか？')){
    ddf.deleteChatLog().then((r) => {
      ddf.sendChatMessage(0, "どどんとふ\t", "全チャットログ削除が正常に終了しました。", "00aa00", true);
    });      
  }
});
$("#btn_chatFont").on('click', (e) => {
});
$("#btn_mute").on('click', (e) => {
  ddf.roomState.playSound = !ddf.roomState.playSound;
  if(ddf.roomState.playSound){
    $("#btn_mute img").attr("src", "image/icons/sound.png");
    $("#btn_mute .helptext").text("音再生あり");
  }else{
    $("#btn_mute img").attr("src", "image/icons/sound_mute.png");
    $("#btn_mute .helptext").text("音再生なし");
  }
});
$("#btn_vote").on('click', (e) => {
});
$("#btn_alarm").on('click', (e) => {
});
$("#btn_cutIinList").on('click', (e) => {
});
$("#btn_easyUpload").on('click', (e) => {
});
$("#btn_talk").on('click', (e) => {
});

$("#btn_chatsend").on('click', (e) => {
  ddf.cmd.sendChatMessage(ddf.userState.channel, $("#chatname").val(), "", $("#dicebot").val(), $("#chattext").val(), ddf.userState.color)
  $("#chattext").val("");
});