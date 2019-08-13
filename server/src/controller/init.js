const Router = require('koa-router')
const router = new Router()
const Util = require('../util/util.js')

/**
 * 系统初始化
 */
router.post('/init', async (ctx, next) => {
    let mongodb = global.mongodb
    if (!await mongodb.collection(Util.CollectionEnum.agent).findOne({ userName: 'admin' })) {
        // 创建集合
        for (let key in Util.CollectionEnum) {
            await mongodb.createCollection(Util.CollectionEnum[key])
        }
        // 创建索引
        await mongodb.collection(Util.CollectionEnum.bill).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.review).createIndex({ id: -1 })
        await mongodb.collection(Util.CollectionEnum.message).createIndex({ id: -1 })
        // 预置数据
        await mongodb.collection(Util.CollectionEnum._seq).insertMany([{ seqName: 'billSeq', seqValue: 0 }, { seqName: 'reviewSeq', seqValue: 0 }, { seqName: 'messageSeq', seqValue: 0 }])
        await mongodb.collection(Util.CollectionEnum.agent).insertOne({ id: 100000, role: 'admin', userName: 'admin', userPwd: '123456', userNick: '超级管理员', subrole: '超级管理员', status: 1, createAt: Date.now() })
        await mongodb.collection(Util.CollectionEnum.subrole).insertOne({ id: 1000, roleName: '超级管理员', permissions: ['所有权限', '代理中心', '玩家中心', '代理账单', '玩家账单', '审核中心', '管理中心', '管理员列表', '角色列表'], createAt: Date.now() })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ code: 'commission', name: '佣金比', value: 0.008 })
        ctx.body = 'Y'
    } else {
        ctx.body = 'N'
    }
})

module.exports = router