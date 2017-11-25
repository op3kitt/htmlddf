(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
$.contextMenu({
  selector: '#mapSurface',
  items: {
    addCharacter: {name: "キャラクター追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeDD3: {name: "魔法範囲追加(DD3版)",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeDD4: {name: "魔法範囲追加(DD4版)",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeLH: {name: "ログホライズン用範囲",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicTimer: {name: "魔法タイマー追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMapMask: {name: "マップマスク追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMapMarker: {name: "マップマーカー追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep1: "---------",
    addDiceSymbol: {name: "ダイスシンボル追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep2: "---------",
    addCardHolder: {name: "手札置き場の作成",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMessageCard: {name: "メッセージカードの追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep3: "---------",
    resetWindow: {name: "ウィンドウ配置初期化",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    }
  }
});
},{}]},{},[1]);
