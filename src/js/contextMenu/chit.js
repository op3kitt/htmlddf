$.contextMenu({
  zIndex: 150,
  selector: '.chitFrame.draggableObj',
  items: {
    delete: {name: "チットの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.cmd.safeDragDestroy();
          character.obj && character.obj.remove();
          delete ddf.characters[opt.$trigger.attr("id")];
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    },
    copy: {name: "チットの複製",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        data = $.extend(true, {}, character.data);
        data.imgId = 0;
        ddf.addCharacter(data).then((r) => {
        });
      },
    }
  }
});
