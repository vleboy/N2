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
            if (!key.startsWith('v')) {
                await mongodb.dropCollection(Util.CollectionEnum[key])
                await mongodb.createCollection(Util.CollectionEnum[key])
            }
        }
        // 创建索引
        await createIndex(mongodb)
        // 预置数据
        await mongodb.collection(Util.CollectionEnum._seq).insertMany([
            { seqName: 'billSeq', seqValue: 0 },
            { seqName: 'reviewSeq', seqValue: 0 },
            { seqName: 'messageSeq', seqValue: 0 },
            { seqName: 'profitSeq', seqValue: 0 }
        ])

        await mongodb.collection(Util.CollectionEnum.agent).insertOne({ id: 100000, role: 'admin', userName: 'admin', userPwd: '123456', userNick: '超级管理员', subrole: '超级管理员', status: 1, createAt, createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') })
        await mongodb.collection(Util.CollectionEnum.subrole).insertOne({ id: 1000, roleName: '超级管理员', permissions: ['所有权限', '代理中心', '玩家中心', '代理账单', '玩家账单', '审核中心', '管理中心', '管理员列表', '角色列表'], createAt, createAtStr: moment(createAt).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') })

        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: 'commission', name: '佣金比(百分比)', value: 0.8 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: 'ratio', name: '占成比(百分比)', value: 15 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: 'deposit', name: '存款手续费(百分比)', value: 2 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: 'withdraw', name: '取款手续费(百分比)', value: 1 })

        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '70000', name: 'NA电子平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '10300000', name: 'MG电子平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1080000', name: 'SUN电子平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1160000', name: 'PP电子平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1050000', name: 'AG真人平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1120000', name: 'SUN真人平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1130000', name: 'YSB体育平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1170000', name: 'NA电竞平台费(百分比)', value: 6 })
        await mongodb.collection(Util.CollectionEnum.config).insertOne({ id: '1100000', name: 'VG棋牌平台费(百分比)', value: 6 })

        // 事务测试
        // await testTransaction()

        ctx.body = 'Y'
    } else {
        ctx.body = 'N'
    }
})

async function createIndex(mongodb) {
    await mongodb.collection(Util.CollectionEnum.agent).createIndex({ id: -1 })
    await mongodb.collection(Util.CollectionEnum.player).createIndex({ id: -1 })

    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ id: -1 })
    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ project: 1 })
    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ createAt: 1 })

    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ ownerId: 1, createAt: 1 })
    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ parentId: 1, createAt: 1 })

    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ sourceId: 1 }, { unique: true, sparse: true })
    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ sourceRelKey: 1 }, { sparse: true })
    await mongodb.collection(Util.CollectionEnum.bill).createIndex({ sourceRelKey: 1, project: 1 }, { sparse: true })

    await mongodb.collection(Util.CollectionEnum.review).createIndex({ id: -1 })
    await mongodb.collection(Util.CollectionEnum.profit).createIndex({ id: -1 })
    await mongodb.collection(Util.CollectionEnum.message).createIndex({ id: -1 })
}

// async function testTransaction() {
//     const mongodb = global.mongodb
//     const session = await global.getMongoSession()
//     try {
//         await mongodb.collection(Util.CollectionEnum._seq).findOneAndUpdate(
//             { seqName: 'billSeq' },
//             { $inc: { seqValue: 1 } },
//             { returnOriginal: false, projection: { seqValue: 1, _id: 0 }, session }
//         )
//         await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: 1, sourceId: 1 }, { session })
//         await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: 2 }, { session })
//         await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: 3 }, { session })
//         await mongodb.collection(Util.CollectionEnum.bill).insertOne({ id: 4, sourceId: 1 }, { session })
//         await session.commitTransaction()
//     } catch (error) {
//         console.error('事务回滚')
//         console.error(error.codeName)
//         console.error(error.errmsg) // sourceId_1
//         console.error('错误详情')
//         console.error(error)
//         await session.abortTransaction()
//     } finally {
//         await session.endSession()
//     }
// }

module.exports = router