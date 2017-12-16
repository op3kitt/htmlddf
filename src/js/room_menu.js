$(() => {
  /*プレイルームメニュー*/
  $("#btn_save").on("click", (e) => {
  });
  $("#btn_load").on("click", (e) => {
  });
  $("#btn_saveall").on("click", (e) => {
  });
  $("#btn_loadall").on("click", (e) => {
  });
  /*$("#btn_savechatlog, #btn_saveChatLog2").on("click", (e) => {
  });*/
  $("#btn_startrecord").on("click", (e) => {
  });
  $("#btn_endrecord").on("click", (e) => {
  });
  $("#btn_cancelrecord").on("click", (e) => {
  });
  $("#btn_logout, #btn_logout2").on("click", (e) => {
    ddf.logout().then((r) => {
      ddf.userState.room = -1;
      location.href = "index.html"
    });
  });

  $("#btn_displaychat").on("click", (e) => {
    ddf.roomState.viewStateInfo.isChatVisible = !ddf.roomState.viewStateInfo.isChatVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#window_chat .inner").toggle();
  });
  $("#btn_displaydice").on("click", (e) => {
    ddf.roomState.viewStateInfo.isDiceVisible = !ddf.roomState.viewStateInfo.isDiceVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#diceResult").toggle();
  });
  $("#btn_displayinitiative").on("click", (e) => {
    ddf.roomState.viewStateInfo.isInitiativeListVisible = !ddf.roomState.viewStateInfo.isInitiativeListVisible;
    $(e.currentTarget).toggleClass("checked");
    $("#initiative").toggle();
  });
  $("#btn_displayresource").on("click", (e) => {
    ddf.roomState.viewStateInfo.isResourceWindowVisible = !ddf.roomState.viewStateInfo.isResourceWindowVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#resource").toggle();
    /*TODO*/
  });
  $("#btn_displaychatpalette").on("click", (e) => {
    ddf.roomState.viewStateInfo.isChatPaletteVisible = !ddf.roomState.viewStateInfo.isChatPaletteVisible;
    $(e.currentTarget).toggleClass("checked");
    
    $("#window_chatPalette").toggle();
  });
  $("#btn_displaycounter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCounterRemoconVisible = !ddf.roomState.viewStateInfo.isCounterRemoconVisible;
    $(e.currentTarget).toggleClass("checked");
    
    //$("#remocon").toggle();
    /*TODO*/
  });
  $("#btn_displaycharacter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCutInVisible = !ddf.roomState.viewStateInfo.isCutInVisible;
    $(e.currentTarget).toggleClass("checked");
    $("#characterCutIn").toggle();
  });
  $("#btn_displaycutin").on("click", (e) => {
    ddf.roomState.viewStateInfo.isStandingGraphicVisible = !ddf.roomState.viewStateInfo.isStandingGraphicVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_displaygridnum").on("click", (e) => {
    ddf.roomState.viewStateInfo.isPositionVisible = !ddf.roomState.viewStateInfo.isPositionVisible;
    $(e.currentTarget).toggleClass("checked");
    ddf.cmd.refresh_parseMapData({mapData: ddf.roomState.mapData});
  });
  $("#btn_displaygridline").on("click", (e) => {
    ddf.roomState.viewStateInfo.isGridVisible = !ddf.roomState.viewStateInfo.isGridVisible;
    $(e.currentTarget).toggleClass("checked");
    ddf.cmd.refresh_parseMapData({mapData: ddf.roomState.mapData});
  });
  $("#btn_gridguide").on("click", (e) => {
    ddf.roomState.viewStateInfo.isSnapMovablePiece = !ddf.roomState.viewStateInfo.isSnapMovablePiece;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_adjustcharacter").on("click", (e) => {
    ddf.roomState.viewStateInfo.isAdjustImageSize = !ddf.roomState.viewStateInfo.isAdjustImageSize;
    $(e.currentTarget).toggleClass("checked");
    $("#characterCutIn").toggleClass("adjust");
  });
  $("#btn_chatfont").on("click", (e) => {
  });
  $("#btn_resetwindow").on("click", (e) => {
  });
  $("#btn_resetdisplay").on("click", (e) => {
  });

  /*$("#btn_addCharacter").on("click", (e) => {
  });*/
  $("#btn_ragedd3").on("click", (e) => {
  });
  /*$("#btn_rangedd4").on("click", (e) => {
  });*/
  /*$("#btn_rangelh").on("click", (e) => {
  });*/
  $("#btn_rangemg").on("click", (e) => {
  });
  $("#btn_magictimer").on("click", (e) => {
  });
  $("#btn_createchit").on("click", (e) => {
  });
  /*$("#btn_graveyard, #btn_graveyard2").on("click", (e) => {
  });*/
  $("#btn_waitroom").on("click", (e) => {
  });
  $("#btn_rotate").on("click", (e) => {
    ddf.roomState.viewStateInfo.isRotateMarkerVisible = !ddf.roomState.viewStateInfo.isRotateMarkerVisible;
    $(e.currentTarget).toggleClass("checked");
    
    /*TODO*/
  });

  $("#btn_cardpickup").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCardPickUpVisible = !ddf.roomState.viewStateInfo.isCardPickUpVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_cardlog").on("click", (e) => {
    ddf.roomState.viewStateInfo.isCardHandleLogVisible = !ddf.roomState.viewStateInfo.isCardHandleLogVisible;
    $(e.currentTarget).toggleClass("checked");
  });
  $("#btn_cardchange").on("click", (e) => {
  });
  $("#btn_cardreset").on("click", (e) => {
  });

  /*$("#btn_mapchange").on("click", (e) => {
  });*/
  $("#btn_maptile").on("click", (e) => {
  });
  /*$("#btn_mapmask").on("click", (e) => {
  });*/
  $("#btn_mapmodify").on("click", (e) => {
  });
  $("#btn_mapsave").on("click", (e) => {
    ddf.saveMap().then((r)=>{
      if(r.result == "OK"){
        a = $(`<a href="${ddf.base_url+r.saveFileName.replace("./", '')}" download="">.</a>`);
        $(document.body).append(a);
        a[0].click();
        a[0].remove();
      }
    });
  });
  $("#btn_mapchange").on("click", (e) => {
  });

  /*$("#btn_imageupload").on("click", (e) => {
  });*/
  $("#btn_camera").on("click", (e) => {
  });
  $("#btn_imagetagedit").on("click", (e) => {
  });
  /*$("#btn_imagedelete").on("click", (e) => {
  });*/

  /*$("#btn_version2").on("click", (e) => {
  });*/
  /*$("#btn_manual2").on("click", (e) => {
  });*/
  /*$("#btn_tutorial2").on("click", (e) => {
  });*/
  /*$("#btn_site2").on("click", (e) => {
  });*/


  $("#btn_zoomin").on("click", () => {
    ddf.cmd.setZoom(0.1);
  });
  $("#btn_zoomout").on("click", () => {
    ddf.cmd.setZoom(-0.1);
  });

  $("#btn_screenshot").on("click", generate);
});