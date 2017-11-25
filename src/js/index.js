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
  // e.state is equal to the data-attribute of the last image we clicked
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
      row += "<td>"+room.index+"</td>"
      row += "<td>"+room.playRoomName+"</td>"
      row += "<td>"+ddf.util.getDiceBotName(room.gameType)+"</td>"
      row += "<td>"+room.loginUsers.length+"</td>"
      row += "<td>"+(room.passwordLockState?"有り":"--")+"</td>"
      row += "<td>"+(room.canVisit?"可":"--")+"</td>"
      row += "<td>"+(room.lastUpdateTime?room.lastUpdateTime:"")+"</td>"
      row += "<td></td></tr>"
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
            var obj = $("<p>"+tab+"/<span class=\"tab_label\">0</span></p>");
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
              $("#dicebot").append($("<option value='"+item.gameType+"'>"+item.name+"</option>"));
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
      body = "No."+room.index+"："+room.playRoomName+"\nを削除しますか？";
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
  $("#tab p:eq("+index+"), #log div:eq("+index+")").addClass('active');
  ddf.roomState.unread[index] = 0;
  $("#tab p:eq("+index+") span").text(0);
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
      if($("#dicebot").children("[value="+refreshData.gameType+"]").length==1){
        $("#dicebot").val($(refreshData.gameType));
      }else{
        $("#dicebot").append($("<option value='"+refreshData.gameType+"'>"+refreshData.gameType+"</option>"));
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
          var obj = $("<p>"+tab+"/<span class=\"tab_label\">0</span></p>");
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
          $(`#tab:eq(${refreshData.chatChannelNames - 1})`).html(`${refreshData.chatChannelNames[i]}/<span class="tab_label">${ddf.roomState.unread[i]}</span>`);
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
          eval("param = " + matches[2]);
          $("#log div:eq("+item[1].channel+")").append($("<p style='color: #"+item[1].color+"'>"+item[1].senderName+":"+param.chatMessage.replace(/\n/, "<br>")+"</p>"));
          $("#log div:eq("+item[1].channel+")").hasClass("active") || ddf.roomState.unread[item[1].channel]++;
          lastRandResult = [param.chatMessage, param.randResults];
          continue;
          break;
      }
    }else if(matches = /^###CutInMovie###(.+)$/.exec(item[1].message)){
      eval("param = " + matches[1]);
      $("#log div:eq("+item[1].channel+")").append($("<p style='color: #"+item[1].color+"'>"+item[1].senderName+":【"+param.message+"】</p>"));
      $("#log div:eq("+item[1].channel+")").hasClass("active") || ddf.roomState.unread[item[1].channel]++;
    }else{
      $("#log div:eq("+item[1].channel+")").append($("<p style='color: #"+item[1].color+"'>"+item[1].senderName+":"+item[1].message+"</p>"));
      $("#log div:eq("+item[1].channel+")").hasClass("active") || ddf.roomState.unread[item[1].channel]++;
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
    $("#diceResult").append($(`<div class="total">${total}</div>`));
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
        obj.html(`<span>${title}</span><img src="${ddf.base_url}image/memo2.png"><div>${body}</div>`);
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
      obj.append($(`<div class="name">${character.name}</div>`));
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
      obj = $("<div class='characterFrame draggableObj' id='"+character.imgId+"'></div>");
      obj.append($("<div class='inner'></div><div class='dogtag'>"+character.dogTag+"</div><div class='name'>"+character.name+"</div>"));
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
      obj = $(`<div class="draggableObj" id="${character.imgId}"><span>${title}</span><img src="${ddf.base_url}image/memo2.png"><div>${body}</div></div>`);
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
      $("#initiative table thead tr").append($("<th><p>"+counter.replace(/^\*/, "")+"</p></th>"));
    }
    $("#initiative table thead tr").append($("<th><p>その他</p></th>"));
    
    $("#initiative table tbody").empty();
    ddf.roomState.ini_characters = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative});
    for(key in ddf.roomState.ini_characters){
      var character = ddf.roomState.ini_characters[key];
      var tmp = "<tr>";
      tmp+= "<td>"+(character.data.initiative==refreshData.roundTimeData.initiative?"●":"")+"</td>";
      tmp+= "<td>"+(character.data.initiative|0)+"</td>";
      tmp+= "<td>"+(character.data.initiative*100 % 100)+"</td>";
      tmp+= "<td>"+(character.data.name)+"</td>";
      for(counter of refreshData.roundTimeData.counterNames){
        character.data.counters == null && (character.data.counters = {});
        character.data.statusAlias == null && (character.data.statusAlias = {});
        character.data.counters[counter]==undefined && (character.data.counters[counter] = 0);
        if(/^\*/.test(counter)){
          tmp+= "<td>"+(character.data.counters[counter]!=0?"●":"")+"</td>";
        }else{
          tmp+= "<td>"+(character.data.counters[counter])+"</td>";        
        }
      }
      tmp+= "<td>"+character.data.info+"</td>";
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