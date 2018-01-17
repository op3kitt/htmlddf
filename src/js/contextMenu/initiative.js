$.contextMenu({
  zIndex: 155,
  selector: '#initiative tbody tr',
  items: {
    delete: {name: "対象の削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.cmd.safeDragDestroy();
          character.obj && character.obj.remove();
          character.row && character.row.remove();
          delete ddf.characters[opt.$trigger.attr("id")];
          delete ddf.roomState.ini_characters[opt.$trigger.attr("id")];
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    },
    edit: {name: "対象の変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          switch(character.data.type){
            case "characterData":
              ddf.cmd.addCharacter_show(character.data.imgId, true);
              break;
            case "magicRangeMarker":
              ddf.cmd.magicRangeMarker_show(character.data.imgId);
              break;
            case "magicRangeMarkerDD4th":
              ddf.cmd.magicRangeDD4th_show(character.data.imgId);
              break;
            case "MagicTimer":
              ddf.cmd.magicTimer_show(character.data.imgId);
              break;
          }
        }
      }
    }
  }
});
