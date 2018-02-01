$("#btn_diceBotTable").on('click', (e) => {
  ddf.getBotTableInfos().then((r) => {
    ddf.tableInfos = r.tableInfos;
    $("#window_diceBotTable table tbody").empty();
    for(item of r.tableInfos){
      tr  = `<tr>`;
      tr += `<td><button class="edit" command="${item.command}" gameType="${item.gameType}">変更</button></td>`;
      tr += `<td><button class="copy" command="${item.command}" gameType="${item.gameType}">コピー</button></td>`;
      tr += `<td>${encode(ddf.util.getDiceBotName(item.gameType==""?"DiceBot":item.gameType))}</td>`;
      tr += `<td>${encode(item.command)}</td>`;
      tr += `<td>${encode(item.title)}</td>`;
      tr += `<td><button class="delete"  command="${item.command}" gameType="${item.gameType}">削除</button></td>`;
      tr += `</tr>`;
      $("#window_diceBotTable table tbody").append($(tr));
    }
  });

  $("#window_diceBotTable").show().css("zIndex", 151);
  $(".draggable:not(#window_diceBotTable)").css("zIndex", 150);
});

$(document).on('click', '#window_diceBotTable button.edit', (e) => {
  diceBotTable_show($(e.target).attr("gameType"), $(e.target).attr("command"), false);
});
$(document).on('click', '#window_diceBotTable button.copy', (e) => {
  diceBotTable_show($(e.target).attr("gameType"), $(e.target).attr("command"), true);
});
$(document).on('click', '#window_diceBotTable button.delete', (e) => {
  if(confirm($(e.target).attr("command")+"を削除します、よろしいですか？")){
    ddf.removeBotTable($(e.target).attr("command"));
    $("#window_diceBotTable table tbody").empty();
    ddf.getBotTableInfos().then((r) => {
      ddf.tableInfos = r.tableInfos;
      $("#window_diceBotTable table tbody").empty();
      for(item of r.tableInfos){
        tr  = `<tr>`;
        tr += `<td><button class="edit" command="${item.command}" gameType="${item.gameType}">変更</button></td>`;
        tr += `<td><button class="copy" command="${item.command}" gameType="${item.gameType}">コピー</button></td>`;
        tr += `<td>${encode(ddf.util.getDiceBotName(item.gameType==""?"DiceBot":item.gameType))}</td>`;
        tr += `<td>${encode(item.command)}</td>`;
        tr += `<td>${encode(item.title)}</td>`;
        tr += `<td><button class="delete"  command="${item.command}" gameType="${item.gameType}">削除</button></td>`;
        tr += `</tr>`;
        $("#window_diceBotTable table tbody").append($(tr));
      }
    });
  }
});

$("#diceBotTable_create").on('click', (e) => {
  diceBotTable_show("", "", true);
});

$("#diceBotTable_close, #diceBotTable_close2").on('click', (e) => {
  $("#window_diceBotTable").hide();
});

function diceBotTable_show(gameType, command, copy){

  tableInfo = ddf.tableInfos.find(((gameType, command) => {
    return (v) => {return v.gameType == gameType && v.command == command};
  })(gameType, command));

  if(!tableInfo){
    tableInfo = {
      command: "",
      dice: "",
      fileName: "",
      gameType: "",
      table: [],
      title: ""
    };
  }

  $("#diceBotTable_edit_originalGameType").val(tableInfo.gameType);
  $("#diceBotTable_edit_originalCommand").val(tableInfo.command);
  $("#diceBotTable_edit_copy").val(copy);
  $("#diceBotTable_edit_command").val(tableInfo.command);
  $("#diceBotTable_edit_dice").val(tableInfo.dice);
  $("#diceBotTable_edit_titletext").val(tableInfo.title);
  $("#diceBotTable_edit_gameType").val(tableInfo.gameType==""?"DiceBot":tableInfo.gameType);
  $("#diceBotTable_edit_table").val(tableInfo.table.map((v)=>{return v[0]+":"+v[1]}).join("\n"));

  $("#window_diceBotTable_edit").show().css("zIndex", 151);
  $(".draggable:not(#window_diceBotTable_edit)").css("zIndex", 150);
}

$("#diceBotTable_edit_close, #diceBotTable_edit_close2").on('click', (e) => {
  $("#window_diceBotTable_edit").hide();
});

$("#diceBotTable_edit_sample").on('click', (e) => {
  $("#diceBotTable_edit_dice").val("2d6");
  $("#diceBotTable_edit_titletext").val("表サンプル");
  $("#diceBotTable_edit_table").val(
`2:「コマンド名」をチャットに入力することで、\\n表のロールができるようになります。
3:この例では「SAMPLE」と入力すれば\\n実行できるようになります。
4:表のフォーマットは\\nまさにここに書いてある通り、
5:（数値）:（メッセージ）
6:になります。
7:「コマンド」をチャットで発言すると\\n「ダイス」に記載したダイスを元にランダム選択されます。
8:ダイス目に合致する値が表に無い場合は空文字になります。
9:悩むより一度追加してみるのが早いでしょう。
10:他の人も使える便利な表が出来たら\\n皆で共有してあげてくださいね！
11:そろそろ\\n書く事無くなってきましたね…
12:以上です。
`);
});

$("#diceBotTable_edit_send").on('click', (e) => {
  gameType = $("#diceBotTable_edit_gameType").val();
  gameType == "DiceBot" && (gameType = "");
  if($("#diceBotTable_edit_copy").val() == "false"){
    ddf.changeBotTable(
      $("#diceBotTable_edit_originalGameType").val(),
      $("#diceBotTable_edit_originalCommand").val(),
      gameType,
      $("#diceBotTable_edit_titletext").val(),
      $("#diceBotTable_edit_command").val(),
      $("#diceBotTable_edit_dice").val(),
      $("#diceBotTable_edit_table").val()
    ).then((r) => {
      if(r.resultText == "OK"){
        ddf.sendChatMessage(0, "dummy\t", "###CutInCommand:getDiceBotInfos###{}", "00aa00", true);
        $("#window_diceBotTable_edit").hide();
        $("#window_diceBotTable table tbody").empty();
        ddf.getBotTableInfos().then((r) => {
          ddf.tableInfos = r.tableInfos;
          $("#window_diceBotTable table tbody").empty();
          for(item of r.tableInfos){
            tr  = `<tr>`;
            tr += `<td><button class="edit" command="${item.command}" gameType="${item.gameType}">変更</button></td>`;
            tr += `<td><button class="copy" command="${item.command}" gameType="${item.gameType}">コピー</button></td>`;
            tr += `<td>${encode(ddf.util.getDiceBotName(item.gameType==""?"DiceBot":item.gameType))}</td>`;
            tr += `<td>${encode(item.command)}</td>`;
            tr += `<td>${encode(item.title)}</td>`;
            tr += `<td><button class="delete"  command="${item.command}" gameType="${item.gameType}">削除</button></td>`;
            tr += `</tr>`;
            $("#window_diceBotTable table tbody").append($(tr));
          }
        });
      }else{
        alert(r.resultText);
      }
    });
  }else{
    ddf.addBotTable(
      gameType,
      $("#diceBotTable_edit_titletext").val(),
      $("#diceBotTable_edit_command").val(),
      $("#diceBotTable_edit_dice").val(),
      $("#diceBotTable_edit_table").val()
    ).then((r) => {
      if(r.resultText == "OK"){
        ddf.sendChatMessage(0, "dummy\t", "###CutInCommand:getDiceBotInfos###{}", "00aa00", true);
        $("#window_diceBotTable_edit").hide();
        $("#window_diceBotTable table tbody").empty();
        ddf.getBotTableInfos().then((r) => {
          ddf.tableInfos = r.tableInfos;
          $("#window_diceBotTable table tbody").empty();
          for(item of r.tableInfos){
            tr  = `<tr>`;
            tr += `<td><button class="edit" command="${item.command}" gameType="${item.gameType}">変更</button></td>`;
            tr += `<td><button class="copy" command="${item.command}" gameType="${item.gameType}">コピー</button></td>`;
            tr += `<td>${encode(ddf.util.getDiceBotName(item.gameType==""?"DiceBot":item.gameType))}</td>`;
            tr += `<td>${encode(item.command)}</td>`;
            tr += `<td>${encode(item.title)}</td>`;
            tr += `<td><button class="delete"  command="${item.command}" gameType="${item.gameType}">削除</button></td>`;
            tr += `</tr>`;
            $("#window_diceBotTable table tbody").append($(tr));
          }
        });
      }else{
        alert(r.resultText);
      }
    });
  }
});