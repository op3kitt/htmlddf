$.contextMenu({
  zIndex: 150,
  selector: '.mapMaskFrame.draggableObj',
  items: {
    edit: {name: "マップマスクの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.mapMask_show(opt.$trigger.attr("id"));
      },
    },
    fix: {name: "マップマスクの固定",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.safeDragDestoroy();
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.draggable = false;
        ddf.changeCharacter(character.data);
        character.obj.removeClass("draggableObj");
        $(".draggableObj").draggable(ddf.dragOption);
      },
    },
    delete: {name: "マップマスクの削除",
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

$.contextMenu({
  selector: '.mapMaskFrame:not(.draggableObj)',
  items: {
    delete: {name: "マップマスクの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      }
    }
  }
});