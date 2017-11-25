(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
  "name": "DodontoF_html5cli",
  "version": "1.0.0",
  "description": "DodontoF.rb client build package",
  "main": "gulpfile.js",
  "dependencies": {
    "browserify": "^14.4.0",
    "ddf": "^1.0.0",
    "gulp": "^3.9.1",
    "gulp-cssnano": "^2.1.2",
    "gulp-pug": "^3.3.0",
    "gulp-rename": "^1.2.2",
    "gulp-sass": "^3.1.0",
    "gulp-sourcemaps": "^2.6.1",
    "gulp-watchify": "^0.7.0",
    "uglifyify": "^4.0.5",
    "minami": "^1.2.3",
    "msgpack-lite": "^0.1.26",
    "store": "^2.0.12",
    "vinyl-buffer": "^1.0.0",
    "watchify": "^3.9.0",
    "del": "^3.0.0"
  },
  "devDependencies": {},
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "kitt @ttikitt <yosshi1123@gmail.com>",
  "license": "MIT",
  "directories": {
    "doc": "doc"
  }
}

},{}],2:[function(require,module,exports){
module.exports=ddf.config = {
  originalColorPalette: false, //true���w�肷���Ƃǂǂ��ƂӂƓ����ɂȂ��B
  base_url: "https://tools.cry-kit.com/ddf/public_html/DodontoF/"
}
},{}],3:[function(require,module,exports){
module.exports={
  clickoutFiresChange: true,
  showInput: true,
  preferredFormat: "hex",
  showPalette: true,
  showSelectionPalette: false,
  hideAfterPaletteSelect:true,
  chooseText: "選択",
  cancelText: "キャンセル",
  containerClassName: ddf.config.originalColorPalette?"originalColorSet":"",
  palette: ddf.config.originalColorPalette?
  [
    ["#000000","#000000","#003300","#006600","#009900","#00CC00","#00FF00","#330000","#333300","#336600","#339900","#33CC00","#33FF00","#660000","#663300","#666600","#669900","#66CC00","#66FF00"],
    ["#333333","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#660033","#663333","#666633","#669933","#66CC33","#66FF33"],
    ["#666666","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#660066","#663366","#666666","#669966","#66CC66","#66FF66"],
    ["#999999","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#660099","#663399","#666699","#669999","#66CC99","#66FF99"],
    ["#CCCCCC","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC"],
    ["#FFFFFF","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF"],
    ["#FF0000","#990000","#993300","#996600","#999900","#99CC00","#99FF00","#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00"],
    ["#0000FF","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33"],
    ["#00FF00","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66"],
    ["#FF00FF","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99"],
    ["#00FFFF","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC"],
    ["#FFFF00","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"]
  ]
: [
    ["#FFFFFF","#FF2800","#FF2879","#FF9900","#FAF500","#CBF266","#35A16B","#0041FF","#9A28C9","#9A0079","#663300"],
    ["#CCCCCC","#991800","#991848","#995B00","#969300","#79913D","#1F6040","#002799","#5C1878","#5C0048","#3D1E00"],
    ["#999999","#4C0C00","#4C0C24","#4C2D00","#4B4900","#3C481E","#0F3020","#00134C","#2E0C3C","#2E0024","#1E0F00"],
    ["#666666","#FF6050","#FF99A0","#FFD1D1","#FFFF99","#DFFF99","#87E7B0","#66CCFF","#C8B9FA","#E5B2DE","#EDC58F"],
    ["#333333","#993930","#995B60","#997D7D","#99995B","#85995B","#518A69","#3D7A99","#786F96","#896A85","#8E7655"],
    ["#000000","#4C1C18","#4C2D30","#4C3E3E","#4C4C2D","#424C2D","#284534","#1E3D4C","#3C374B","#443542","#473B2A"]
  ]
}
},{}],4:[function(require,module,exports){
$(() => {
  require("./map.js");
  require("./characterData.js");
  require("./mapMask.js");
  require("./memo.js");
  require("./magicRange.js");
});
},{"./characterData.js":5,"./magicRange.js":6,"./map.js":7,"./mapMask.js":8,"./memo.js":9}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '.magicRangeFrame',
  items: {
    edit: {name: "魔法範囲の変更",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        character = ddf.characters[opt.$trigger.attr("id")];
        switch(character.data.rangeType){
          case "closeBurstDD4th":
          case "blastDD4th":
            ddf.cmd.magicRangeDD4th_show(opt.$trigger.attr("id"));
            break;
        }
      },
    },
    delete: {name: "魔法範囲の削除",
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

},{}],7:[function(require,module,exports){
$.contextMenu({
  zIndex: 150,
  selector: '#mapSurface',
  items: {
    addCharacter: {name: "キャラクター追加",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeDD3: {name: "魔法範囲追加(DD3版)",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicRangeDD4: {name: "魔法範囲追加(DD4版)",
      callback: function(itemKey, opt, rootMenu, originalEvent) {
        magicRangeDD4th_show(0);
      },
    },
    addMagicRangeLH: {name: "ログホライズン用範囲",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMagicTimer: {name: "魔法タイマー追加",
      disabled: true, 
      callback: function(itemKey, opt, rootMenu, originalEvent) {
      },
    },
    addMapMask: {name: "マップマスク追加",
      disabled: true, 
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
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
ddf.cmd = {};

var screenshot = require('./screenshot.js').generate;
var lang = "Japanese";

require("./.config.json");
ddf.base_url = ddf.config.base_url;

require("./contextMenu/.loading.js");
require("./window/.loading.js");
require("./room_menu.js");

window_focus = true;
running = false;
window.onblur = function() { window_focus = false; }
window.onfocus = function() { window_focus = true; }

frame = 0;
function titleAnimation(){
  list = "─／｜＼";
  if(window_focus){
    document.title = "どどんとふ";
    running = false;
  }else{
    frame = (frame + 1) % 4;
    document.title = list[frame] + " どどんとふ";
    setTimeout(titleAnimation, 300);
  }
}



window.addEventListener('popstate', (e) =>  {
  console.log(e);
});
var click = {x:0,y:0};

var roominfos = [];

var pageBuffer, diceRollBuffer, context;

function playSound(buffer) {
  if(ddf.roomState.playSound){
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
  }                                           // note: on older systems, may have to use deprecated noteOn(time);
}

$(() => {
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();
  var request = new XMLHttpRequest();
  request.open('GET', "sound/page.mp3", true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      pageBuffer = buffer;
    });
  }
  request.send();
  var request2 = new XMLHttpRequest();
  request2.open('GET', "sound/diceRoll.mp3", true);
  request2.responseType = 'arraybuffer';
  request2.onload = function() {
    context.decodeAudioData(request2.response, function(buffer) {
      diceRollBuffer = buffer;
    });
  }
  request2.send();
  
  ddf.dragOption = {
    start: (event) =>  {
        click.x = event.clientX - parseInt($(event.target).css("marginLeft")) / 2;
        click.y = event.clientY - parseInt($(event.target).css("marginTop")) / 2;
    },
    drag: (event, ui) =>  {
      // This is the parameter for scale()
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

      // jQuery will simply use the same object we alter here
      ui.position = {
          left: (event.clientX - click.x + original.left) / zoom,
          top:  (event.clientY - click.y + original.top ) / zoom
      };
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece){
        if(ddf.roomState.mapData.isAlternately && ddf.roomState.mapData.gridInterval % 2 == 1){
          if((Math.floor(ui.position.top / 50 / ddf.roomState.mapData.gridInterval) & 1)){
            ui.position = {
                left: ((Math.floor(ui.position.left / 25) | 1) ^ 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }else{
            ui.position = {
                left: (Math.floor(ui.position.left / 25) | 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }
        }else{
          ui.position = {
              left: Math.floor(ui.position.left / 50) * 50,
              top: Math.floor(ui.position.top / 50) * 50
          };
        }
      }
    },
    stop: (event, ui) => {
      character = ddf.characters[ui.helper.attr("id")];
      if(character){
        data = character.data;
        data.x = ui.position.left / 50;
        data.y = ui.position.top / 50;
        ddf.moveCharacter(data.imgId, data.x, data.y);
      }
        console.log(ui);
    }
  };


  /*共通コンポーネント向け*/
  $(".draggable").draggable({
    cancel: ".dragprev, .draggableObj",
    stack: ".draggable"
  });
  $(".draggabletail").draggable({
    cancel: ".dragprev, .draggableObj"
  });
  
  $(".resizable").resizable({
    ghost: true,
    handles: 'n, e, s, w, ne, se, sw, nw'
  });
  $('.loader-inner').loaders();
  $(document).on('click', "#diceResult *", (e) => {
    $("#diceResult").empty();
  });
  $(document).on('click', "#characterCutIn img", (e) => {
    $("#characterCutIn").empty();
  });
  
  /*ページ移動の停止処理*/
  window.onbeforeunload = (e) =>  {
    e.returnValue = '他のページに移動しようとしています。\n移動しますか？';
  };
  
  /*エントリーポイント*/
  ddf.userState.room = -1;
  ddf.userState.own = "\t"+ddf.util.getUniqueId();
  getLoginInfo();
  
  var version = require('../../package.json').version;
  /*待合室コマンド*/
  $("#btn_version").on('click', (e) => {
    $("#version_DodontoF").text(ddf.info.version);
    $("#version_ddfjs").text(ddf.version);
    $("#version_ddfcli").text(version);
    $("#window_version").show().css("z-index", 61);
    $(".draggable:not(#window_version)").css("z-index", 60);
  });
  
  $("#version_close").on('click', (e) => {
    $("#window_version").hide();    
  });
  
  $("#btn_loginNumber").on('click', (e) => {
    $("#window_loginNumber").show().css("z-index", 61);
    $(".draggable:not(#window_loginNumber)").css("z-index", 60);
  });
  $("#window_loginNumber .btn").on('click', (e) =>  {
    $("#window_loginNumber").hide();
  });
  
  $("#btn_manual").on('click', (e) => {
    window.open(ddf.base_url + "README.html");
  });
  
  $("#btn_removePlayRoom").on('click', (e) => {
    removePlayRoom(parseInt($("#playRoomNo").val().trim()));
  });
  

  $("#btn_site").on('click', () => {
    window.open("http://www.dodontof.com/");
  });
  
  $("#btn_createPlayRoom").on('click', (e) => {
    ddf.userState.room = -1;
    $("#window_createPlayRoom").show().css("z-index", 61);
    $(".draggable:not(#window_createPlayRoom)").css("z-index", 60);
  });
  $("#createPlayRoom_create").on('click', (e) => {
    createPlayRoom();
  });
  $("#createPlayRoom_close").on('click', (e) => {
    $("#window_createPlayRoom").hide();
  });

  $("#btn_login").on('click', (e) => {
    checkRoomStatus(parseInt($("#playRoomNo").val()));
  });

  $("#playRoomInfos table").tablesorter();

  var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  $("#mapSurface").on(mousewheelevent,(e) => {
      e.preventDefault();
      var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
      if (delta < 0){
        setZoom(-0.1);
      } else {
        setZoom(0.1);
      }
  });
  
});

ddf.safeDragDestoroy = () => {
  try{
    $(".draggableObj").draggable("destroy");
  }catch(e){}
}

function setZoom(amount, relative = true){
  if(relative){
    ddf.roomState.zoom += amount;
  }else{
    ddf.roomState.zoom = amount;
  }
  ddf.roomState.zoom < 0.1 && (ddf.roomState.zoom = 0.1);
  ddf.roomState.zoom > 3.0 && (ddf.roomState.zoom = 3.0);
  $("#map").css("transform", "scale("+ddf.roomState.zoom+")");
}

function getDiceBotInfos(){
  return ddf.getDiceBotInfos().then((r)=>{
    ddf.patterns = {};
    ddf.info.diceBotInfos = r;
  });
}

function getLoginInfo(){
  return ddf.getLoginInfo().then((r) => {
    ddf.info = r;
    $("#loginMessage").html(ddf.info.loginMessage);
    total = 0;
    str = "";
    for(item of ddf.info.loginUserCountList){
      total += item[1];
      str += "No."+item[0]+"："+item[1]+"人<br>";
    }
    $("#window_loginNumber .body").html(str);
    $("#btn_loginNumber").text("現状："+ddf.info.loginUserCountList.length+"／上限："+ddf.info.limitLoginCount+"人");
    for(item of ddf.info.diceBotInfos){
      $("#playRoomGameType").append($('<option value="'+item.gameType+'">'+item.name+'</option>'));
    }
    ddf.cmd.getPlayRoomInfo();
    return r;
  });
}

ddf.cmd.getPlayRoomInfo = () => {
  promises = [];
  for(i = 0;i * ddf.info.playRoomGetRangeMax < ddf.info.playRoomMaxNumber;i++){
    promises.push(
      ddf.getPlayRoomInfo(i * ddf.info.playRoomGetRangeMax, ddf.info.playRoomGetRangeMax * (i+1) - 1 > ddf.info.playRoomMaxNumber ? ddf.info.playRoomMaxNumber : ddf.info.playRoomGetRangeMax * (i+1) - 1)
    );
  }
  callback = (r) => {
    roominfo = r;
    for(key in roominfo.playRoomStates){
      room = roominfo.playRoomStates[key];
      roominfos[parseInt(room.index.trim())] = room;
      
      var row = "<tr>";
      row += `<td>${room.index}</td>`
      row += `<td>${encode(room.playRoomName)}</td>`
      row += `<td>${encode(ddf.util.getDiceBotName(room.gameType))}</td>`
      row += `<td>${room.loginUsers.length}</td>`
      row += `<td>${room.passwordLockState?"有り":"--"}</td>`;
      row += `<td>${room.canVisit?"可":"--"}</td>`;
      row += `<td>${room.lastUpdateTime?room.lastUpdateTime:""}</td>`;
      row += "<td></td></tr>";
      tr = $(row);
      button = $("<button>削除</button>");
      if(room.lastUpdateTime){
        button.on('click', ((roomNumber) => {
          return (e) => {
            e.stopPropagation && e.stopPropagation();
            removePlayRoom(roomNumber)
          };
        })(parseInt(room.index.trim()) ));
      }else{
        button.prop("disabled", true);
      }      
      tr.children("td:last").append(button);
      $("#playRoomInfos tbody").append(tr);
      tr.on('dblclick', ((roomNumber) => {return (e) => {
        checkRoomStatus(roomNumber);
      }})(parseInt(room.index)));
      tr.on('click', ((roomNumber) => {return (e) => {
        $("#playRoomNo").val(roomNumber);
      }})(parseInt(room.index)));
    }
    $("#playRoomInfos table").trigger( 'update');
    return r;
  };

  promises.reduce((current, next) =>  {
    var p = current.then((v) =>  {
      return next;
    });
    p.then(callback);
    return p;
  }, Promise.resolve());
  
    $("#loading").hide();
};

function createPlayRoom(){
  ddf.createPlayRoom(
    ddf.userState.room,
    $("#playRoomName").val(),
    $("#playRoomPassword").val(),
    $("#playRoomGameType").val(),
    true,
    false,
    ["雑談"],
    {
      isCardPickUpVisible:false,
      isChatPaletteVisible:false,
      isSnapMovablePiece:true,
      isCardHandleLogVisible:true,
      isCounterRemoconVisible:false,
      isStandingGraphicVisible:true,
      isRotateMarkerVisible:true,
      isDiceVisible:true,
      isAdjustImageSize:true,
      isChatVisible:true,
      isGridVisible:true,
      isInitiativeListVisible:true,
      isPositionVisible:true,
      isCutInVisible:true,
      isResourceWindowVisible:false
    },
    ""
  ).then((r) => {
    if(r.resultText == "OK"){
      ddf.getPlayRoomInfo(r.playRoomIndex, r.playRoomIndex).then(
        ((roomNumber) => {
          return (r) => {
            roominfos[roomNumber] = r.playRoomStates[0];
            checkRoomStatus(roomNumber);
          };
        })(r.playRoomIndex)
      );

    }else{
    }
  });
}

function checkRoomStatus(roomNumber, password = null){
  room = roominfos[roomNumber];
  if(room){
    if(room.lastUpdateTime==""){
    /*ルーム未作成*/
      ddf.userState.room = roomNumber;
    $("#window_createPlayRoom").css("zIndex", $("#window_createPlayRoom").css("zIndex") + 25);
      $("#window_createPlayRoom").show();
    }else if(room.passwordLockState && password == null){
    /*パスワード付きルーム1回目*/
    }else{
    /*ログイン*/
      return ddf.checkRoomStatus(roomNumber, password).then((r) => {
        roominfo=r;
        if(roominfo.isRoomExist){
          ddf.userState.room = roominfo.roomNumber;
          ddf.userState.name = $("#login_name").val();
          ddf.userState.color = "000000";
          ddf.sendChatMessage(0, "どどんとふ\t", "「"+ddf.userState.name+"」がログインしました。", "00aa00", true);
          $("#main").hide();
          history.pushState({roomNumber: roomNumber}, "room="+roomNumber, "index.html?room="+roomNumber);
          $("#main2").show();
          $("#chatname").val(ddf.userState.name);
          ddf.userState.room = roominfo.roomNumber;
          ddf.userState.lastUpdateTimes = {
            effects: 0,
            time: 0,
            map: 0,
            chatMessageDataLog: 0,
            recordIndex: 0,
            characters: 0,
            playRoomInfo: 0,
            record: 0
          };
          getDiceBotInfos();
          ddf.characters = [];
          ddf.roomState = {};
          ddf.roomState.roomNumber = roomNumber;
          ddf.roomState.zoom = 1;
          ddf.roomState.roundTimeData = {};
          ddf.roomState.ini_characters = {};
          ddf.roomState.roundTimeData.counterNames = [];
          ddf.userState.rIndex = 0;
          var count = 0;
          ddf.roomState.unread = [];
          ddf.roomState.effects = [];
          ddf.roomState.playSound = true;
          for(tab of roominfo.chatChannelNames){
            ddf.roomState.unread.push(0);
            var obj = $(`<p>${encode(tab)}/<span class="tab_label">0</span></p>`);
            obj.on("click", ((index) => {
              return (e) => {
                if(!$(e.currentTarget).hasClass("active")){
                  setChatTab(index)
                }
              }
            })(count++));
            $("#tab").append(obj);
            $("#log").append($("<div><p></p></div>"));
          }
          for(item of ddf.info.diceBotInfos){
            if(/^[^:]*$/.test(item.gameType) && item.gameType != "BaseDiceBot"){
              $("#dicebot").append($(`<option value="${encode(item.gameType)}">${encode(item.name)}</option>`));
            }
          }
          setChatTab("0");
          refresh();
        }
      });
    }
  }
};

function removePlayRoom(roomNumber, password = null){
  room = roominfos[roomNumber];
  if(room && room.lastUpdateTime){
    if(room.passwordLockState && password == null){
    
    }else{
      body = `No.${room.index}：${room.playRoomName}\nを削除しますか？`;
      if(password != null || confirm(body)){
        ddf.removePlayRoom(roomNumber, false, password);
        $("#playRoomInfos tbody").empty();
        ddf.cmd.getPlayRoomInfo();
      }
    }
  }
}

function setChatTab(index){
  ddf.userState.channel = index;
  $("#tab p.active, #log div.active").removeClass('active');
  $(`#tab p:eq(${index}), #log div:eq(${index})`).addClass('active');
  ddf.roomState.unread[index] = 0;
  $(`#tab p:eq(${index}) span`).text(0);
}

function refresh(){
  ddf.refresh().then((r) => {
    refreshData = r;
    //console.log(refreshData);
    refreshData.lastUpdateTimes && (ddf.userState.lastUpdateTimes = refreshData.lastUpdateTimes);
    if(refreshData.viewStateInfo){
      ddf.roomState.viewStateInfo = refreshData.viewStateInfo;
    }
    if(refreshData.gameType){
      if($("#dicebot").children(`[value=${refreshData.gameType}]`).length==1){
        $("#dicebot").val($(refreshData.gameType));
      }else{
        $("#dicebot").append($(`<option value="${encode(refreshData.gameType)}">${encode(refreshData.gameType)}</option>`));
        $("#dicebot").val(refreshData.gameType);
      }
    }
    if(refreshData.mapData) {
      refresh_parseMapData(refreshData);
    }
    if(refreshData.characters){
      refresh_parseCharacters(refreshData);
    }
    if(refreshData.roundTimeData){
      refresh_parseRoundTimeData(refreshData);
    }
    if(refreshData.gameType){
      ddf.roomState.gameType = refreshData.gameType;
    }
    if(refreshData.viewStateInfo){
      refresh_parseViewStateInfo(refreshData);
    }
    if(refreshData.effects){
      refresh_parseEffects(refreshData);
    }
    if(refreshData.chatChannelNames && !refreshData.isFirstChatRefresh){
      $(`#tab > p:gt(${refreshData.chatChannelNames.length - 1}),#log > div:gt(${refreshData.chatChannelNames.length - 1})`).remove();
      ddf.roomState.unread.splice(refreshData.chatChannelNames.length);
      for(i = 0;i < refreshData.chatChannelNames.length;i++){
        if(ddf.roomState.chatChannelNames.length <= i){
          ddf.roomState.unread.push(0);
          var obj = $(`<p>${encode(tab)}/<span class="tab_label">0</span></p>`);
          obj.on("click", ((index) => {
            return (e) => {
              if(!$(e.currentTarget).hasClass("active")){
                setChatTab(index)
              }
            }
          })(i));
          $("#tab").append(obj);
          $("#log").append($("<div><p></p></div>"));
        }else{
          $(`#tab:eq(${refreshData.chatChannelNames - 1})`).html(`${encode(refreshData.chatChannelNames[i])}/<span class="tab_label">${ddf.roomState.unread[i]}</span>`);
        }
      }
      if($("#tab .active").length == 0){
        setChatTab(0);
      }
      ddf.roomState.chatChannelNames = refreshData.chatChannelNames;
    }
    if(refreshData.chatMessageDataLog){
      refresh_parseChatMessageDataLog(refreshData);
    }
    if(refreshData.record) {
      ddf.cmd.refresh_parseRecordData(refreshData);
    }
    if(refreshData.gameType){
      $("#dicebot").val(refreshData.gameType);
    }
    if(refreshData.loginUserInfo){
      $("#btn_member").text(`ルームNo.${ddf.roomState.roomNumber}：${refreshData.loginUserInfo.length}名`);
    }
    r = refreshData = null;
    if(ddf.userState.room != -1){
      setTimeout(refresh, 1000);
    }
  });
}

function refresh_parseEffects(refreshData){
  ddf.roomState.effects = refreshData.effects;
}

function refresh_parseChatMessageDataLog(refreshData){
  let prevheight = $("#log .active")[0].scrollHeight - $("#log .active").height();
  lastRandResult = false;
  lastCutIn = false;
  sound = false;
  for(item of refreshData.chatMessageDataLog){
    if(item[0] <= ddf.roomState.lastMessageTime){continue;}
    sound = true;
    if(!window_focus && !running){
      titleAnimation();
    }
    ddf.roomState.lastMessageTime = item[0];
    if(matches = /^(.*)@([^@]+)(@([^@]+))?$/.exec(item[1].message)){
      item[1].message = matches[1];
      item[1].senderName = matches[2];
      item[1].state = matches[4];
    }else if(matches = /^(.*)\t(.*)$/.exec(item[1].senderName)){
      item[1].senderName = matches[1];
      item[1].state = matches[2];
    }
    item[1].uniqueId != 'dummy' && (lastCutIn = [item[1].senderName, item[1].state]);
    if(matches = /^###CutInCommand:([a-zA-Z]+)###(.+)$/.exec(item[1].message)){
      switch(matches[1]){
        case "getDiceBotInfos":
            if(!refreshData.isFirstChatRefresh){
              getDiceBotInfos();
            }
          continue;
          break;
        case "rollVisualDice":
          param = JSON.parse(matches[2]);
          $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${encode(item[1].senderName)}:${encode(param.chatMessage.replace(/\n/, "<br>"))}</p>`));
          $(`#log div:eq(${item[1].channel}))`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
          lastRandResult = [param.chatMessage, param.randResults];
          continue;
          break;
      }
    }else if(matches = /^###CutInMovie###(.+)$/.exec(item[1].message)){
      param = JSON/parse(matches[1]);
      $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${encode(item[1].senderName)}:【${encode(param.message)}】</p>`));
      $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
    }else{
      $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${encode(item[1].senderName)}:${encode(item[1].message)}</p>`));
      $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
    }
  }
  if(refreshData.isFirstChatRefresh){
    for(div of $("#log").children("div")){
      div.scrollTop = $(div).children(":last").offset().top;
    }
    ddf.roomState.unread = ddf.roomState.unread.map(()=>{return 0;});
  }else{
    if(prevheight < $("#log .active").scrollTop()){
      $("#log .active").scrollTop($("#log .active")[0].scrollHeight);
    }
    for(index in $("#tab").children("p")){
      $("#tab").children("p").eq(index).children("span").text(ddf.roomState.unread[index]);
    }
  }
  if(lastCutIn){
    let found = false;
    if(!found){
      for(item of ddf.roomState.effects){
        if(item.type = "standingGraphicInfos"){
          if(lastCutIn[0] == item.name && lastCutIn[1] == item.state){
            $("#characterCutIn").empty();
            $("#characterCutIn").append($(`<img src="${ddf.base_url + item.source}" class="pos${item.leftIndex} ${item.motion} ${item.mirrored?"mirrored":""}">`));
          }
        }
      }
    }
    if(!found){
      for(id in ddf.characters){
        character = ddf.characters[id].data;
        if(character.name == lastCutIn[0]){
            $("#characterCutIn").empty();
          $("#characterCutIn").append($(`<img src="${ddf.base_url + character.imageName}" class="pos1">`));
          found = true;
          break;
        }
      }
    }
  }
  if(lastRandResult){
    playSound(diceRollBuffer);
    $("#diceResult").empty();
    for(item of lastRandResult[1]){
      if([4,6,8,10,12,20].includes(item[1])){
        $("#diceResult").append($(`<img src="${ddf.base_url}image/diceImage/${item[1]}_dice/${item[1]}_dice[${item[0]}].png" alt="${item[0]}">`));
      }else{
        $("#diceResult").append($(`<img src="${ddf.base_url}image/diceImage/unknown.png" alt="${item[0]}">`));
      }
    }
    total = /\s([^\s]+)$/.exec(lastRandResult[0])[1];
    $("#diceResult").append($(`<div class="total">${encode(total)}</div>`));
  }else if(sound){
    playSound(pageBuffer);
  }
}

function refresh_parseViewStateInfo(refreshData){
  for(key in refreshData.viewStateInfo){
    switch(key){
      case "isSnapMovablePiece":
        if(refreshData.viewStateInfo[key]){
          $("#btn_gridguide").addClass("checked");
        }
        break;
      case "isAdjustImageSize":
        if(refreshData.viewStateInfo[key]){
          $("#btn_adjustcharacter").addClass("checked");
          $("#characterCutIn").addClass("adjust");
        }
        break;
      case "isCardHandleLogVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_cardlog").addClass("checked");
        }
        break;
      case "isCardPickUpVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_cardpickup").addClass("checked");
        }
        break;
      case "isCutInVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaycutin").addClass("checked");
        }
        break;
      case "isGridVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaygridline").addClass("checked");
        }
        break;
      case "isPositionVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaygridnum").addClass("checked");
        }
        break;
      case "isStandingGraphicVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaycharacter").addClass("checked");

          $("#characterCutIn").show();
        }else{
          $("#characterCutIn").hide();
        }
        break;
      case "isRotateMarkerVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_rotate").addClass("checked");
        }
        break;
      case "isChatVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaychat").addClass("checked");
          
          $("#window_chat .inner").show();
        }else{
          $("#window_chat .inner").hide();
        }
        break;
      case "isDiceVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaydice").addClass("checked");
          
          $("#diceResult").show();
        }else{
          $("#diceResult").hide();
        }
        break;
      case "isInitiativeListVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displayinitiative").addClass("checked");
          
          $("#initiative").show();
        }
        break;
      case "isResourceWindowVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displayresource").addClass("checked");
          
          //$("#resource").show();
          /*TODO*/
        }
        break;
      case "isChatPaletteVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaychatpalette").addClass("checked");
          
          //$("#chatpalette").show();
          /*TODO*/
        }
        break;
      case "isCounterRemoconVisible":
        if(refreshData.viewStateInfo[key]){
          $("#btn_displaycounter").addClass("checked");
          
          //$("#remocon").show();
          /*TODO*/
        }
        break;
    }
  }
}

ddf.cmd.refresh_parseRecordData = (refreshData) => {
  ddf.safeDragDestoroy();
  for(record of refreshData.record){
    switch(record[1]){
    case "addCharacter":
    case "changeCharacter":
      data = record[2][0];
      character = ddf.characters[data.imgId];
      if(!character){
        return refresh_parseCharacters({characters: [data]});
      }
      obj = character.obj;
      switch(data.type){
        case "magicRangeMarkerDD4th":
          obj.animate({
            left: data.x * 50,
            top: data.y * 50
          }, 300);
          if(!data.isHide){
            ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
          }else{
            ddf.roomState.ini_characters[character.imgId] = null;
          }
          obj.css({
            backgroundColor: "rgb("+[data.color / 65536 & 0xFF, data.color / 256 & 0xFF, data.color & 0xFF].join()+")"
          });
          switch(data.rangeType){
            case "closeBurstDD4th":
              obj.addClass("rangeCenterMarker");
              obj.css({
                marginLeft: (data.feets * -10) * ddf.roomState.mapData.gridInterval,
                marginTop:  (data.feets * -10) * ddf.roomState.mapData.gridInterval,
                width: (data.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
                height: (data.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
              });
              break;
            case "blastDD4th":
              obj.removeClass("rangeCenterMarker");
              obj.css({
                marginLeft: 0,
                marginTop:  0,
                width: (data.feets * 10) * ddf.roomState.mapData.gridInterval,
                height: (data.feets * 10) * ddf.roomState.mapData.gridInterval,
              });
          }
          break;
      case "mapMask":
        obj.children(".name").text(data.name);
        obj.animate({
          left: data.x * 50,
          top: data.y * 50
        }, 300);
        colors = [data.color / 65536 & 0xFF, data.color / 256 & 0xFF, data.color & 0xFF];
        sum = 255;
        refColor = [sum - colors[0], sum - colors[1], sum - colors[2]];
        obj.css({
          left: data.x * 50,
          top: data.y * 50,
          width: data.width * 50,
          height: data.height * 50,
          opacity: data.alpha,
          backgroundColor: "rgb("+colors+")"
        });
        obj.children(".name").css({
          color: "rgb("+refColor+")"
        });
        if(data.draggable){
          obj.addClass("draggableObj");
        }else{
          obj.removeClass("draggableObj");
        }
        break;
      case "characterData":
        obj.animate({
          left: data.x * 50,
          top: data.y * 50
        }, 300);
        obj.css({
          width: data.size * 50,
          height: data.size * 50
        });
        if(!data.isHide){
          ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
          obj.removeClass("isHide");
        }else{
          ddf.roomState.ini_characters[character.imgId] = null;
          obj.addClass("isHide");
        }
        obj.children(".inner").css({
          transform: "rotateZ("+data.rotation+"deg) "+(data.mirrored?" rotateY(180deg)":""),
          backgroundImage: "url("+ddf.base_url+data.imageName+")"
        });
        obj.children(".name").text(data.name);
        obj.children(".dogtag").text(data.dogTag);
        break;
      case "Memo":
        title = data.message.split("\r")[0];
        ar = data.message.split(/\t\|\t/);
        if(ar.length > 1){
          body = ar.map((v)=>{return `[${v.split("\r")[0]}]`}).join("<br>")
        }else{
          body = data.message.replace("\r", "<br>");
        }
        obj.html(`<span>${encode(title)}</span><img src="${ddf.base_url}image/memo2.png"><div>${encode(body)}</div>`);
      }
      character.data = data;
      break;
    case "removeCharacter":
      data = record[2][0];
      character = ddf.characters[data];
      if(character){
        character.obj && character.obj.remove();
        character.row && character.row.remove();
        ddf.characters[data[0]] = null;
      }
    }
  }
  $(".draggableObj").draggable(ddf.dragOption);
};

function refresh_parseCharacters(refreshData){
  for(character of refreshData.characters){
    switch(character.type){
    case "Card":
    case "CardTrushMount":
    case "CardMount":
      break;
    case "magicRangeMarkerDD4th":
      obj = $(`<div class="magicRangeFrame draggableObj" id="${character.imgId}"></div>`);
      $("#mapSurface").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      if(!character.isHide){
        ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
      }
      obj.css({
        left: character.x * 50,
        top: character.y * 50,
        opacity: 0.5,
        backgroundColor: "rgb("+[character.color / 65536 & 0xFF, character.color / 256 & 0xFF, character.color & 0xFF].join()+")"
      });
      switch(character.rangeType){
        case "closeBurstDD4th":
          obj.addClass("rangeCenterMarker");
          obj.css({
            marginLeft: (character.feets * -10) * ddf.roomState.mapData.gridInterval,
            marginTop:  (character.feets * -10) * ddf.roomState.mapData.gridInterval,
            width: (character.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
            height: (character.feets * 20 + 50) * ddf.roomState.mapData.gridInterval,
          });
          break;
        case "blastDD4th":
          obj.removeClass("rangeCenterMarker");
          obj.css({
            marginLeft: 0,
            marginTop:  0,
            width: (character.feets * 10) * ddf.roomState.mapData.gridInterval,
            height: (character.feets * 10) * ddf.roomState.mapData.gridInterval,
          });
      }
      break;
    case "mapMask":
      obj = $(`<div class="mapMaskFrame" id="${character.imgId}"></div>`);
      if(character.draggable){obj.addClass("draggableObj");}
      obj.append($(`<div class="name">${encode(character.name)}</div>`));
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      colors = [character.color / 65536 & 0xFF, character.color / 256 & 0xFF, character.color & 0xFF];
      sum = 255;
      refColor = [sum - colors[0], sum - colors[1], sum - colors[2]];
      obj.css({
        left: character.x * 50,
        top: character.y * 50,
        width: character.width * 50,
        height: character.height * 50,
        opacity: character.alpha,
        backgroundColor: "rgb("+colors+")"
      });
      obj.children(".name").css({
        color: "rgb("+refColor+")"
      });
      $("#mapSurface").append(obj);
      break;
    case "characterData":
      obj = $(`<div class="characterFrame draggableObj" id="${character.imgId}"></div>`);
      obj.append($(`<div class="inner"></div><div class="dogtag">${encode(character.dogTag)}</div><div class="name">${encode(character.name)}</div>`));
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      if(!character.isHide){
        ddf.roomState.ini_characters[character.imgId] = ddf.characters[character.imgId];
      }else{
        obj.addClass("isHide");
      }
      obj.css({
        left: character.x * 50,
        top: character.y * 50,
        width: character.size * 50,
        height: character.size * 50
      });
      obj.children(".inner").css({
        transform: "rotateZ("+character.rotation+"deg) "+(character.mirrored?" rotateY(180deg)":""),
        backgroundImage: "url("+ddf.base_url+character.imageName+")"
      });
              
      $("#mapSurface").append(obj);
      break;
    case "Memo":
      title = character.message.split("\r")[0];
      ar = character.message.split(/\t\|\t/);
      if(ar.length > 1){
        body = ar.map((v)=>{return `[${v.split("\r")[0]}]`}).join("<br>")
      }else{
        body = character.message.replace("\r", "<br>");
      }
      obj = $(`<div class="draggableObj" id="${character.imgId}"><span>${encode(title)}</span><img src="${ddf.base_url}image/memo2.png"><div>${encode(body)}</div></div>`);
      $("#list_memo").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      break;
    }
  }
  $(".draggableObj").draggable(ddf.dragOption);
}

function refresh_parseMapData(refreshData){
  ddf.roomState.mapData = refreshData.mapData;
  switch(refreshData.mapData.mapType){
    case "imageGraphic":
    $("#mapimg").attr("src", ddf.base_url + refreshData.mapData.imageSource)
    .css({
      width: refreshData.mapData.xMax * 50,
      height: refreshData.mapData.yMax * 50,
    });
    if(refreshData.mapData.mirrored){
      $("#mapimg").addClass("mirrored");
    }else{
      $("#mapimg").removeClass("mirrored");
    }
    $("#map")
    .css({
      width: refreshData.mapData.xMax * 50,
      height: refreshData.mapData.yMax * 50,
    });
    param = {
      x: refreshData.mapData.xMax,
      y: refreshData.mapData.yMax,
      border: ddf.roomState.viewStateInfo.isGridVisible,
      alt: refreshData.mapData.isAlternately,
      num: ddf.roomState.viewStateInfo.isPositionVisible,
      size: refreshData.mapData.gridInterval,
      color: "rgb("+[refreshData.mapData.gridColor / 65536 & 0xFF,refreshData.mapData.gridColor / 256 & 0xFF,refreshData.mapData.gridColor & 0xFF].join()+")",
      mapMarks: escape(refreshData.mapData.mapMarks.join("/")),
      mapMarksAlpha: refreshData.mapData.mapMarksAlpha
    };
    $("#mapGrid").attr("data", "img/grid.svg?"+$.map(param, (v,k) => {return k+"="+v;}).join("&"));
  }
  if(refreshData.mapData.drawsImage && refreshData.mapData.drawsImage != ""){
    $("#mapDraw").show();
    $("#mapDraw").attr("src", ddf.base_url + refreshData.mapData.drawsImage);
  }else{
    $("#mapDraw").hide();
  }
  if(refreshData.mapData.draws){
    $("#drawsPanel").attr("data", "img/draw.svg?width="+refreshData.mapData.xMax * 50+"&height=" + refreshData.mapData.yMax * 50 + "&list="+JSON.stringify(refreshData.mapData.draws));
  }else{
    $("#drawsPanel param").val("[]");
  }
  redraw = [];
  for(item in ddf.characters){
    if(ddf.characters[item].data.type == "magicRangeMarkerDD4th"){
      redraw.push([0, "changeCharacter", [ddf.characters[item].data], "dummy\t"]);
    }
  }
  ddf.cmd.refresh_parseRecordData({record: redraw});
}

function refresh_parseRoundTimeData(refreshData){
  if(JSON.stringify(refreshData.roundTimeData.counterNames) != JSON.stringify(ddf.roomState.roundTimeData.counterNames)){
    $("#initiative table thead tr").empty();
    $("#initiative table thead tr").append($("<th><p>順番</p></th>"));
    $("#initiative table thead tr").append($("<th><p>イニシアティブ</p></th>"));
    $("#initiative table thead tr").append($("<th><p>修正値</p></th>"));
    $("#initiative table thead tr").append($("<th><p>名前</p></th>"));
    for(counter of refreshData.roundTimeData.counterNames){
      $("#initiative table thead tr").append($(`<th><p>${encode(counter.replace(/^\*/, ""))}</p></th>`));
    }
    $("#initiative table thead tr").append($("<th><p>その他</p></th>"));
    
    $("#initiative table tbody").empty();
    ddf.roomState.ini_characters = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative});
    for(key in ddf.roomState.ini_characters){
      var character = ddf.roomState.ini_characters[key];
      var tmp = "<tr>";
      tmp+= `<td>${(character.data.initiative==refreshData.roundTimeData.initiative?"●":"")}</td>`;
      tmp+= `<td>${(character.data.initiative|0)}</td>`;
      tmp+= `<td>${(character.data.initiative*100 % 100)}</td>`;
      tmp+= `<td>${encode(character.data.name)}</td>`;
      for(counter of refreshData.roundTimeData.counterNames){
        character.data.counters == null && (character.data.counters = {});
        character.data.statusAlias == null && (character.data.statusAlias = {});
        character.data.counters[counter]==undefined && (character.data.counters[counter] = 0);
        if(/^\*/.test(counter)){
          tmp+= `<td>${(character.data.counters[counter]!=0?"●":"")}</td>`;
        }else{
          tmp+= `<td>${(character.data.counters[counter])}</td>`;
        }
      }
      tmp+= `<td>${encode(character.data.info)}</td>`;
      tmp+= "</tr>";
      character.row = $(tmp);
      $("#initiative table tbody").append(
        character.row
      );
    }
  }else{
      for(key in ddf.roomState.ini_characters){
        var character = ddf.roomState.ini_characters[key];
        character.row.children("td:eq(0)").text(character.data.initiative==refreshData.roundTimeData.initiative?"●":"");
      }
    }
  $("#round").text(refreshData.roundTimeData.round);
  $("#now_ini").text(refreshData.roundTimeData.initiative);

  ddf.roomState.roundTimeData = refreshData.roundTimeData;
}

ddf.cmd.sendChatMessage = (channel, senderName, state, gameType, message, color, isNeedResult = true) => {
  ddf.roomState.gameType = gameType;
  if(message.trim()==""){return false;}
  if(!(pattern = ddf.patterns[ddf.roomState.gameType])){
    dicebot = ddf.info.diceBotInfos.find((r) => {return r.gameType == ddf.roomState.gameType});
    pattern = [].concat(
      ddf.info.diceBotInfos.find((r) => {return r.gameType == "BaseDiceBot"}).prefixs,
      dicebot?dicebot.prefixs:[],
    ).map((r) => {return new RegExp("^((\\d+)\\s+)?(S?"+r+"[^\\s]*)", "i");});
    ddf.patterns[ddf.roomState.gameType] = pattern;
  }
  var match;
  if(!!pattern.find((r) => {return !!(match = r.exec(message));})){
    //DiceBotMessage
    ddf.userState.name = senderName;
    return ddf.sendDiceBotChatMessage(channel, senderName, state, match[2]?match[2]:0, match[3], color, ddf.roomState.gameType, isNeedResult);
  }else{
    //ChatMessage
    if(/^###CutInCommand:/.test(message)){
      message = "Wrong Message -> " + message;
    }
    ddf.userState.name = senderName;
    return ddf.sendChatMessage(channel, senderName + "\t"+ state, message, color);
  }
};

function initiativeNext(){
}
function initiativeBack(){
}
function initiativeReset(){
  return ddf.changeRoundTime();
}
},{"../../package.json":1,"./.config.json":2,"./contextMenu/.loading.js":4,"./room_menu.js":11,"./screenshot.js":12,"./window/.loading.js":13}],11:[function(require,module,exports){
$(() => {
  /*プレイルームメニュー*/
  $("#btn_save").on("click", (e) => {
  });
  $("#btn_load").on("click", (e) => {
  });
  $("#btn_saveall").on("click", (e) => {
  });
  $("#btn_loadall").on("click", (e) => {
  });
  $("#btn_savechatlog").on("click", (e) => {
  });
  $("#btn_startrecord").on("click", (e) => {
  });
  $("#btn_endrecord").on("click", (e) => {
  });
  $("#btn_cancelrecord").on("click", (e) => {
  });
  $("#btn_logout, #btn_logout2").on("click", (e) => {
    ddf.logout().then((r) => {
      ddf.userState.room = -1;
      location.href = "index.html"
    });
  });

  $("#btn_displaychat").on("click", (e) => {
    ddf.roomState.viewStateInfo.isChatVisible = !ddf.roomState.viewStateInfo.isChatVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#window_chat .inner").toggle();
  });
  $("#btn_displaydice").on("click", (e) => {
    ddf.roomState.viewStateInfo.isDiceVisible = !ddf.roomState.viewStateInfo.isDiceVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#diceResult").toggle();
  });
  $("#btn_displayinitiative").on("click", (e) => {
    ddf.roomState.viewStateInfo.isInitiativeListVisible = !ddf.roomState.viewStateInfo.isInitiativeListVisible;
    $(e.currentTarget).toggleClass("checked");
    $("#initiative").toggle();
  });
  $("#btn_displayresource").on("click", (e) => {
    ddf.roomState.viewStateInfo.isResourceWindowVisible = !ddf.roomState.viewStateInfo.isResourceWindowVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#resource").toggle();
    /*TODO*/
  });
  $("#btn_displaychatpalette").on("click", (e) => {
    ddf.roomState.viewStateInfo.isChatPaletteVisible = !ddf.roomState.viewStateInfo.isChatPaletteVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#chatpalette").toggle();
    /*TODO*/
  });
  $("#btn_displaycounter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCounterRemoconVisible = !ddf.roomState.viewStateInfo.isCounterRemoconVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#remocon").toggle();
    /*TODO*/
  });
  $("#btn_displaycharacter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCutInVisible = !ddf.roomState.viewStateInfo.isCutInVisible;
    $(e.currentTarget).toggleClass("checked");
    $("#characterCutIn").toggle();
  });
  $("#btn_displaycutin").on("click", (e) => {
    ddf.roomState.viewStateInfo.isStandingGraphicVisible = !ddf.roomState.viewStateInfo.isStandingGraphicVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_displaygridnum").on("click", (e) => {
    ddf.roomState.viewStateInfo.isPositionVisible = !ddf.roomState.viewStateInfo.isPositionVisible;
    $(e.currentTarget).toggleClass("checked");
    refresh_parseMapData({mapData: ddf.roomState.mapData});
  });
  $("#btn_displaygridline").on("click", (e) => {
    ddf.roomState.viewStateInfo.isGridVisible = !ddf.roomState.viewStateInfo.isGridVisible;
    $(e.currentTarget).toggleClass("checked");
    refresh_parseMapData({mapData: ddf.roomState.mapData});
  });
  $("#btn_gridguide").on("click", (e) => {
    ddf.roomState.viewStateInfo.isSnapMovablePiece = !ddf.roomState.viewStateInfo.isSnapMovablePiece;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_adjustcharacter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isAdjustImageSize = !ddf.roomState.viewStateInfo.isAdjustImageSize;
    $(e.currentTarget).toggleClass("checked");
    $("#characterCutIn").toggleClass("adjust");
  });
  $("#btn_chatfont").on("click", (e) => {
  });
  $("#btn_resetwindow").on("click", (e) => {
  });
  $("#btn_resetdisplay").on("click", (e) => {
  });

  $("#btn_createcharacter").on("click", (e) => {
  });
  $("#btn_ragedd3").on("click", (e) => {
  });
  /*$("#btn_rangedd4").on("click", (e) => {
  });*/
  $("#btn_rangelh").on("click", (e) => {
  });
  $("#btn_rangemg").on("click", (e) => {
  });
  $("#btn_magictimer").on("click", (e) => {
  });
  $("#btn_createchit").on("click", (e) => {
  });
  /*$("#btn_graveyard, #btn_graveyard2").on("click", (e) => {
  });*/
  $("#btn_waitroom").on("click", (e) => {
  });
  $("#btn_rotate").on("click", (e) => {
    ddf.roomState.viewStateInfo.isRotateMarkerVisible = !ddf.roomState.viewStateInfo.isRotateMarkerVisible;
    $(e.currentTarget).toggleClass("checked");
    
    /*TODO*/
  });

  $("#btn_cardpickup").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCardPickUpVisible = !ddf.roomState.viewStateInfo.isCardPickUpVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_cardlog").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCardHandleLogVisible = !ddf.roomState.viewStateInfo.isCardHandleLogVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_cardchange").on("click", (e) => {
  });
  $("#btn_cardreset").on("click", (e) => {
  });

  /*$("#btn_mapchange").on("click", (e) => {
  });*/
  $("#btn_maptile").on("click", (e) => {
  });
  /*$("#btn_mapmask").on("click", (e) => {
  });*/
  $("#btn_mapmodify").on("click", (e) => {
  });
  $("#btn_mapsave").on("click", (e) => {
    ddf.saveMap().then((r)=>{
      if(r.result == "OK"){
        window.open(ddf.base_url+r.saveFileName.replace("./", ''));
      }
    });
  });
  $("#btn_mapchange").on("click", (e) => {
  });

  /*$("#btn_imageupload").on("click", (e) => {
  });*/
  $("#btn_camera").on("click", (e) => {
  });
  $("#btn_imagetagedit").on("click", (e) => {
  });
  /*$("#btn_imagedelete").on("click", (e) => {
  });*/

  var version = require('../../package.json').version;
  $("#btn_version2").on("click", (e) => {
    $("#version_DodontoF").text(ddf.info.version);
    $("#version_ddfjs").text(ddf.version);
    $("#version_ddfcli").text(version);
    $("#window_version").show().css("z-index", 61);
    $(".draggable:not(#window_version)").css("z-index", 60);
  });
  $("#btn_manual2").on("click", (e) => {
    window.open(ddf.base_url + "README.html");
  });
  $("#btn_tutorial").on("click", (e) => {
  });
  $("#btn_site2").on("click", (e) => {
    window.open("http://www.dodontof.com/");
  });


  $("#btn_zoomin").on("click", () => {
    setZoom(0.1);
  });
  $("#btn_zoomout").on("click", () => {
    setZoom(-0.1);
  });

  $("#btn_screenshot").on("click", generate);
});


function setZoom(amount, relative = true){
  if(relative){
    ddf.roomState.zoom += amount;
  }else{
    ddf.roomState.zoom = amount;
  }
  ddf.roomState.zoom < 0.1 && (ddf.roomState.zoom = 0.1);
  ddf.roomState.zoom > 3.0 && (ddf.roomState.zoom = 3.0);
  $("#map").css("transform", "scale("+ddf.roomState.zoom+")");
}
},{"../../package.json":1}],12:[function(require,module,exports){
(function (exports) {
    function urlsToAbsolute(nodeList) {
        if (!nodeList.length) {
            return [];
        }
        var attrName = 'href';
        if (nodeList[0].__proto__ === HTMLImageElement.prototype 
        || nodeList[0].__proto__ === HTMLScriptElement.prototype) {
            attrName = 'src';
        }
        nodeList = [].map.call(nodeList, function (el, i) {
            var attr = el.getAttribute(attrName);
            if (!attr) {
                return;
            }
            var absURL = /^(https?|data):/i.test(attr);
            if (absURL) {
                return el;
            } else {
                return el;
            }
        });
        return nodeList;
    }

    function screenshotPage() {
        urlsToAbsolute(document.images);
        urlsToAbsolute(document.querySelectorAll("link[rel='stylesheet']"));
        var screenshot = document.documentElement.cloneNode(true);
        var b = document.createElement('base');
        b.href = document.location.protocol + '//' + location.host;
        var head = screenshot.querySelector('head');
        head.insertBefore(b, head.firstChild);
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        screenshot.dataset.scrollX = window.scrollX;
        screenshot.dataset.scrollY = window.scrollY;
        var script = document.createElement('script');
        script.textContent = '(' + addOnPageLoad_.toString() + ')();';
        screenshot.querySelector('body').appendChild(script);
        var blob = new Blob([screenshot.outerHTML], {
            type: 'text/html'
        });
        return blob;
    }

    function addOnPageLoad_() {
        window.addEventListener('DOMContentLoaded', function (e) {
            var scrollX = document.documentElement.dataset.scrollX || 0;
            var scrollY = document.documentElement.dataset.scrollY || 0;
            window.scrollTo(scrollX, scrollY);
        });
    }

    function generate() {
        window.URL = window.URL || window.webkitURL;
        window.open(window.URL.createObjectURL(screenshotPage()));
    }
    exports.screenshotPage = screenshotPage;
    exports.generate = generate;
})(window);
},{}],13:[function(require,module,exports){
$(() => {
  require("./upload.js");
  require("./graveyard.js");
  require("./imageDelete.js");
  require("./mapChange.js");
  require("./mapMask.js");
  require("./chat.js");
  require("./help.js");
  require("./memo.js");
  require("./magicRangeDD4th.js");
});
},{"./chat.js":14,"./graveyard.js":15,"./help.js":16,"./imageDelete.js":17,"./magicRangeDD4th.js":18,"./mapChange.js":19,"./mapMask.js":20,"./memo.js":21,"./upload.js":22}],14:[function(require,module,exports){

$("#btn_private").on('click', (e) => {
});
/*$("#btn_help").on('click', (e) => {
});*/
$("#btn_diceBotTable").on('click', (e) => {
});
$("#btn_novel").on('click', (e) => {
});
$("#btn_chatDelete").on('click', (e) => {
  if(confirm('チャットログを全て削除します。よろしいですか？') && confirm('削除したログは復旧できませんが、本当によろしいですか？')){
    ddf.deleteChatLog().then((r) => {
      ddf.sendChatMessage(0, "どどんとふ\t", "全チャットログ削除が正常に終了しました。", "00aa00", true);
    });      
  }
});
$("#btn_chatFont").on('click', (e) => {
});
$("#btn_mute").on('click', (e) => {
  ddf.roomState.playSound = !ddf.roomState.playSound;
  if(ddf.roomState.playSound){
    $("#btn_mute img").attr("src", "image/icons/sound.png");
    $("#btn_mute .helptext").text("音再生あり");
  }else{
    $("#btn_mute img").attr("src", "image/icons/sound_mute.png");
    $("#btn_mute .helptext").text("音再生なし");
  }
});
$("#btn_vote").on('click', (e) => {
});
$("#btn_alarm").on('click', (e) => {
});
$("#btn_cutIinList").on('click', (e) => {
});
$("#btn_easyUpload").on('click', (e) => {
});
$("#btn_talk").on('click', (e) => {
});

$("#btn_chatsend").on('click', (e) => {
  ddf.cmd.sendChatMessage(ddf.userState.channel, $("#chatname").val(), "", $("#dicebot").val(), $("#chattext").val(), ddf.userState.color)
  $("#chattext").val("");
});
},{}],15:[function(require,module,exports){
$("#btn_graveyard, #btn_graveyard2").on("click", (e) => {
  getGraveyardCharacterData();
  $("#window_graveyard").show().css("z-index", 61);
  $(".draggable:not(#window_graveyard)").css("z-index", 60);
});

$("#graveyard_close, #graveyard_close2").on("click", (e) => {
  $("#window_graveyard").hide();
});
$("#graveyard_resurrect").on("click", (e) => {
  ddf.resurrectCharacter($("#graveyard_characters").val());
  $("#graveyard_characters")[0].remove($("#graveyard_characters")[0].selectedIndex);
});
$("#graveyard_clear").on("click", (e) => {
  ddf.clearGraveyard().then((r) => {
    getGraveyardCharacterData();
  });
});
$("#graveyard_reload").on("click", (e) => {
  getGraveyardCharacterData();
});


function getGraveyardCharacterData(){
  return ddf.getGraveyardCharacterData().then((r) => {
    $("#graveyard_characters").empty();

    for(item of r){
      type = item.type;
      name = item.name;
      switch(item.type){
        case "mapMask":
          type = "マップマスク";
          break;
        case "characterData":
          type = "キャラクター";
          break;
        case "magicRangeMarker":
          type = "魔法範囲";
          break;
        case "LogHorizonRange":
          type = "ログホライズン攻撃範囲";
          break;
        case "MetalicGuardianDamageRange":
          type = "メタリックガーディアン攻撃範囲";
          break;
        case "MagicTimer":
          type = "魔法タイマー";
          break;
        case "chit":
          name = ""
          type = "チット";
          break;
        case "Memo":
          type = "共有メモ";
          name = item.message.split("\r")[0];
          break;
        case "diceSymbol":
          type = "ダイスシンボル";
          name = `[${item.ownerName}]のダイス`;
          break;
        case "magicRangeMarkerDD4th":
          type = "魔法範囲D&D4版";
          break;
      }
      $("#graveyard_characters").append($(`<option value="${item.imgId}">${encode(name)}[${type}]</option>`));
    }
  });
}
},{}],16:[function(require,module,exports){

$("#btn_help").on('click', (e) => {
  dicebot = ddf.info.diceBotInfos.find((item) => {return item.gameType == $("#dicebot").val()});
  baseDicebot = ddf.info.diceBotInfos.find((item) => {return item.gameType == "BaseDiceBot"});
  $("#help_text").text(`${baseDicebot.info}\n==【${dicebot.name}専用】=======================\n${dicebot.info}`);
  $("#window_help").show().css("z-index", 61);
  $(".draggable:not(#window_help)").css("z-index", 60);
});

$("#help_close").on('click', (e) => {
  $("#window_help").hide();
});
},{}],17:[function(require,module,exports){
$("#btn_imagedelete").on('click', (e) => {
  $("#window_imageDelete").show().css("z-index", 61);
  $(".draggable:not(#window_imageDelete)").css("z-index", 60);

  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["（全て）"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }

    $("#imageDelete_tagbox").empty();
    for(item of tagList){
      $("#imageDelete_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    imageDelete_setTag(tagList[0]);
  });
});

$("#imageDelete_tagbox").on('change', (e) => {
  imageDelete_setTag($("#imageDelete_tagbox").val());
});

$("#imageDelete_close, #imageDelete_close2").on('click', (e) => {
  $("#window_imageDelete").hide();
  $("#imageDelete_password").val("");
});

function imageDelete_setTag(tag){
  $("#imageDelete_imagearea").empty();
  let password = $("#imageDelete_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#imageDelete_imagearea").append($(`<div><img src="${ddf.base_url + item}" /><input type="checkbox" value="${item}"></div>`));
      }
    }else if(tag == "（全て）"){
      $("#imageDelete_imagearea").append($(`<div><img src="${ddf.base_url + item}" /><input type="checkbox" value="${item}"></div>`));
    }
  }
}

$("#imageDelete_btnpassword").on('click', (e) => {
  $("#imageDelete_btnpassword").hide();
  $("#imageDelete_password").show().focus();
});

$("#imageDelete_password").on('focusout', (e) => {
  $("#imageDelete_btnpassword").show();
  $("#imageDelete_password").hide();
  imageDelete_setTag($("#imageDelete_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#imageDelete_password").blur();
  }
});

$("button#imageDelete_delete").on('click', (e) => {
  imageList = [];
  for(obj of $("#imageDelete_imagearea :checked")){
    imageList.push(obj.value);
    ddf.images.imageList.splice(ddf.images.imageList.indexOf(obj.value), 1);
  }
  ddf.deleteImage(imageList).then((r) => {
    imageDelete_setTag($("#imageDelete_tagbox").val());
    $("#imageDelete_result").text(r.resultText);
  });
});
},{}],18:[function(require,module,exports){
$("#btn_rangedd4").on("click", (e) => {
  ddf.cmd.magicRangeDD4th_show("");
});

$("#magicRangeDD4th_close, #magicRangeDD4th_close2").on('click', (e) => {
  $("#window_magicRangeDD4th").hide();
});

sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#magicRangeDD4th_color").val(c.toHex());
};
$("#magicRangeDD4th_color2").spectrum(sp_param);

ddf.cmd.magicRangeDD4th_show = (imgId, x = 0, y = 0) => {
  if(character = ddf.characters[imgId]){
    character = character.data;
    $("#window_magicRangeDD4th .title").text("魔法範囲変更（Ｄ＆Ｄ４版）");
    $("#magicRangeDD4th_send").text("変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }
    character = {
      type: "magicRangeMarkerDD4th",
      name: index + 1,
      rangeType: "closeBurstDD4th",
      feets: 15,
      color: 0,
      timeRange: 1,
      info: "",
      isHide: false,
      size: 0,
      x: x,
      y: y,
      counters: {},
      statusAlias: {},
      createRound: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      initiative: 1,
      rotation: 0,
      size: 0
    };
    $("#window_magicRangeDD4th .title").text("魔法範囲作成（Ｄ＆Ｄ４版）");
    $("#magicRangeDD4th_send").text("追加");
  }
  $("#magicRangeDD4th_imgId").val(character.imgId);
  $("#magicRangeDD4th_name").val(character.name);
  $("#magicRangeDD4th_rangeType").val(character.rangeType);
  $("#magicRangeDD4th_feets").val(character.feets / 5);
  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#magicRangeDD4th_color").val(color);
  $("#magicRangeDD4th_color2").spectrum("set", "#"+color);
  $("#magicRangeDD4th_timeRange").val(character.timeRange);
  $("#magicRangeDD4th_info").val(character.info);
  $("#magicRangeDD4th_isHide").prop("checked", !character.isHide);

  $("#window_magicRangeDD4th").show().css("zIndex", 61);
  $(".draggable:not(#window_magicRangeDD4th)").css("zIndex", 60);
};

$("#magicRangeDD4th_send").on('click', (e) => {
  if(character = ddf.characters[$("#magicRangeDD4th_imgId").val()]){

    character.data.name = $("#magicRangeDD4th_name").val();
    character.data.rangeType = $("#magicRangeDD4th_rangeType").val();
    character.data.feets = $("#magicRangeDD4th_feets").val() * 5;
    character.data.color = parseInt("0x"+$("#magicRangeDD4th_color").val());
    character.data.timeRange = $("#magicRangeDD4th_timeRange").val();
    character.data.info = $("#magicRangeDD4th_info").val();
    character.data.isHide = !$("#magicRangeDD4th_isHide").prop("checked");

    ddf.changeCharacter(character.data).then((r) => {
      ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character.data], "dummy\t"]]});
      $("#window_magicRangeDD4th").hide();
    });
  }else{

    character = {
      type: "magicRangeMarkerDD4th",
      /*name: index + 1,
      rangeType: "closeBurstDD4th",
      feets: 15,
      color: 0,
      timeRange: 1,
      info: "",
      isHide: false,*/
      size: 0,
      x: 1,
      y: 1,
      counters: {},
      statusAlias: {},
      createRound: 1,
      draggable: true,
      imageName: "",
      imgId: "0",
      initiative: 1,
      rotation: 0,
      size: 0
    };
    character.name = $("#magicRangeDD4th_name").val();
    character.rangeType = $("#magicRangeDD4th_rangeType").val();
    character.feets = $("#magicRangeDD4th_feets").val() * 5;
    character.color = parseInt("0x"+$("#magicRangeDD4th_color").val());
    character.timeRange = $("#magicRangeDD4th_timeRange").val();
    character.info = $("#magicRangeDD4th_info").val();
    character.isHide = !$("#magicRangeDD4th_isHide").prop("checked");

    ddf.addCharacter(character).then((r) => {
      $("#window_magicRangeDD4th").hide();
    });
  }
});

},{"../.option.spectrum.json":3}],19:[function(require,module,exports){
$("#btn_mapchange").on("click", (e) => {
  mapChange_show();
});

$("#window_mapChange input").on('change', mapChange_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapChange_color").val(c.toHex());
  mapChange_previewUpdate();
};
$("#mapChange_color2").spectrum(sp_param);

function mapChange_show(){
  $("#window_mapChange").show().css("z-index", 61);
  $(".draggable:not(#window_mapChange)").css("z-index", 60);

  color = new tinycolor("rgb("+[ddf.roomState.mapData.gridColor / 65536 & 0xFF,ddf.roomState.mapData.gridColor / 256 & 0xFF,ddf.roomState.mapData.gridColor & 0xFF]+")").toHex();
  $("#mapChange_width").val(ddf.roomState.mapData.xMax);
  $("#mapChange_height").val(ddf.roomState.mapData.yMax);
  $("#mapChange_isAlternately").prop("checked", ddf.roomState.mapData.isAlternately);
  //ddf.roomState.mapData.mirrored
  $("#mapChange_gridInterval").val(ddf.roomState.mapData.gridInterval);
  $("#mapChange_color").val(color);
  $("#mapChange_color2").spectrum("set", "#"+color);
  switch(ddf.roomState.mapData.mapType){
    case "imageGraphic":
      $("#mapChange_imageSource").val(ddf.roomState.mapData.imageSource);
      if($("#mapChange_imageSource").val() == "image/whiteBack.png"){
        $("#mapChange_blank").prop("checked", true);
      }else{
        $("#mapChange_blank").prop("checked", false);
      }
      $("#mapChange_mirrored").prop("checked", ddf.roomState.mapData.mirrored);
  }

  mapChange_previewUpdate();
}

function mapChange_previewUpdate(){
  param = {
      x: $("#mapChange_width").val(),
      y: $("#mapChange_height").val(),
      border: true,
      alt: $("#mapChange_isAlternately").prop("checked"),
      num: true,
      size: $("#mapChange_gridInterval").val(),
      color: "#"+$("#mapChange_color").val()
  };
  zoom = Math.min(1, 7.76 / param.y,8 / param.x);
  $("#mapChange_preview").css("transform", `scale(${zoom})`);
  $("#mapChange_grid, #mapChange_map").css({width: param.x * 50, height: param.y * 50});
  $("#mapChange_grid").attr("data", "img/grid.svg?"+$.map(param, (v,k) => {return k+"="+v;}).join("&"));
  $("#mapChange_map").attr("src", ddf.base_url + ($("#mapChange_blank").prop("checked")?"image/whiteBack.png":$("#mapChange_imageSource").val()));
  if($("#mapChange_mirrored").prop("checked")){
    $("#mapChange_map").addClass("mirrored");
  }else{
    $("#mapChange_map").removeClass("mirrored");
  }
}

$("#mapChange_close, #mapChange_close2").on("click", (e) => {
  $("#mapChange_image").show();
  $("#mapChange_imageSelect").hide();
  $("#window_mapChange").hide();
});

$("#mapChange_imageChange").on('click', (e) => {
  $("#mapChange_image").hide();
  $("#mapChange_imageSelect").show();

  
  ddf.getImageTagsAndImageList().then((r) => {
    tagList = ["（全て）"];
    ddf.images = r;
    for(item of ddf.images.imageList){
      if(ddf.images.tagInfos[item]){
        for(tag of ddf.images.tagInfos[item].tags){
          if(tag == ""){continue;}
          tagList.includes(tag) || tagList.push(tag);
        }
      }
    }

    $("#mapChange_tagbox").empty();
    for(item of tagList){
      $("#mapChange_tagbox").append($(`<option>${encode(item)}</option>`));
    }
    mapChange_setTag(tagList[0]);
  });
});

$("#mapChange_tagbox").on('change', (e) => {
  mapChange_setTag($("#mapChange_tagbox").val());
  mapChange_previewUpdate();
});

function mapChange_setTag(tag){
  $("#mapChange_imagearea").empty();
  let password = $("#mapChange_password").val();
  for(item of ddf.images.imageList){
    if(ddf.images.tagInfos[item]){
      if((tag == "（全て）" || ddf.images.tagInfos[item].tags.includes(tag)) && (ddf.images.tagInfos[item].password == "" || ddf.images.tagInfos[item].password == password)){
        $("#mapChange_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
      }
    }else if(tag == "（全て）"){
      $("#mapChange_imagearea").append($(`<div><img src="${ddf.base_url + item}" /></div>`));
    }
  }
}
$(document).on('click', '#mapChange_imagearea div img', (e) => {
  let img = $(e.currentTarget).attr("src");
  $("#mapChange_imageSource").val(img.replace(ddf.base_url, ""));
  $("#mapChange_blank").prop("checked", false);
  $("#mapChange_mirrored").prop("checked", $("#mapChange_mirrored2").prop("checked"));
  mapChange_previewUpdate();
});

$("#mapChange_btnpassword").on('click', (e) => {
  $("#mapChange_btnpassword").hide();
  $("#mapChange_password").show().focus();
});

$("#mapChange_password").on('focusout', (e) => {
  $("#mapChange_btnpassword").show();
  $("#mapChange_password").hide();
  imageDelete_setTag($("#mapChange_tagbox").val());
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#mapChange_password").blur();
  }
});

$("#mapChange_send").on('click', (e) => {
  ddf.changeMap(
    "imageGraphic",
    $("#mapChange_blank").prop("checked")?"image/whiteBack.png":$("#mapChange_imageSource").val(),
    $("#mapChange_width").val(),
    $("#mapChange_height").val(),
    $("#mapChange_gridInterval").val(),
    $("#mapChange_isAlternately").prop("checked"),
    $("#mapChange_mirrored").prop("checked"),
    parseInt("0x"+$("#mapChange_color").val()),
    ddf.roomState.mapData.mapMarksAlpha,
    ddf.roomState.mapData.mapMarks).then((r) => {
    $("#mapChange_image").show();
    $("#mapChange_imageSelect").hide();
    $("#window_mapChange").hide();
  });
});
},{"../.option.spectrum.json":3}],20:[function(require,module,exports){
$("#btn_mapmask").on("click", (e) => {
  ddf.mapMask_show("");
});

$("#window_mapMask .slider").slider({min: 0,max: 1, step:0.05, stop: (e, ui) => {
    $("#mapMask_alpha").val(ui.value);
    mapMask_previewUpdate();
  }
});

$("#window_mapMask input").on('change', mapMask_previewUpdate);
sp_param = require("../.option.spectrum.json");
sp_param.change = (c) => {
  $("#mapMask_color").val(c.toHex());
  mapMask_previewUpdate();
};
$("#mapMask_color2").spectrum(sp_param);

ddf.mapMask_show = (imageId) => {
  $("#window_mapMask").show().css("z-index", 61);
  $(".draggable:not(#window_mapMask)").css("z-index", 60);

  var character;
  if(ddf.characters[imageId] != null){
    character = ddf.characters[imageId].data;
    $("#mapMask_change").show();
    $("#mapMask_create").hide();
    $("#mapMask_preview").addClass("edit");
    $("#mapMask_title").text("マスク変更");
  }else{
    index = 0;
    reg = /^(\d+)$/;
    for(item in ddf.characters){
      if(v = reg.exec(ddf.characters[item].data.name)){
        index = Math.max(index, parseInt(v[1]))
      }
    }

    character = {
      type: "mapMask",
      name: index + 1,
      width: 3,
      height: 3,
      color: 0,
      alpha: 1,
      imgId: "",
      draggable: true,
      rotation: 0,
      x: 0,
      y: 0
    }

    $("#mapMask_change").hide();
    $("#mapMask_create").show();
    $("#mapMask_preview").removeClass("edit");
    $("#mapMask_title").text("マスク作成");
  }

  $("#mapMask_alpha").val(character.alpha);
  $("#window_mapMask .slider").slider("value", character.alpha);
  $("#mapMask_imageId").val(character.imgId);
  $("#mapMask_name").val(character.name);

  color = new tinycolor("rgb("+[character.color / 65536 & 0xFF,character.color / 256 & 0xFF,character.color & 0xFF]+")").toHex();
  $("#mapMask_width").val(character.width);
  $("#mapMask_height").val(character.height);
  $("#mapMask_color").val(color);
  $("#mapMask_color2").spectrum("set", "#"+color);

  mapMask_previewUpdate();
}

function mapMask_previewUpdate(){
  zoom = Math.min(1, 4.6 / $("#mapMask_width").val(),4.8 / $("#mapMask_height").val());
  $("#mapMask_preview").css("transform", `scale(${zoom})`);
  $("#mapMask_preview").css({
    width: $("#mapMask_width").val() * 50,
    height: $("#mapMask_height").val() * 50,
    opacity: $("#mapMask_alpha").val(),
    backgroundColor: "#"+$("#mapMask_color").val()
  });
}

$("#mapMask_close, #mapMask_close2").on("click", (e) => {
  $("#window_mapMask").hide();
});

var click = {
  x:0,
  y:0
};

$("#mapMask_preview").draggable({
  start: (event) =>  {
    click.x = event.clientX;
    click.y = event.clientY;
  },
  helper: () => {
    let obj = $("#mapMask_preview").clone();
    obj.appendTo("#mapSurface");
    return obj;
  },
  drag: (event, ui) =>  {
      // This is the parameter for scale()
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

      // jQuery will simply use the same object we alter here
      ui.position = {
          left: (event.clientX - click.x + original.left) / zoom,
          top:  (event.clientY - click.y + original.top ) / zoom
      };
      if(ddf.roomState.viewStateInfo.isSnapMovablePiece){
        if(ddf.roomState.mapData.isAlternately && ddf.roomState.mapData.gridInterval % 2 == 1){
          if((Math.floor(ui.position.top / 50 / ddf.roomState.mapData.gridInterval) & 1)){
            ui.position = {
                left: ((Math.floor(ui.position.left / 25) | 1) ^ 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }else{
            ui.position = {
                left: (Math.floor(ui.position.left / 25) | 1) * 25,
                top: Math.floor(ui.position.top / 50) * 50
            };
          }
        }else{
          ui.position = {
              left: Math.floor(ui.position.left / 50) * 50,
              top: Math.floor(ui.position.top / 50) * 50
          };
        }
      }
    },
    stop: (event, ui) => {
      character = {
        type: "mapMask",
        name: $("#mapMask_name").val(),
        width: $("#mapMask_width").val(),
        height: $("#mapMask_height").val(),
        color: parseInt("0x"+$("#mapMask_color").val()),
        alpha: $("#mapMask_alpha").val(),
        imgId: "",
        draggable: true,
        rotation: 0,
        x: ui.position.left / 50,
        y: ui.position.top / 50
      };
      ddf.addCharacter(character);
      if($("#mapMask_multiple").prop("checked")){
        $("#mapMask_name").val(parseInt($("#mapMask_name").val()) + 1)
      }else{
        $("#window_mapMask").hide();
      }
    },
    cancel: ".edit"
});


$("#mapMask_send").on('click', (e) => {
  imageId = $("#mapMask_imageId").val();
  character = ddf.characters[imageId].data;

  character.name = $("#mapMask_name").val();
  character.color = parseInt("0x"+$("#mapMask_color").val());
  character.width = $("#mapMask_width").val();
  character.height = $("#mapMask_height").val();
  character.alpha = $("#mapMask_alpha").val();

  ddf.changeCharacter(character).then((r) => {
    ddf.characters[imageId].data = character;
    ddf.cmd.refresh_parseRecordData({record: [[0, "changeCharacter", [character], "dummy\t"]]});
    $("#window_mapMask").hide();
  });
});
},{"../.option.spectrum.json":3}],21:[function(require,module,exports){

$("#btn_memo").on('click', (e) => {
  ddf.cmd.openMemo("");
});

$("#memo_close, #memo_close2").on('click', (e) => {
  $("#window_memo").hide();
});

ddf.cmd.openMemo = (imgId) => {
  $("#memo_imgId").val(imgId);
  if(!(character = ddf.characters[$("#memo_imgId").val()])){
    character = {
      color: 0xFFFFFF,
      draggable: true,
      height: 1,
      width: 1,
      rotation: 0,
      x: 0,
      y: 0,
      type: "Memo",
      isPaint: true,
      imgId: "",
      message: ""
    };
    $("#window_memo .title").text("共有メモ");
    $("#memo_send").text("追加");
  }else{
    character = character.data;
    $("#window_memo .title").text("共有メモ変更");
    $("#memo_send").text("変更");
  }

  $("#memo_tab, #memo_edit").empty();
  count = 0;
  for(item of character.message.split("\t|\t")){
    tab = $(`<div class="tab">${encode(item.split("\r")[0])}</div>`);
    obj = $(`<textarea>${encode(item)}</textarea>`);
    del = $(`<img src="image/icons/cancel.png">`);
    del.on('click', ((tab, obj)=>{return (e)=>{
      tab.remove();
      obj.remove();
    }})(tab, obj));
    tab.append(del);
    tab.on('click', ((obj) => {return (e) => {
      if(!$(this).hasClass("active")){
        $("#memo_tab .active, #memo_edit .active").removeClass("active");
        $(obj).addClass("active");
        $(this).addClass("active");
      }
    }})(obj));
    $("#memo_tab").append(tab);
    $("#memo_edit").append(obj);
    count++;
  }
  $("#memo_tab .tab:eq(0), #memo_edit textarea:eq(0)").addClass("active");
  $("#window_memo").show().css("z-index", 61);
  $(".draggable:not(#window_memo)").css("z-index", 60);
};

$("#memo_send").on('click', (e) => {
  arr = $.map($("#memo_edit textarea"),(v)=>{return $(v).val().replace("\n","\r");});
  message = arr.join("\t|\t")
  if(character = ddf.characters[$("#memo_imgId").val()]){
    character.data.message = message;
    ddf.changeCharacter(character.data).then((r) => {
        title = character.data.message.split("\r")[0];
        ar = character.data.message.split(/\t\|\t/);
        if(ar.length > 1){
          body = ar.map((v)=>{return `[${v.split("\r")[0]}]`}).join("<br>")
        }else{
          body = character.data.message.replace("\r", "<br>");
        }
        character.obj.html(`<span>${encode(title)}</span><img src="${ddf.base_url}image/memo2.png"><div>${encode(body)}</div>`);
    });
  }else{
    character = {
      color: 0xFFFFFF,
      draggable: true,
      height: 1,
      width: 1,
      rotation: 0,
      x: 0,
      y: 0,
      type: "Memo",
      isPaint: true,
      imgId: "0",
      message: message
    }
    ddf.addCharacter(character);
  }
  $("#window_memo").hide();
});

$("#memo_addTab").on('click', (e) => {
  count = $("#memo_tab .tab").length;
  tab = $(`<div class="tab active">${count + 1}</div>`);
  obj = $(`<textarea class="active"></textarea>`);
  del = $(`<img src="image/icons/cancel.png">`);
  del.on('click', ((tab, obj)=>{return (e)=>{
    tab.remove();
    obj.remove();
  }})(tab, obj));
  tab.append(del);
  tab.on('click', ((obj) => {return (e) => {
    if(!$(this).hasClass("active")){
      $("#memo_tab .active, #memo_edit .active").removeClass("active");
        $(obj).addClass("active");
        $(this).addClass("active");
    }
  }})(obj));
  $("#memo_tab .active, #memo_edit .active").removeClass("active");
  $("#memo_tab").append(tab);
  $("#memo_edit").append(obj);
});

$(document).on('keyup', "#memo_edit textarea", (e) => {
  $("#memo_tab .active").text(encode($("#memo_edit .active").val().split("\n")[0]));
});
},{}],22:[function(require,module,exports){

$("#btn_imageupload").on("click", (e) => {
  $("#window_upload").show().css("z-index", 61);
  $(".draggable:not(#window_upload)").css("z-index", 60);
});

var upload_uploadlist = [];

$form = $("#upload_droparea");

$("#upload_droparea ~ .overwrap").on('dragenter', () => {
  $form.addClass('is-dragover');
});

$form.on('drag dragstart dragend dragover dragenter dragleave drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
})
.on('dragover dragenter', () => {
  $form.addClass('is-dragover');
})
.on('dragleave dragend drop', () => {
  $form.removeClass('is-dragover');
})
.on('drop', (e) => {
  droppedFiles = e.originalEvent.dataTransfer.files;

  upload_uploadfiles(droppedFiles);
});

$("#window_upload :file").on('change', (e) => {
  arr = [];
  for(item of $("#window_upload :file")[0].files){
    arr.push(item);
  }
  upload_uploadfiles(arr);
});

function upload_uploadfiles(droppedFiles){
  upload_uploadlist = [];
  $("#upload_droparea").empty();
  for(file of droppedFiles){
    new Promise((success, error)=>{
      let fr = new FileReader();

      fr.onload = success;

      if(/image\/(gif|png|jpeg)/.test(file.type)){
        fr.readAsArrayBuffer(file);
      }
    }).then(((file) => {return (r)=>{
      let data = new Uint8Array(r.target.result);

      if(upload_uploadlist.length == 0){
        $("#upload_droparea").empty();
      }
      upload_uploadlist.push([file, data]);
      url = `data:${file.type};base64,${btoa(Array.from(data, e => String.fromCharCode(e)).join(""))}`;
      $("#upload_droparea").append(`<div><img src="${url}"></div>`);
    };})(file));
  }
}

$("#upload_send").on('click', (e)=>{
  $("#upload_result").text("");
  for(file of upload_uploadlist){
    ddf.uploadImageData(
      file[0].name,
      file[1],
      $("#upload_password").val(),
      $("#upload_tag").val().split(/[ 　]/),
      $("#upload_private").val()=="1"?null:ddf.userState.room
    ).then(((name) => {return (r)=>{
      $("#upload_result").text($("#upload_result").text() + name + ":" + r.resultText + "　　");
    };})(file[0].name));
  }
  upload_uploadlist = [];
});

$("#upload_tagbox").on('change', (e)=>{
  $("#upload_tag").val($("#upload_tagbox").val()+"　");
});

$("#upload_close, #upload_close2").on('click', (e)=>{
  $("#window_upload").hide();
  $("#upload_droparea").empty();
  $("#upload_password").val();
  $("#upload_btnpassword").text("パスワードなし");
});

$("#upload_btnpassword").on('click', (e) => {
  $("#upload_btnpassword").hide();
  $("#upload_password").show().focus();
});

$("#upload_password").on('focusout', (e) => {
  $("#upload_btnpassword").show().text($("#upload_password").val()==""?"パスワードなし":"パスワードあり");
  $("#upload_password").hide();
}).on('keydown', (e) => {
  if(e.keyCode == 13){
    $("#upload_password").blur();
  }
});

$("#window_upload .overwrap a").on('click', (e) => {
  $("#window_upload .overwrap :file").click();
  return false;
});

},{}]},{},[10]);

//# sourceMappingURL=.maps/index.js.map
