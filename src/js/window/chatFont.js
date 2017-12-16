$("#btn_chatFont").on('click', (e) => {
  $("#chatFont_chatColor").val(ddf.userState.chatColor);
  $("#chatFont_chatColor2").spectrum('set', "#"+ddf.userState.chatColor);
  $("#chatFont_backgroundColor").val(ddf.userState.backgroundColor);
  $("#chatFont_backgroundColor2").spectrum('set', "#"+ddf.userState.backgroundColor);

  $("#chatFont_fontSize").val(ddf.userState.fontSize);
  $("#chatFont_showTime").prop("checked", ddf.userState.showTime);

  $("#window_chatFont").show().css("zIndex", 151);
  $(".draggable:not(#window_chatFont)").css("zIndex", 150);
});

$("#chatFont_close, #chatFont_close2").on('click', (e) => {
  $("#window_chatFont").hide();    
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#chatFont_chatColor").val(c.toHex());
};
$("#chatFont_chatColor2").spectrum(sp_param);
sp_param2 = require("../.option.spectrum.json");
sp_param2.change = (c) => {
  $("#chatFont_backgroundColor").val(c.toHex());
};
$("#chatFont_backgroundColor2").spectrum(sp_param2);

$("#chatFont_send").on('click', (e) => {
  ddf.userState.chatColor = $("#chatFont_chatColor").val();
  ddf.userState.backgroundColor = $("#chatFont_backgroundColor").val();
  ddf.userState.fontSize = $("#chatFont_fontSize").val();
  ddf.userState.showTime = $("#chatFont_showTime").prop("checked");

  ddf.cmd.saveUserState();
  $("#log > div, #chattext").css({
    backgroundColor: "#"+ddf.userState.backgroundColor,
    fontSize: ddf.userState.fontSize+"pt"
  });
  $("#window_chatFont").hide();
});