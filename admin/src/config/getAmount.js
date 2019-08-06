//输赢报表游戏输赢金额
export function getWinloseAmount(arr, row) {
  let gameList = row.gameTypeMap;
  let count = 0
  for (let key in gameList) {
    if (arr.includes(key)) {
      count += gameList[key].winloseAmount;
    }
  }
  return count
}
//输赢报表游戏交公司
export function getsubmitAmount(arr, row) {
  let gameList = row.gameTypeMap;
  let count = 0
  for (let key in gameList) {
    if (arr.includes(key)) {
      count += gameList[key].submitAmount;
    }
  }
  return count
}

//需要删除的列
export function winloseAmountCount(arr, params) {
  let allCount = 0
  for (let item of arr) {
    for (let key in item.gameTypeMap) {
      if (params.includes(key)) {
        allCount += item.gameTypeMap[key].winloseAmount
      }
    }
  }
  return allCount
}