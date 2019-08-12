const _ = require('lodash')
const moment = require('moment')
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
    _seq: '_seq',
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

//检查类型
function checkType(o) {
    let s = Object.prototype.toString.call(o)
    return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

//获取余额
async function getBalanceById(id, role, lastBalanceId, lastBalance) {
    let mongodb = global.mongodb
    // 查询用户信息
    let userInfo = '', balance = 0
    if (!lastBalanceId) {
        if (role == RoleEnum.agent) {
            userInfo = await mongodb.collection(CollectionEnum.agent).findOne({ id }, { projection: { lastBalanceId: 1, lastBalance: 1, _id: 0 } })
        } else if (role == RoleEnum.player) {
            userInfo = await mongodb.collection(CollectionEnum.player).findOne({ id }, { projection: { lastBalanceId: 1, lastBalance: 1, _id: 0 } })
        } else {
            throw { err: true, msg: '非法角色' }
        }
        lastBalanceId = userInfo.lastBalanceId
        lastBalance = userInfo.lastBalance
    }
    // 根据时间查询流水
    let billArr = await mongodb.collection(CollectionEnum.bill).find({ ownerId: id, id: { $gt: lastBalanceId } }, { projection: { id: 1, amount: 1, _id: 0 } }).sort({ id: 1 }).toArray()
    // 汇总余额
    for (let item of billArr) {
        balance = NP.plus(balance, item.amount)
    }
    balance = NP.plus(balance, lastBalance)
    // 更新用户信息
    if (billArr.length > 0) {
        mongodb.collection(CollectionEnum.agent).update({ id }, { $set: { lastBalanceId: billArr[billArr.length - 1].id, lastBalance: balance } })
    }
    return balance
}

// 获取自增键
async function getSeq(seqName) {
    const res = await global.mongodb.collection(CollectionEnum._seq).findOneAndUpdate(
        { seqName },
        { $inc: { seqValue: 1 } },
        { returnOriginal: false, projection: { seqValue: 1, _id: 0 } }
    )
    return +`${moment().utcOffset(8).format('YYMMDD')}${_.padStart(res.value.seqValue.toString(), 10, '0')}`
}

module.exports = {
    ProjectEnum,
    RoleEnum,
    CollectionEnum,
    ReviewEnum,
    StatusEnum,
    checkType,
    getBalanceById,
    getSeq
}