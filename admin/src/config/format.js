
export const formatMillisecond = function (mss) {
  var days = parseInt(mss / (1000 * 60 * 60 * 24))
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = (mss % (1000 * 60)) / 1000
  return days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
}

export const formatUserName = function (data) {
  const name = data.split('_')
  return `【${name[0]}】${name[1]}`
} // 将用户名格式化为【XXX】XXX格式

export const unFormatUserName = function (name, data) {
  // 第一个参数为所属上级  第二个参数为当前用户名
  const parentName = name.split('_')
  const userName = data.split('】')
  return `${parentName[0]}_${userName[1]}`
} // 将用户名格式化为xxx_xxx格式

export const thousandFormatter = function (num) {
  num = (num-0).toFixed(2);
  let toString = num.toString()
  let numOne = ''
  let numTwo = ''
  let formatterNum = ''
  if(toString.indexOf('.')>-1){
    [numOne,numTwo] = toString.split('.')
  }
  formatterNum = (numOne || num).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return numTwo ? `${formatterNum}.${numTwo}` : `${formatterNum}.00`
} // 重置千位符

