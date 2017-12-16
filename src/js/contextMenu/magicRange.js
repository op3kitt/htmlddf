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
          case "magicRangeMarkerDD4th":
            ddf.cmd.magicRangeDD4th_show(opt.$trigger.attr("id"));
            break;
        }
      },
    },
    delete: {name: "魔法範囲の削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          delete ddf.characters[opt.$trigger.attr("id")];
          if(ddf.roomState.ini_characters[opt.$trigger.attr("id")]){
            delete ddf.roomState.ini_characters[opt.$trigger.attr("id")];
          }
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    }
  }
});
