$.contextMenu({
  zIndex: 150,
  selector: '#list_memo > div',
  items: {
    edit: {name: "共有メモの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.openMemo(opt.$trigger.attr("id"));
      },
    },
    delete: {name: "共有メモの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    }
  }
});
