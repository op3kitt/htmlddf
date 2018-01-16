$("#btn_vote").on('click', (e) => {
  $("#vote_requiredCount").val(1);
  $("#vote_alerm").prop("checked", true);
  $("#vote_isSelect").hide();
  $("#vote_number").text(ddf.roomState.loginUserInfo.length - 1);
  $("#vote_question").val("");
  $("#window_vote").show().css("zIndex", 151);
  $(".draggable:not(#window_vote)").css("zIndex", 150);
});

$("#window_vote [name=vote]").on("click", (e) => {
  if($("#vote_alerm").prop("checked")){
    $("#vote_isSelect").hide();
  }else{
    $("#vote_isSelect").show();
  }
});

$("#vote_send").on("click", (e) => {
  if($("#vote_alerm").prop("checked")){
    ddf.sendChatMessage(0, ddf.userState.name+"\t", `###vote###{"question":"","isCallTheRoll":true,"callerId":"${ddf.info.uniqueId}","requiredCount":${$("#vote_requiredCount").val()}}`, ddf.userState.chatColor);
  }else{
    ddf.sendChatMessage(0, ddf.userState.name+"\t", `###vote###{"question":"${$("#vote_question").val()}","isCallTheRoll":false,"callerId":"${ddf.info.uniqueId}","requiredCount":${$("#vote_requiredCount").val()}}`, ddf.userState.chatColor);
  }
  $("#window_vote").hide();
});

$("#vote_close, #vote_close2").on('click', (e) => {
  $("#window_vote").hide();
});

ddf.cmd.vote_alerm_show = vote_alerm_show;
function vote_alerm_show(){
  $("#window_vote_alerm").show().css("zIndex", 151);
  $(".draggable:not(#window_vote_alerm)").css("zIndex", 150);
}

ddf.cmd.vote_select_show = vote_select_show;
function vote_select_show(question){
  $("#vote_select_text").text(question);
  $("#window_vote_select").show().css("zIndex", 151);
  $(".draggable:not(#window_vote_select)").css("zIndex", 150);
}

$("#vote_alerm_ok").on("click", (e) => {
  ddf.sendChatMessage(0, ddf.userState.name+"\t", `###vote_replay_readyOK###{"voteReplay":4,"isCallTheRoll":true}`, ddf.userState.chatColor);
  $("#window_vote_alerm").hide();
});
$("#vote_select_agree").on("click", (e) => {
  ddf.sendChatMessage(0, ddf.userState.name+"\t", `###vote_replay_readyOK###{"voteReplay":1,"isCallTheRoll":false}`, ddf.userState.chatColor);
  $("#window_vote_select").hide();
});
$("#vote_select_disagree").on("click", (e) => {
  ddf.sendChatMessage(0, ddf.userState.name+"\t", `###vote_replay_readyOK###{"voteReplay":2,"isCallTheRoll":false}`, ddf.userState.chatColor);
  $("#window_vote_select").hide();
});