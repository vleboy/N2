const Router = require('koa-router')
const router = new Router()
const moment = require('moment')
const Util = require('../util/util.js')

/**
 * 系统初始化
 */
router.post('/init', async (ctx, next) => {
    let mongodb = global.mongodb
    let createAt = Date.now()
    if (!await mongodb.collection(Util.CollectionEnum.agent).findOne({ userName: 'admin' })) {
        // 创建集合
        for (let key in Util.CollectionEnum) {
            await mongodb.createCollection(Util.CollectionEnum[key])
        }
        // 创建索引
        await mongodb.collection(Util.CollectionEnum.agent).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.player).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.bill).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.review).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.message).createIndex({ id: -1 })
        // 预置数据
        await mongodb.collection(Util.CollectionEnum._seq).insertMany([{ seqName: 'billSeq', seqValue: 0 }, { seqName: 'reviewSeq', seqValue: 0 }, { seqName: 'messageSeq', seqValue: 0 }])
        await mongodb.collection(Util.CollectionEnum.agent).insertOne({ id: 100000, role: 'admin', userName: 'admin', userPwd: '123456', userNick: '超级管理员', subrole: '超级管理员', status: 1, createAt, createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') })
        await mongodb.collection(Util.CollectionEnum.subrole).insertOne({ id: 1000, roleName: '超级管理员', permissions: ['所有权限', '代理中心', '玩家中心', '代理账单', '玩家账单', '审核中心', '管理中心', '管理员列表', '角色列表'], createAt, createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: 'commission', name: '佣金比', value: 0.008 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: 'deposit', name: '存款手续费', value: 0.02 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: 'withdraw', name: '取款手续费', value: 0.01 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '70000', name: 'NA电子平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '10300000', name: 'MG电子平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1080000', name: 'SUN电子平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1160000', name: 'PP电子平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1050000', name: 'AG真人平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1120000', name: 'SUN真人平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1130000', name: 'YSB体育平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1170000', name: 'NA电竞平台费', value: 0.06 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: '1100000', name: 'VG棋牌平台费', value: 0.06 })

        ctx.body = 'Y'
    } else {
        ctx.body = 'N'
    }
})

module.exports = router