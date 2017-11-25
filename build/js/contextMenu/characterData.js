(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$.contextMenu({
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
        index = Math.max.apply(null, $.map(ddf.characters, function(pattern){return function(v){
          return (v = pattern.exec(v.data.name))?v[1]:0;
        };}(new RegExp(basename+"_(\\d+)")))) + 1;
        data = $.extend(true, {}, character.data);
        data.name = basename + "_" + index;
        data.dogTag = index;
        data.imgId = 0;
        ddf.addCharacter(data);
      },
    }
  }
});
},{}]},{},[1]);
