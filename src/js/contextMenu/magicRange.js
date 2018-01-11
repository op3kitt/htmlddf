$.contextMenu({
  zIndex: 150,
  selector: '.magicRangeFrame',
  items: {
    edit: {name: "魔法範囲の変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        switch(character.data.type){
          case "LogHorizonRange":
            ddf.cmd.magicRangeLH_show(opt.$trigger.attr("id"));
            break;
          case "magicRangeMarker":
            ddf.cmd.magicRangeMarker_show(opt.$trigger.attr("id"));
            break;
          case "magicRangeMarkerDD4th":
            ddf.cmd.magicRangeDD4th_show(opt.$trigger.attr("id"));
            break;
          case "MetallicGuardianDamageRange":
            ddf.cmd.magicRangeMG_show(opt.$trigger.attr("id"));
            break;
        }
      },
    },
    delete: {name: "魔法範囲の削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.cmd.safeDragDestroy();
          character.obj && character.obj.remove();
          delete ddf.characters[opt.$trigger.attr("id")];
          if(ddf.roomState.ini_characters[opt.$trigger.attr("id")]){
            delete ddf.roomState.ini_characters[opt.$trigger.attr("id")];
          }
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    },
    rotationR: {name: "右回転",
      visible: function(key, opt){
          return opt.$trigger && ddf.characters[opt.$trigger.attr("id")] && ddf.characters[opt.$trigger.attr("id")].data.type == "MetallicGuardianDamageRange";
      },
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.rotation = character.data.rotation + 90 % 360;
        ddf.changeCharacter(character.data).then((r) => {
          ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
        });
      },
    },
    rotationL: {name: "左回転",
      visible: function(key, opt){
          return opt.$trigger && ddf.characters[opt.$trigger.attr("id")] && ddf.characters[opt.$trigger.attr("id")].data.type == "MetallicGuardianDamageRange";
      },
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.rotation = character.data.rotation + 270 % 360;
        ddf.changeCharacter(character.data).then((r) => {
          ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
        });
      },
    }
  }
});
