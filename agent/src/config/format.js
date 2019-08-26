export const formatMoney = (num) => {
  let result = parseFloat(num)
  if (isNaN(result)) {
    return '0.00'
  }
  result = Math.round(num * 100) / 100

  let s_x = result.toString()
  let pos_decimal = s_x.indexOf('.')

  if (pos_decimal < 0) {
    pos_decimal = s_x.length
    s_x += '.'
  }

  while (s_x.length <= pos_decimal + 2) {
    s_x += '0'
  }

  return s_x
}