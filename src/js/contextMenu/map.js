$.contextMenu({
  zIndex: 150,
  selector: '#mapSurface',
  items: {
    addCharacter: {name: "キャラクター追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.addCharacter_show("0");
      },
    },
    addMagicRangeDD3: {name: "魔法範囲追加(DD3版)",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeDD4: {name: "魔法範囲追加(DD4版)",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.magicRangeDD4th_show("0");
      },
    },
    addMagicRangeLH: {name: "ログホライズン用範囲",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.cmd.magicRangeLH_show("0");
      },
    },
    addMagicTimer: {name: "魔法タイマー追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMapMask: {name: "マップマスク追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        ddf.mapMask_show("");
      },
    },
    addMapMarker: {name: "マップマーカー追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep1: "---------",
    addDiceSymbol: {name: "ダイスシンボル追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep2: "---------",
    addCardHolder: {name: "手札置き場の作成",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMessageCard: {name: "メッセージカードの追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    sep3: "---------",
    resetWindow: {name: "ウィンドウ配置初期化",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    }
  }
});