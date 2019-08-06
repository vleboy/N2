export const getDefaultTime = function (current) {
  let nowDate = new Date()
  let nowDay = nowDate.getDay() || 7
  let startTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1 - nowDay)
  let endTime = new Date().getTime()

  startTime = startTime.setHours(0, 0, 0, 0)
  endTime = current ? endTime : endTime - 180000


  startTime - endTime > 0 ? startTime = new Date().setHours(0, 0, 0, 0) : ''
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  return [startTime, endTime]
}
export const formatMoney = function (number, places, symbol) {
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "￥";
  let negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") + (places ? "." + Math.abs(number - i).toFixed(places).slice(2) : "");
}
