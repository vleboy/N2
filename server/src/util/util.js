const _ = require('lodash')
const bcrypt = require('bcryptjs')
const NP = require('number-precision')

//加减点枚举
const ProjectEnum = {
    addPoint: '加点',
    reducePoint: '减点'
}
//角色枚举
const RoleEnum = {
    agent: 'agent',
    admin: 'admin',
    player: 'player'
}
//数据库集合枚举
const CollectionEnum = {
    agent: 'agent',
    message: 'message',
    player: 'player',
    review: 'review',
    subrole: 'subrole',
    bill: 'bill'
}
//启用/停用枚举
const StatusEnum = {
    Enable: 1,
    Disable: 0
}
//审核单转态枚举
const ReviewEnum = {
    Process: 0,
    Agree: 1,
    Refuse: 2,
}

//获取一个唯一的ID值
function GetUniqueID() {
    let num = `${Date.now()}${_.random(10, 99)}`
    return +num
}

//检查类型
function CheckType(o) {
    let s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}
//加密
function GetHashPwd(pwd) {
    let salt = bcrypt.genSaltSync(10)
    let hash = bcrypt.hashSync(pwd, salt)
    return hash
}

//获取余额
async function getBalanceById(mongodb, id, role, lastBalanceTime, lastBalance) {
    // 查询用户信息
    let userInfo = '', balance = 0
    if (!lastBalanceTime) {
        if (role == RoleEnum.agent) {
            userInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id }, { 'lastBalanceTime': 1, 'lastBalance': 1, _id: 0 })
        } else if (role == RoleEnum.player) {
            userInfo = await mongodb.collection(CollectionEnum.player).findOne({ id }, { 'lastBalanceTime': 1, 'lastBalance': 1, _id: 0 })
        } else {
            throw { err: true, msg: '非法角色' }
        }
        lastBalanceTime = userInfo.lastBalanceTime
        lastBalance = userInfo.lastBalance
    }
    // 根据时间查询流水
    let billArr = await mongodb.collection(CollectionEnum.bill).find({ ownerId: id, "createAt": { $gt: lastBalanceTime } }, { 'amount': 1, 'createAt': 1, _id: 0 }).sort({ 'createAt': 1 }).toArray()
    // 汇总余额
    for (let item of billArr) {
        balance = NP.plus(balance, item.amount)
    }
    balance = NP.plus(balance, lastBalance)
    // 更新用户信息
    if (role == RoleEnum.agent) {
        mongodb.collection(CollectionEnum.agent).update({ id }, { $set: { lastBalanceTime: billArr[billArr.length - 1].createAt, lastBalance: balance } })
    } else if (role == RoleEnum.player) {
        mongodb.collection(CollectionEnum.player).update({ id }, { $set: { lastBalanceTime: billArr[billArr.length - 1].createAt, lastBalance: balance } })
    }
    return balance
}


module.exports = {
    CheckType,
    GetHashPwd,
    ProjectEnum,
    RoleEnum,
    CollectionEnum,
    ReviewEnum,
    StatusEnum,
    GetUniqueID,
    getBalanceById
}