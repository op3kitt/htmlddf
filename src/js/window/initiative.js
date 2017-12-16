
$("#initiative_next").on('click', (e) => {
  list = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative}, true);
  if(ddf.roomState.roundTimeData.initiative <= list[0]){
    return ddf.changeRoundTime(ddf.roomState.roundTimeData.round + 1, list[list.length - 1], ddf.roomState.roundTimeData.counterNames);
  }else{
    return ddf.changeRoundTime(ddf.roomState.roundTimeData.round, list[list.findIndex((v)=>{return v>=ddf.roomState.roundTimeData.initiative})-1], ddf.roomState.roundTimeData.counterNames);
  }
});

$("#initiative_prev").on('click', (e) => {
  list = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative}, true);
  if(ddf.roomState.roundTimeData.initiative >= list[list.length - 1]){
    return ddf.changeRoundTime(ddf.roomState.roundTimeData.round - 1, list[0], ddf.roomState.roundTimeData.counterNames);
  }else{
    return ddf.changeRoundTime(ddf.roomState.roundTimeData.round, list.find((v)=>{return v >ddf.roomState.roundTimeData.initiative}), ddf.roomState.roundTimeData.counterNames);
  }
});


$("#initiative_reset").on('click', (e) => {
    list = ddf.util.hashSort(ddf.roomState.ini_characters, (obj) => {return obj.data.initiative}, true);
  if(list.length > 0){
    return ddf.changeRoundTime(1, list[0], ddf.roomState.roundTimeData.counterNames);
  }else{
    return ddf.changeRoundTime(1, 0, ddf.roomState.roundTimeData.counterNames);  
  }
});

$("#initiative_change").on('click', (e) => {
  $("#initiative_edit_value").val(ddf.roomState.roundTimeData.counterNames.join(" "));
  
  $("#window_initiative_edit").show().css("zIndex", 151);
  $(".draggable:not(#window_initiative_edit)").css("zIndex", 150);
});

ddf.cmd.initiative_sort = initiative_sort;
function initiative_sort(force = false){
  ddf.cmd.refresh_parseRoundTimeData({roundTimeData: ddf.roomState.roundTimeData}, force);
}

$(document).on('change', "#initiative table tr input", (e) => {
  imgId = $(e.target).parent().parent().attr("id");
  character = ddf.characters[imgId];
  obj = $(e.target);
  switch(obj.attr("type")){
    case "number":
      !isFinite(num = parseInt($(e.target).val())) && (num = 0);
      obj.val(num);
      switch(obj.attr("class")){
        case "initiative":
          character.data.initiative = character.data.initiative % 1 + num;
          break;
        case "initiative2":
          character.data.initiative = (character.data.initiative | 0) + num / 100
          break;
        default:
          key = ddf.roomState.roundTimeData.counterNames[parseInt(/^v(\d+)$/.exec(obj.attr("class"))[1])];
          character.data.counters[key] = num;
      }
      break;
    case "checkbox":
      key = ddf.roomState.roundTimeData.counterNames[parseInt(/^v(\d+)$/.exec(obj.attr("class"))[1])];
      character.data.counters[key] = obj.prop("checked");
      break;
    default:
      character.data.info = $(e.target).val();
  }
  initiative_sort();
  ddf.changeCharacter(character.data);
});

$("#initiative_edit_close, #initiative_edit_close2").on('click', (e) => {
  $("#window_initiative_edit").hide();
});

$("#initiative_edit_send").on('click', (e) => {
  value = $("#initiative_edit_value").val();
  value.replace("–", "*");
  ddf.changeRoundTime(ddf.roomState.roundTimeData.round, ddf.roomState.roundTimeData.initiative, value.split(" ")).then((r) => {
    $("#window_initiative_edit").hide();
  });
});