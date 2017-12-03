
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
  $("#window_memo").show().css("zIndex", 151);
  $(".draggable:not(#window_memo)").css("zIndex", 150);
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