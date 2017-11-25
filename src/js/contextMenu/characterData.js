$.contextMenu({
  zIndex: 150,
  selector: '.characterFrame',
  items: {
    edit: {name: "キャラクターの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        //ddf.removeCharacter(opt.$trigger.attr("id"), true);
      },
    },
    sep1: "---------",
    delete: {name: "キャラクターの削除",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.removeCharacter(opt.$trigger.attr("id"), true);
        character = ddf.characters[opt.$trigger.attr("id")];
        if(character){
          ddf.safeDragDestoroy();
          character.obj && character.obj.remove();
          character.row && character.row.remove();
          ddf.characters[opt.$trigger.attr("id")] = null;
          $(".draggableObj").draggable(ddf.dragOption);
        }
      },
    },
    sep2: "---------",
    copy: {name: "キャラクターの複製",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        basename = character.data.name.replace(/_\d+$/, "");
        index = 0;
        reg = new RegExp(basename+"_(\\d+)");
        for(item in ddf.characters){
          if(v = reg.exec(ddf.characters[item].data.name)){
            index = Math.max(index, parseInt(v[1]))
          }
        }
        data = $.extend(true, {}, character.data);
        data.name = basename + "_" + index + 1;
        data.dogTag = index + 1;
        data.imgId = 0;
        ddf.addCharacter(data);
      },
    }
  }
});