
  var version = require('../../../package.json').version;
  $("#btn_version, #btn_version2").on('click', (e) => {
    $("#version_DodontoF").text(ddf.info.version);
    $("#version_ddfjs").text(ddf.version);
    $("#version_ddfcli").text(version);
    $("#window_version").show().css("zIndex", 151);
    $(".draggable:not(#window_version)").css("zIndex", 150);
  });
  
  $("#version_close").on('click', (e) => {
    $("#window_version").hide();    
  });