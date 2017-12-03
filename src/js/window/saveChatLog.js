$("#btn_savechatlog, #btn_savelog2").on("click", (e) => {
  saveChatLog_show();
});

$("#saveChatLog_close, #saveChatLog_close2").on("click", (e) => {
  $("#window_saveChatLog").hide();
});

$("[name=saveChatLog_mode]").on('click', (e) => {
  if($("[name=saveChatLog_mode]:checked").val()=="HTML"){
    $("#saveChatLog_fontSize").prop('disabled', false);
    $("#saveChatLog_lineHeight").prop('disabled', false);
  }else{
    $("#saveChatLog_fontSize").prop('disabled', true);
    $("#saveChatLog_lineHeight").prop('disabled', true);
  }
});

function saveChatLog_show(){
  $("#saveChatLog_channel").empty();

  index = 0;
  for(item of ddf.roomState.chatChannelNames){
    obj = $(`<button>${item}</button>`);
    obj.on('click', ((channel)=>{return (e)=>{saveChatLog(channel);}})(index++));
    $("#saveChatLog_channel").append(obj);
  }

  $("#window_saveChatLog").show().css("zIndex", "151");
  $(".draggable:not(#window_saveChatLog)").css("zIndex", "150");
}

$("#saveChatLog_saveAll").on('click', (e) => {saveChatLog()});

function saveChatLog(channel = 'all'){
  if(channel != 'all'){
    list = chatlog.filter((v)=>{return v[0]==channel});
  }else{
    list = chatlog.filter((v)=>{return v[1]!=null});
  }
  if($("[name=saveChatLog_mode]:checked").val()=="HTML"){
    style = `
#container * {
  font-size: ${$("#saveChatLog_fontSize").val()};
  line-height: ${$("#saveChatLog_lineHeight").val()};
}

#container dt {
  display: inline-block;
}

#container dd {
  margin-left: 0;
  display: inline;
  vertical-align:top;
}

#container dd:after {
  content:'';
  display:block;
} 
`;
    body = list.map((v)=>{return `<dt>[${encode(v[1])}]${ddf.roomState.showChatTime?dateFormat(new Date(v[2]*1000), "HH:MM")+"：":""}</dt><dd style="color:${v[3]};"><b>${encode(v[4])}</b>：${encode(v[5]).replace(/\n/g,"<br>")}</dd>`}).join("\n");
    output = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title></title>
<style>${style}</style>
</head>
<body>
<div id="container">
<dl>
${body}
</dl>
</div>
</body>
</html>
`;
    let buffer = new Buffer(output);
    let filename = `chatlog_${dateFormat(new Date, "yymmdd_HHMMss")}.html`;
    a = $(`<a href="data://text/html;base64,${buffer.toString('base64')}" download="${filename}">.</a>`);
    $(document.body).append(a);
    a[0].click();
    a.remove();
  }else{
    output = list.map((v)=>{return `[${v[1]}]${ddf.roomState.showChatTime?dateFormat(new Date(v[2]*1000), "HH:MM")+"：":""}${v[4]}：${v[5]}`}).join("\n");

    let buffer = new Buffer(output);
    let filename = `chatlog_${dateFormat(new Date, "yymmdd_HHMMss")}.txt`;
    a = $(`<a href="data://text/html;base64,${buffer.toString('base64')}" download="${filename}">.</a>`);
    $(document.body).append(a);
    a[0].click();
    a.remove();
  }
}