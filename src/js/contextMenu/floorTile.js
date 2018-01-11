function safeDragDestroy(){
  try{
    $(".floorTileFrame.draggableObj").draggable("destroy");
  }catch(e){}
}

$.contextMenu({
  zIndex: 150,
  selector: '.floorTileEditing .floorTileFrame',
  items: {
    edit: {name: "タイルの固定／固定解除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        safeDragDestroy();
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.draggable = !character.data.draggable;
        ddf.changeCharacter(character.data);
        character.obj.toggleClass("draggableObj");
        $(".floorTileFrame.draggableObj").draggable(ddf.dragOption);
      },
    },
    sep1: "---------",
    rotationR: {name: "右回転",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.rotation = character.data.rotation + 90 % 360;
        ddf.changeCharacter(character.data).then((r) => {
          ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
        });
      },
    },
    rotationF: {name: "180度回転",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.rotation = character.data.rotation + 180 % 360;
        ddf.changeCharacter(character.data).then((r) => {
          ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
        });
      },
    },
    rotationL: {name: "左回転",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        character.data.rotation = character.data.rotation + 270 % 360;
        ddf.changeCharacter(character.data).then((r) => {
          ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
        });
      },
    },
    sep2: "---------",
    delete: {name: "フロアタイルの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          safeDragDestroy();
          character.obj && character.obj.remove();
          delete ddf.characters[opt.$trigger.attr("id")];
          $(".floorTileFrame.draggableObj").draggable(ddf.dragOption);
        }
      },
    }
  }
});
