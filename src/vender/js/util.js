var encode = require('htmlspecialchars');
var dateFormat = require('dateformat');
var compareVersion = require('compare-versions');

function toHalf(strVal){
  // 半角変換
  var halfVal = strVal.replace(/[！-～]/g,
    function( tmpStr ) {
      // 文字コードをシフト
      return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
    }
  );
 
  // 文字コードシフトで対応できない文字の変換
  return halfVal.replace(/”/g, "\"")
    .replace(/’/g, "'")
    .replace(/‘/g, "`")
    .replace(/￥/g, "\\")
    .replace(/　/g, " ")
    .replace(/〜/g, "~");
}