ddf.cmd = {};
chatlog = [];

var version = require('../../package.json').version;

var store = require('store');
var screenshot = require('./screenshot.js').generate;
var lang = "Japanese";

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
  //console.log(e);
});
var click = {x:0,y:0};

ddf.roomInfos = [];
var pageBuffer, diceRollBuffer, context;

function playSound(buffer) {
  if(ddf.roomState.playSound){
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  }
}

$(() => {
  ddf.base_url = config.base_url;

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
      var zoom = ddf.roomState.zoom;

      var original = ui.originalPosition;

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

  $(document).on('mouseover', ".mapMaskFrame.draggableObj", (e) => {
    $(".mapMaskFrame.draggableObj").css('zIndex', 35);
    $(e.currentTarget).css('zIndex', 36);
  });
  $(document).on('mouseover', ".magicRangeFrame", (e) => {
    $(".magicRangeFrame").css('zIndex', 40);
    $(e.currentTarget).css('zIndex', 41);
  });
  $(document).on('mouseover', ".mapMarkerFrame", (e) => {
    $(".mapMarkerFrame").css('zIndex', 45);
    $(e.currentTarget).css('zIndex', 46);
  });
  $(document).on('mouseover', ".cardFrame", (e) => {
    $(".cardFrame").css('zIndex', 50);
    $(e.currentTarget).css('zIndex', 51);
  });
  $(document).on('mouseover', ".characterFrame:not(.isHide)", (e) => {
    $(".characterFrame:not(.isHide)").css('zIndex', 55);
    $(e.currentTarget).css('zIndex', 56);
  });
  $(document).on('mouseover', ".chitFrame", (e) => {
    $(".chitFrame").css('zIndex', 60);
    $(e.currentTarget).css('zIndex', 61);
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
  
  getLoginInfo();
  
  /*待合室コマンド*/
  
  $("#btn_loginNumber").on('click', (e) => {
    $("#window_loginNumber").show().css("zIndex", 151);
    $(".draggable:not(#window_loginNumber)").css("zIndex", 150);
  });
  $("#window_loginNumber .btn").on('click', (e) =>  {
    $("#window_loginNumber").hide();
  });
  
  /*$("#btn_version").on("click", (e) => {
  });*/
  $("#btn_manual, #btn_manual2").on('click', (e) => {
    window.open(ddf.base_url + "README.html");
  });
  /*$("#btn_tutorial").on("click", (e) => {
  });*/
  $("#btn_site, #btn_site2").on('click', () => {
    window.open("http://www.dodontof.com/");
  });
  
  $("#btn_removePlayRoom").on('click', (e) => {
    removePlayRoom(parseInt($("#playRoomNo").val().trim()));
  });
  
  
  $("#btn_createPlayRoom").on('click', (e) => {
    ddf.userState.room = -1;
    $("#window_createPlayRoom").show().css("zIndex", 151);
    $(".draggable:not(#window_createPlayRoom)").css("zIndex", 150);
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

  $("#playddf.roomInfos table").tablesorter();

  var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
  $("#mapSurface").on(mousewheelevent,(e) => {
      e.preventDefault();
      var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
      if (delta < 0){
        ddf.cmd.setZoom(-0.1);
      } else {
        ddf.cmd.setZoom(0.1);
      }
  });
  
  $("#initiative table").colResizable({partialRefresh: true});
});

ddf.safeDragDestoroy = () => {
  try{
    $(".draggableObj").draggable("destroy");
  }catch(e){}
}

ddf.cmd.setZoom = setZoom;
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
    
    if(store.get('userState')){
      ddf.userState = store.get('userState');
      ddf.userState.room = -1;
      ddf.userState.backgroundColor = "FFFFFF";
    }else{
      ddf.userState = {
        room: -1,
        own: "\t"+ddf.util.getUniqueId(),
        name: ddf.info.defaultUserNames.length==0?"ななしさん":ddf.info.defaultUserNames[Math.random()*ddf.info.defaultUserNames.length|0],
        fontSize: 10,
        chatColor: "000000",
        backgroundColor: "FFFFFF",
        showTime: false,
        chatPalette: []
      };
      saveUserState();
    }
    $("#login_name").val(ddf.userState.name);

    ddf.cmd.getPlayRoomInfo();
    return r;
  });
}

ddf.cmd.getPlayRoomInfo = getPlayRoomInfo;
function getPlayRoomInfo(){
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
      ddf.roomInfos[parseInt(room.index.trim())] = room;
      
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
      $("#playddf.roomInfos tbody").append(tr);
      tr.on('dblclick', ((roomNumber) => {return (e) => {
        checkRoomStatus(roomNumber);
      }})(parseInt(room.index)));
      tr.on('click', ((roomNumber) => {return (e) => {
        $("#playRoomNo").val(roomNumber);
      }})(parseInt(room.index)));
      $("#playRoomInfos table tbody").append(tr);
    }
    $("#playddf.roomInfos table").trigger( 'update');
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
}

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
            ddf.roomInfos[roomNumber] = r.playRoomStates[0];
            checkRoomStatus(roomNumber);
          };
        })(r.playRoomIndex)
      );

    }else{
    }
  });
}

ddf.cmd.checkRoomStatus = checkRoomStatus;
function checkRoomStatus(roomNumber, isVisit = null, password = null){
  room = ddf.roomInfos[roomNumber];
  if(room){
    if(room.lastUpdateTime==""){
    /*ルーム未作成*/
      ddf.userState.room = roomNumber;
      $("#window_createPlayRoom").show().css("zIndex", 151);
      $(".draggable:not(#window_createPlayRoom)").css("zIndex", 150);
    }else if((room.passwordLockState && password == null) || (room.canVisit && isVisit == null)){
    /*見学可・パスワード付きルーム1回目*/
      ddf.cmd.loginCheck_show(roomNumber);
    }else{
    /*ログイン*/
      return ddf.checkRoomStatus(roomNumber, password).then((r) => {
        roominfo=r;
        if(roominfo.isRoomExist){
          ddf.userState.room = roominfo.roomNumber;
          ddf.userState.name = $("#login_name").val();
          saveUserState();
          ddf.sendChatMessage(0, "どどんとふ\t", "「"+ddf.userState.name+"」がログインしました。（htmlddf "+version+"）", "00aa00", true);
          $("#main").hide();
          //history.pushState({roomNumber: roomNumber}, "room="+roomNumber, "index.html?room="+roomNumber);
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
          if(ddf.userState.chatPalette[ddf.base_url+roominfo.roomNumber]){
            for(item in ddf.userState.chatPalette[ddf.base_url+roominfo.roomNumber]){
              palette = ddf.userState.chatPalette[ddf.base_url+roominfo.roomNumber][item];
              palette && $("#chatPalette_tabs").append($(`<p id="${palette.tabName}">${/^id/.test(palette.tabName)?$("#chatPalette_tabs p").length+1:palette.tabName}</p>`))
            }
          }else{
            item = {
              tabName: "id"+ddf.util.getUniqueId(),
              text: "",
              name: "",
              color: 0xFFFFFF
            };
            ddf.userState.chatPalette[ddf.base_url+roominfo.roomNumber] = [];
            ddf.userState.chatPalette[ddf.base_url+roominfo.roomNumber][item.tabName] = item;
            $("#chatPalette_tabs").append($(`<p id="${item.tabName}">1</p>`))

            ddf.cmd.saveUserState();
          }
          $("#chatPalette_tabs > p:eq(0)").click();
          getDiceBotInfos();
          ddf.characters = [];
          ddf.roomState = {};
          ddf.roomState.roomNumber = roomNumber;
          ddf.roomState.zoom = 1;
          ddf.roomState.roundTimeData = {};
          ddf.roomState.ini_characters = [];
          ddf.roomState.roundTimeData.counterNames = [];
          ddf.userState.rIndex = 0;
          var count = 0;
          ddf.roomState.unread = [];
          ddf.roomState.effects = [];
          ddf.roomState.playSound = true;
          ddf.roomState.chatChannelNames = roominfo.chatChannelNames;
          ddf.roomState.viewStateInfo =  {
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
          };
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
          $("#log > div, #chattext").css({
            backgroundColor: "#"+ddf.userState.backgroundColor,
            fontSize: ddf.userState.fontSize+"pt"
          });
          setChatTab("0");
          refresh();
        }
      });
    }
  }
};

ddf.cmd.removePlayRoom = removePlayRoom;
function removePlayRoom(roomNumber){
  room = ddf.roomInfos[roomNumber];
  if(room && room.lastUpdateTime){
    if(room.passwordLockState){
      ddf.cmd.roomDelete_show(roomNumber);
    }else{
      body = `No.${room.index}：${room.playRoomName}\nを削除しますか？`;
      if(password != null || confirm(body)){
        ddf.removePlayRoom(roomNumber, false, password).then((r) => {
          $("#playRoomInfos tbody").empty();
          ddf.cmd.getPlayRoomInfo();
        });
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
    try{
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
        ddf.cmd.refresh_parseMapData(refreshData);
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
      if(refreshData.playRoomName){
        ddf.roomState.playRoomName = refreshData.playRoomName;
      }
      if(refreshData.loginUserInfo){
        ddf.roomState.loginUserInfo = refreshData.loginUserInfo;
        $("#btn_member").text(`ルームNo.${ddf.roomState.roomNumber}：${refreshData.loginUserInfo.length}名`);
      }
      r = refreshData = null;
    }catch(e){
      console.log(e);
    }finally{
      if(ddf.userState.room != -1){
        setTimeout(refresh, ddf.info.refreshInterval * 1000);
      }
    }
  });
}

function refresh_parseEffects(refreshData){
  ddf.roomState.effects = refreshData.effects;
  ddf.cmd.effectList_create();
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
    if(matches = /^(.*)@([^@]+)@([^@]+)$/.exec(item[1].message)){
      item[1].message = matches[1];
      item[1].senderName = matches[2];
      item[1].state = matches[3];
    }else if(matches = /^(.*)@([^@]+)$/.exec(item[1].message)){
      item[1].message = matches[1];
      item[1].senderName = matches[2];
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
          $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${ddf.userState.showTime?'<span class="time">'+dateFormat(new Date(item[0]*1000), "HH:MM")+"：</span>":""}${encode(item[1].senderName)}:${encode(param.chatMessage).replace(/\n/, "<br>")}</p>`));
          chatlog.push([item[1].channel, ddf.roomState.chatChannelNames[item[1].channel], item[0],"#"+item[1].color,item[1].senderName, param.chatMessage]);
          $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
          lastRandResult = [param.chatMessage, param.randResults];
          continue;
          break;
      }
    }else if(matches = /^###CutInMovie###(.+)$/.exec(item[1].message)){
      param = JSON.parse(matches[1]);
      $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${ddf.userState.showTime?'<span class="time">'+dateFormat(new Date(item[0]*1000), "HH:MM")+"：</span>":""}${encode(item[1].senderName)}:【${encode(param.message)}】</p>`));
      chatlog.push([item[1].channel, ddf.roomState.chatChannelNames[item[1].channel], item[0],"#"+item[1].color,item[1].senderName, param.chatMessage]);
      $(`#log div:eq(${item[1].channel})`).hasClass("active") || ddf.roomState.unread[item[1].channel]++;
    }else{
      $(`#log div:eq(${item[1].channel})`).append($(`<p style="color: #${item[1].color}">${ddf.userState.showTime?'<span class="time">'+dateFormat(new Date(item[0]*1000), "HH:MM")+"：</span>":""}${encode(item[1].senderName)}:${encode(item[1].message).replace(/\n/, "<br>")}</p>`));
      chatlog.push([item[1].channel, ddf.roomState.chatChannelNames[item[1].channel], item[0],"#"+item[1].color,item[1].senderName, item[1].message]);
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

          $("#initiative table").colResizable({partialRefresh: true});
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
          
          $("#window_chatPalette").show();
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

ddf.cmd.refresh_parseRecordData = refresh_parseRecordData;
function refresh_parseRecordData(refreshData){
  ddf.safeDragDestoroy();
  iniChanged = false;
  force = false;
  for(record of refreshData.record){
    switch(record[1]){
    case "addCharacter":
      force = true;
    case "changeCharacter":
      data = record[2][0];
      character = ddf.characters[data.imgId];
      if(!character){
        refresh_parseCharacters({characters: [data]});
        iniChanged = true;
        continue;
      }
      obj = character.obj;
      switch(data.type){
        case "MetallicGuardianDamageRange":
          
          obj.css({
            clipPath: data.maxmaxRange < 2 ?"":`polygon(0 ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px,
                       0 ${(data.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px,
                       ${(data.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px 0,
                       ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px 0,
                       ${(data.maxRange * 100 - 50) * ddf.roomState.mapData.gridInterval}px ${(data.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px,
                       ${(data.maxRange * 100 - 50) * ddf.roomState.mapData.gridInterval}px ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px,
                       ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px,
                       ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px ${(data.maxRange * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                       ${(data.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px ${(data.maxRange * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                       ${(data.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px ${(data.maxRange * 50) * ddf.roomState.mapData.gridInterval}px)`,
            left: data.x * 50,
            top: data.y * 50,
            marginLeft: data.maxRange > 1 ? (data.maxRange * -50 + 50) * ddf.roomState.mapData.gridInterval: 0,
            marginTop:  (data.maxRange * -50) * ddf.roomState.mapData.gridInterval,
            opacity: 0.5,
            transformOrigin: `center ${data.maxRange * 50 + 25}px`,
            transform: `rotateZ(${data.rotation}deg)`
          });
          obj.children("object").attr("data", `img/rangeMG.svg?maxRange=${data.maxRange}&minRange=${data.minRange}&color=${data.color}&gridInterval=${ddf.roomState.mapData.gridInterval}`);
          obj.children("object").css({
            width: (data.maxRange * 100 - 50) * ddf.roomState.mapData.gridInterval,
            height: (data.maxRange * 50 + 50) * ddf.roomState.mapData.gridInterval
          });
          break;
        case "LogHorizonRange":
          obj.css({
          clipPath: `polygon(0 ${(data.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                     0 ${(data.range * 50) * ddf.roomState.mapData.gridInterval}px,
                     ${(data.range * 50) * ddf.roomState.mapData.gridInterval}px 0,
                     ${(data.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px 0,
                     ${(data.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px ${(data.range * 50) * ddf.roomState.mapData.gridInterval}px,
                     ${(data.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px ${(data.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                     ${(data.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px ${(data.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px, 
                     ${(data.range * 50) * ddf.roomState.mapData.gridInterval}px ${(data.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px)`,
            left: data.x * 50,
            top: data.y * 50,
            marginLeft: (data.range * -50) * ddf.roomState.mapData.gridInterval,
            marginTop:  (data.range * -50) * ddf.roomState.mapData.gridInterval,
            width: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
            height: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
          });
          obj.children("object").attr("data", `img/rangeLH.svg?size=${data.range}&color=${data.color}&gridInterval=${ddf.roomState.mapData.gridInterval}`);
          obj.children("object").css({
            width: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
            height: (data.range * 100 + 50) * ddf.roomState.mapData.gridInterval
          });
          break;
        case "magicRangeMarkerDD4th":
          iniChanged = true;
          obj.animate({
            left: data.x * 50,
            top: data.y * 50
          }, 300);
          if(!data.isHide){
            ddf.roomState.ini_characters[character.data.imgId] = ddf.characters[character.data.imgId];
          }else{
            character.row && character.row.remove();
            delete ddf.roomState.ini_characters[character.data.imgId];
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
        iniChanged = true;
        obj.animate({
          left: data.x * 50,
          top: data.y * 50
        }, 300);
        obj.css({
          width: data.size * 50,
          height: data.size * 50
        });
        if(!data.isHide){
          ddf.roomState.ini_characters[character.data.imgId] = ddf.characters[character.data.imgId];
          obj.removeClass("isHide");
        }else{
          character.row && character.row.remove();
          delete ddf.roomState.ini_characters[character.data.imgId];
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
        obj.html(`<span>${encode(title)}</span><img src="${ddf.base_url}img/memo2.png"><div>${encode(body)}</div>`);
      }
      character.data = data;
      break;
    case "removeCharacter":
      iniChanged = true;
      data = record[2][0];
      character = ddf.characters[data];
      if(character){
        character.obj && character.obj.remove();
        character.row && character.row.remove();
        delete ddf.characters[data[0]];
        if(ddf.roomState.ini_characters[data[0]]){
          delete ddf.roomState.ini_characters[data[0]];
        }
      }
    }
  }
  iniChanged && ddf.cmd.initiative_sort(force);
  $(".draggableObj").draggable(ddf.dragOption);
}

function refresh_parseCharacters(refreshData){
  for(character of refreshData.characters){
    switch(character.type){
    case "Card":
    case "CardTrushMount":
    case "CardMount":
      break;
    case "MetallicGuardianDamageRange":
      obj = $(`<div class="magicRangeFrame metallicGuardian draggableObj rangeBottomMarker" id="${character.imgId}"><object type="image/svg+xml" data="img/rangeMG.svg?maxRange=${character.maxRange}&minRange=${character.minRange}&color=${character.color}&gridInterval=${ddf.roomState.mapData.gridInterval}"></div>`);
      $("#mapSurface").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      obj.css({
        clipPath: character.maxmaxRange < 2 ?"":`polygon(0 ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px,
                   0 ${(character.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px 0,
                   ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px 0,
                   ${(character.maxRange * 100 - 50) * ddf.roomState.mapData.gridInterval}px ${(character.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.maxRange * 100 - 50) * ddf.roomState.mapData.gridInterval}px ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px ${(character.maxRange * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px ${(character.maxRange * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.maxRange * 50 - 50) * ddf.roomState.mapData.gridInterval}px ${(character.maxRange * 50) * ddf.roomState.mapData.gridInterval}px)`,
        left: character.x * 50,
        top: character.y * 50,
        marginLeft: character.maxRange > 1 ? (character.maxRange * -50 + 50) * ddf.roomState.mapData.gridInterval: 0,
        marginTop:  (character.maxRange * -50) * ddf.roomState.mapData.gridInterval,
        opacity: 0.5,
        transformOrigin: `center ${character.maxRange * 50 + 25}px`,
        transform: `rotateZ(${character.rotation}deg)`
      });
      obj.children("object").css({
        width: (character.maxRange * 100 - 50) * ddf.roomState.mapData.gridInterval,
        height: (character.maxRange * 50 + 50) * ddf.roomState.mapData.gridInterval
      });
      break;
    case "LogHorizonRange":
      obj = $(`<div class="magicRangeFrame draggableObj rangeCenterMarker" id="${character.imgId}"><object type="image/svg+xml" data="img/rangeLH.svg?size=${character.range}&color=${character.color}&gridInterval=${ddf.roomState.mapData.gridInterval}"></div>`);
      $("#mapSurface").append(obj);
      ddf.characters[character.imgId] = {
        obj: obj,
        data: character
      };
      obj.css({
        clipPath: `polygon(0 ${(character.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                   0 ${(character.range * 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.range * 50) * ddf.roomState.mapData.gridInterval}px 0,
                   ${(character.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px 0,
                   ${(character.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px ${(character.range * 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px ${(character.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px,
                   ${(character.range * 50 + 50) * ddf.roomState.mapData.gridInterval}px ${(character.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px, 
                   ${(character.range * 50) * ddf.roomState.mapData.gridInterval}px ${(character.range * 100 + 50) * ddf.roomState.mapData.gridInterval}px)`,
        left: character.x * 50,
        top: character.y * 50,
        marginLeft: (character.range * -50) * ddf.roomState.mapData.gridInterval,
        marginTop:  (character.range * -50) * ddf.roomState.mapData.gridInterval,
        opacity: 0.5
      });
      obj.children("object").css({
        width: (character.range * 100 + 50) * ddf.roomState.mapData.gridInterval,
        height: (character.range * 100 + 50) * ddf.roomState.mapData.gridInterval
      });
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

ddf.cmd.refresh_parseMapData = refresh_parseMapData;
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
      mapMarks: refreshData.mapData.mapMarks?refreshData.mapData.mapMarks.join("/"):"",
      mapMarksAlpha: refreshData.mapData.mapMarksAlpha!=null?refreshData.mapData.mapMarksAlpha:1
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
    if(ddf.characters[item].data.type == "magicRangeMarkerDD4th" ||
       ddf.characters[item].data.type == "LogHorizonRange" ||
       ddf.characters[item].data.type == "MetallicGuardianDamageRange"){
      redraw.push([0, "changeCharacter", [ddf.characters[item].data], "dummy\t"]);
    }
  }
  ddf.cmd.refresh_parseRecordData({record: redraw});
}

ddf.cmd.refresh_parseRoundTimeData = refresh_parseRoundTimeData;
function refresh_parseRoundTimeData(refreshData, force = false){
  if(force || JSON.stringify(refreshData.roundTimeData.counterNames) != JSON.stringify(ddf.roomState.roundTimeData.counterNames)){
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
      var tmp = `<tr id="${character.data.imgId}">`;
      tmp+= `<td>${(character.data.initiative==refreshData.roundTimeData.initiative?"●":"")}</td>`;
      if(character.data.initiative < 0 && Math.round((character.data.initiative % 1)*10) >= -0.1){
        tmp+= `<td><input class="initiative" type="number" value="${Math.ceil(character.data.initiative)}"></td>`;
        tmp+= `<td><input class="initiative2" type="number" value="${Math.round(character.data.initiative*100 % 100)}" min="-10" max="89"></td>`;
      }else if(character.data.initiative < 0){
        tmp+= `<td><input class="initiative" type="number" value="${Math.floor(character.data.initiative)}"></td>`;
        tmp+= `<td><input class="initiative2" type="number" value="${Math.round(character.data.initiative*100 % 100)+100}" min="-10" max="89"></td>`;
      }else if(Math.round((character.data.initiative % 1) * 10) >= 9){
        tmp+= `<td><input class="initiative" type="number" value="${Math.ceil(character.data.initiative)}"></td>`;
        tmp+= `<td><input class="initiative2" type="number" value="${Math.round(character.data.initiative*100 % 100 - 100)}" min="-10" max="89"></td>`;
      }else{
        tmp+= `<td><input class="initiative" type="number" value="${Math.floor(character.data.initiative)}"></td>`;
        tmp+= `<td><input class="initiative2" type="number" value="${Math.round(character.data.initiative*100 % 100)}" min="-10" max="89"></td>`;
      }
      tmp+= `<td>${encode(character.data.name)}</td>`;
      count = 0;
      for(counter of refreshData.roundTimeData.counterNames){
        character.data.counters == null && (character.data.counters = {});
        character.data.statusAlias == null && (character.data.statusAlias = {});
        character.data.counters[counter]==undefined && (character.data.counters[counter] = 0);
        if(/^\*/.test(counter)){
          if(character.data.statusAlias && character.data.statusAlias[counter]){
            tmp+= `<td><input class="v${count}" type="checkbox" ${(character.data.counters[counter]!=0?"checked":"")}>${character.data.statusAlias[counter]?character.data.statusAlias[counter]:""}</td>`;
          }else{
            tmp+= `<td><input class="v${count}" type="checkbox" ${(character.data.counters[counter]!=0?"checked":"")}></td>`;
          }
        }else{
          tmp+= `<td><input class="v${count}" type="number" value="${(character.data.counters[counter])}"></td>`;
        }
        count++;
      }
      tmp+= `<td><input value="${encode(character.data.info)}" class="info"></td>`;
      tmp+= "</tr>";
      character.row = $(tmp);
      if($("#initiative table tbody tr").length > 0){
        $("#initiative table tbody tr:eq(0)").before(
          character.row
        );
      }else{
        $("#initiative table tbody").append(
          character.row
        );
      }
    }
    $("#initiative table").colResizable({partialRefresh: true});
  }else{
    ddf.roomState.ini_characters = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative});
    for(key in ddf.roomState.ini_characters){
      var character = ddf.roomState.ini_characters[key];
      if(character != undefined){
        character.row.children("td:eq(0)").text(character.data.initiative==refreshData.roundTimeData.initiative?"●":"");
        $("#initiative table tbody tr:eq(0)").before(
          character.row
        );
      }
    }
  }
  $("#round").text(refreshData.roundTimeData.round);
  $("#now_ini").text(refreshData.roundTimeData.initiative);

  ddf.roomState.roundTimeData = refreshData.roundTimeData;
}

ddf.cmd.sendChatMessage = sendChatMessage;
function sendChatMessage(channel, senderName, state, gameType, message, color, isNeedResult = true){
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
  if(!!pattern.find((r) => {return !!(match = r.exec(toHalf(message)));})){
    //DiceBotMessage
    ddf.userState.name = senderName;
    saveUserState();
    return ddf.sendDiceBotChatMessage(channel, senderName, state, match[2]?match[2]:0, match[3], color, ddf.roomState.gameType, isNeedResult);
  }else{
    //ChatMessage
    /*version = /^Ver\.\d+\.(\d+\.\d+\.?\d*)\(/.exec(ddf.info.version);
    if(compareVersion(version[1], '48.32.1') < 0 && /^###CutInCommand:/.test(message)){
      message = "Wrong Message -> " + message;
    }*/
    if(/^###CutInCommand:/.test(message)){
      message = "Wrong Message -> " + message;
    }
    ddf.userState.name = senderName;
    saveUserState();
    return ddf.sendChatMessage(channel, senderName + "\t"+ state, message, color);
  }
}

ddf.cmd.saveUserState = saveUserState;
function saveUserState(){
  chatPalette = {};
  for(item in ddf.userState.chatPalette){
    chatPalette[item] = {};
    for(item2 in ddf.userState.chatPalette[item]){
      if(ddf.userState.chatPalette[item][item2]){
        chatPalette[item][item2] = ddf.userState.chatPalette[item][item2];
      }
    }
  }
  store.set('userState', {
    name: ddf.userState.name,
    own: ddf.userState.own,
    chatColor: ddf.userState.chatColor,
    showTime: ddf.userState.showTime,
    chatPalette: chatPalette,
    fontSize: ddf.userState.fontSize,
  });
}


ddf.cmd.clearUserState = clearUserState;
function clearUserState(){
  store.clearAll();
  //クリア後はリロードが必要。
}
