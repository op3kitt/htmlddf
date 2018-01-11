$.contextMenu({
  zIndex: 150,
  selector: '.mapMarkerFrame',
  items: {
    edit: {name: "マップマーカーの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        ddf.cmd.mapMarker_show(opt.$trigger.attr("id"));
      },
    },
    delete: {name: "マップマーカーの削除",
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
    }
  }
});
