
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
