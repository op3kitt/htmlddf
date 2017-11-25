(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$.contextMenu({
  selector: '#list_memo > div',
  items: {
    edit: {name: "共有メモの変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        //ddf.removeCharacter(opt.$trigger.attr("id"), true);
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

},{}]},{},[1]);
