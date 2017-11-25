(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var upload_uploadlist = [];

$form = $("#upload_droparea");

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

  for(file of droppedFiles){
    new Promise((success, error)=>{
      let fr = new FileReader();

      fr.onload = success;

      if(/image\/(gif|png|jpeg)/.test(file.type)){
        fr.readAsArrayBuffer(file);
      }
    }).then((r)=>{
      let data = new Uint8Array(r.target.result);

      if(upload_uploadlist.length == 0){
        $("#upload_droparea").empty();
      }
      upload_uploadlist.push([file, data]);
      url = `data:${file.type};base64,${btoa(Array.from(data, e => String.fromCharCode(e)).join(""))}`;
      $("#upload_droparea").append(`<div><img src="${url}"></div>`);
    });
  }
});

$("#upload_send").on('click', (e)=>{
  $("#upload_result").text("");
  for(file of upload_uploadlist){
    ddf.uploadImageData(
      file[0].name,
      file[1],
      $("#upload_password").val(),
      $("#upload_tag").val().split(/[ 　]/),
      $("#upload_private")?null:ddf.userstate.roomNumber
    ).then((r)=>{
      $("#upload_result").text($("#upload_result").text() + file[0].name + ":" + r.resultText + "　　");
    });
  }
  upload_uploadlist = [];
});

$("#upload_tagbox").on('change', (e)=>{
  $("#upload_tag").val($("#upload_tagbox").val()+"　");
});

$("#upload_close, #upload_close2").on('click', (e)=>{
  $("#window_upload").hide();
  $("#upload_droparea").empty();
});
},{}]},{},[1]);
