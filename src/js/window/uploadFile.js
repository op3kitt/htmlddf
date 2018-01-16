$("#btn_easyUpload").on('click', (e) => {

  $("#window_uploadFile").show().css("zIndex", "151");
  $(".draggable:not(#window_uploadFile)").css("zIndex", "150");
});

$("#uploadFile_close, #uploadFile_close2").on('click', (e) => {
  $("#window_uploadFile").hide();
});

$("#window_uploadFile :file").on('change', (e) => {
  arr = [];
  for(item of $("#window_uploadFile :file")[0].files){
    arr.push(item);
  }
  uploadFile_uploadfiles(arr);
});

let $form = $("#uploadFile_droparea");

(($form) => {
  $("#uploadFile_droparea ~ .overwrap").on('dragenter', () => {
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

    uploadFile_uploadfiles(droppedFiles);
  });
})($form);

function uploadFile_uploadfiles(droppedFiles){
  for(file of droppedFiles){
    new Promise((success, error)=>{
      let fr = new FileReader();

      fr.onload = success;

      fr.readAsArrayBuffer(file);
    }).then(((file) => {return (r) => {
      ddf.uploadFile(file.name, ddf.base_url, new Uint8Array(r.target.result)).then((r) => {
        if(r.resultText == "OK"){
          ddf.sendChatMessage(0, "どどんとふ\t", `${ddf.userState.name}がファイルをアップロードしました \n  ファイル名：${r.uploadFileInfo.fileName}\n  URL:${r.uploadFileInfo.fileUploadUrl}`, "00aa00", true);
        }else{
          console.log(r.resultText);
        }
      });
    };})(file));
  }
  $("#window_uploadFile").hide();
}

$("#window_uploadFile .overwrap a").on('click', (e) => {
  $("#window_uploadFile .overwrap :file").click();
  return false;
});

