$("#btn_graveyard, #btn_graveyard2").on("click", (e) => {
  getGraveyardCharacterData();
  $("#window_graveyard").show().css("zIndex", 151);
  $(".draggable:not(#window_graveyard)").css("zIndex", 150);
});

$("#graveyard_close, #graveyard_close2").on("click", (e) => {
  $("#window_graveyard").hide();
});
$("#graveyard_resurrect").on("click", (e) => {
  ddf.resurrectCharacter($("#graveyard_characters").val());
  $("#graveyard_characters")[0].remove($("#graveyard_characters")[0].selectedIndex);
});
$("#graveyard_clear").on("click", (e) => {
  ddf.clearGraveyard().then((r) => {
    getGraveyardCharacterData();
  });
});
$("#graveyard_reload").on("click", (e) => {
  getGraveyardCharacterData();
});


function getGraveyardCharacterData(){
  return ddf.getGraveyardCharacterData().then((r) => {
    $("#graveyard_characters").empty();

    for(item of r){
      type = item.type;
      name = item.name;
      switch(item.type){
        case "mapMask":
          type = "マップマスク";
          break;
        case "characterData":
          type = "キャラクター";
          break;
        case "magicRangeMarker":
          type = "魔法範囲";
          break;
        case "LogHorizonRange":
          type = "ログホライズン攻撃範囲";
          break;
        case "MetalicGuardianDamageRange":
          type = "メタリックガーディアン攻撃範囲";
          break;
        case "MagicTimer":
          type = "魔法タイマー";
          break;
        case "chit":
          name = ""
          type = "チット";
          break;
        case "Memo":
          type = "共有メモ";
          name = item.message.split("\r")[0];
          break;
        case "diceSymbol":
          type = "ダイスシンボル";
          name = `[${item.ownerName}]のダイス`;
          break;
        case "magicRangeMarkerDD4th":
          type = "魔法範囲D&D4版";
          break;
      }
      $("#graveyard_characters").append($(`<option value="${item.imgId}">${encode(name)}[${type}]</option>`));
    }
  });
}