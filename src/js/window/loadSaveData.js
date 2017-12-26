$("#btn_load").on('click', (e) => {
  $("#window_loadSaveData [name=\"datatype\"][value=\"all\"]").prop("checked", true);
  $("#window_loadSaveData [type=\"checkbox\"]").prop("checked", false).prop("disabled", true);

  $("#window_loadSaveData").show().css("zIndex", "151");
  $(".draggable:not(#window_loadSaveData)").css("zIndex", "150");
  $("#window_loadSaveData_import").hide();
});

$("#window_loadSaveData [name=\"datatype\"]").on('click', (e) => {
  if($("#window_loadSaveData [name=\"datatype\"]:checked").val() == "all"){
    $("#window_loadSaveData [type=\"checkbox\"]").prop("disabled", true);
  }else{
    $("#window_loadSaveData [type=\"checkbox\"]").prop("disabled", false);
  }
});

$("#loadSaveData_close, #loadSaveData_close2").on('click', (e) => {
  $("#window_loadSaveData").hide();
});

$("#loadSaveData_import_close").on('click', (e) => {
  $("#window_loadSaveData_import").hide();
});

$("#loadSaveData_send").on('click', (e) => {
  $("#window_loadSaveData").hide();

  if($("#window_loadSaveData [name=\"datatype\"]:checked").val() == "all"){
    $("#loadSaveData_import_target").val("all");
  }else{
    $("#loadSaveData_import_target").val($("#window_loadSaveData [type=\"checkbox\"]:checked").map((k,v)=>{return v.value;}).toArray().join());
  }

  $("#window_loadSaveData_import").show().css("zIndex", "151");
  $(".draggable:not(#window_loadSaveData_import)").css("zIndex", "150");
});

$("#btn_loadall").on('click', (e) => {
  $("#loadSaveData_import_target").val("allData");

  $("#window_loadSaveData_import").show().css("zIndex", "151");
  $(".draggable:not(#window_loadSaveData_import)").css("zIndex", "150");
  $("#window_loadSaveData").hide();
});

$("#window_loadSaveData_import :file").on('change', (e) => {
  arr = [];
  for(item of $("#window_loadSaveData_import :file")[0].files){
    arr.push(item);
  }
  loadSaveData_import_uploadfiles(arr);
});


let $form = $("#loadSaveData_import_droparea");

(($form) => {
  $("#loadSaveData_import_droparea ~ .overwrap").on('dragenter', () => {
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

    if($("#loadSaveData_import_target").val() == "allData"){
      if(/application\/x-gzip/.test(file.type)){
        loadSaveData_import_uploadfiles(droppedFiles);
      }
    }else if($("#loadSaveData_import_target").val() == "mapData"){
      if(/\.msv$/.test(file.name)){
        loadSaveData_import_uploadfiles(droppedFiles);
      }
    }else{
      if(/\.sav$/.test(file.name)){
        loadSaveData_import_uploadfiles(droppedFiles);
      }
    }
  });
})($form);

function loadSaveData_import_uploadfiles(droppedFiles){
  for(file of droppedFiles){
    new Promise((success, error)=>{
      let fr = new FileReader();

      fr.onload = success;

      fr.readAsArrayBuffer(file);
    }).then((r) => {
      console.log(r);
      console.log(file);
      let data = new Uint8Array(r.target.result);
      if($("#loadSaveData_import_target").val() == "allData"){
        ddf.loadAllSaveData(file.name, data).then((r) => {
          $("#window_loadSaveData_import").hide();
        });
      }else if($("#loadSaveData_import_target").val() == "all"){
        ddf.load(file.name, data).then((r) => {
          $("#window_loadSaveData_import").hide();
        });
      }else if($("#loadSaveData_import_target").val() == "mapData"){
        ddf.load(file.name, data, ["map", "mapMask", "mapMarker"]).then((r) => {
          $("#window_loadSaveData_import").hide();
        });
      }else{
        ddf.load(file.name, data, $("#loadSaveData_import_target").val().split(",")).then((r) => {
          $("#window_loadSaveData_import").hide();
        });
      }
    });
  }
  $("#window_loadSaveData_import").hide();
}

$("#window_loadSaveData_import .overwrap a").on('click', (e) => {
  if($("#loadSaveData_import_target").val() == "allData"){
    $("#window_loadSaveData_import .overwrap :file").attr("accept", ".tar.gz");
  }else if($("#loadSaveData_import_target").val() == "mapData"){
    $("#window_loadSaveData_import .overwrap :file").attr("accept", ".msv");
  }else{
    $("#window_loadSaveData_import .overwrap :file").attr("accept", ".sav");
  }
  $("#window_loadSaveData_import .overwrap :file").click();
  return false;
});


$("#btn_mapload").on('click', (e) => {
  $("#loadSaveData_import_target").val("mapData");

  $("#window_loadSaveData_import").show().css("zIndex", "151");
  $(".draggable:not(#window_loadSaveData_import)").css("zIndex", "150");
  $("#window_loadSaveData").hide();
});