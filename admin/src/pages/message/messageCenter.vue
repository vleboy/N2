<template>
  <div class="newsCenter">
     <div class="content">
       <Button type="info" size="small" ghost @click="createNews">创建消息</Button>
     </div> 
     <div class="auditform">
      <Table :columns="columns" :data="messageList" size="small">
        <template #operate="{row}">
          <Button size="small" type="error" ghost @click="deleteMessage(row)">删除</Button>
        </template>
      </Table>
    </div>
    <!-- <div class="page">
      <Page :current="currentPage" :total="totalPage" :page-size="pageSize" @on-change="changepage"/>
    </div> -->
    <createMessage></createMessage>
    <!-- <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin> -->
  </div>  
</template>

<script>
import dayjs from 'dayjs'
import {queryMessage, deleteMessage} from '../../service/index'
import createMessage from './createMessage'
export default {
  components: {
    createMessage
  },
  data() {
    return {
      totalPage: 200,
      currentPage: 1,
      pageSize: 50,
      startKey: null,
      spinShow: false,
      data: [],
      columns: [
        {
          title: '消息项目',
          align: 'center',
          key: 'projectStr'
        },
        {
          title: '送达人ID',
          align: 'center',
          key: 'ownerId'
        },
        {
          title: '送达人帐号',
          align: 'center',
          key: 'ownerName'
        },
        {
          title: '送达人昵称',
          align: 'center',
          key: 'ownerNick'
        },
        {
          title: '消息内容',
          align: 'center',
          key: 'msg'
        },
        {
          title: '创建人ID',
          align: 'center',
          key: 'createrId'
        },
        {
          title: '创建人帐号',
          align: 'center',
          key: 'createrName'
        },
        {
          title: '创建人昵称',
          align: 'center',
          key: 'createrNick'
        },
        {
          title: '创建时间',
          align: 'center',
          key: 'createAt',
          render: (h, params) => {
            return h('span', dayjs(params.row.createAt).format('YY-MM-DD HH:mm'))
          }
        },
        {
          title: '操作',
          align: 'center',
          slot: 'operate'
        }
      ],
      messageList: []
    }
  },
   mounted() {
    this.search()   
  },
  methods: {
    //切换页码
    changepage(val) {
      this.currentPage = val
      if (this.startKey != null && this.currentPage % 4 == 0 && this.currentPage * this.pageSize >= this.data.length) {
        this.getAudit()
      } else {
        this.messageList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
      }
    },
    search() {
      this.initPage()
      this.getList()
    },
    reset() {
      this.search()
    },
    //重置分页
    initPage() {
      this.data = []
      this.startKey = null
      this.currentPage = 1
    },
    getList() {
      let params = {
        startKey: this.startKey,
      }
      this.spinShow = true
      queryMessage(params).then(res => {
        this.data = this.data.concat(res.res)
        this.totalPage = this.data.length
        this.messageList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.startKey = res.startKey
        this.spinShow = false
      }).catch(err => {
        this.spinShow = false
      })
    },
    createNews() {
      let params = {
        operate: 'create'
      }
      this.$store.commit('showDrawer', true)
      this.$store.commit('setDrawerInfo', params)
    },
    deleteMessage(row) {
      let params = {
        id: row.id
      }
      this.$Modal.confirm({
        title: "操作",
        content: `是否删除消息`,
        onOk: () => {
          deleteMessage(params).then(res => {
            this.$Message.success(`删除成功`);
            this.search()
          }).catch(err => {
            this.$Message.error(`删除失败`);
            this.search()
          })
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.content {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .fl {
      margin-right: 20px;
      > p {
        margin-left: 10px;
      }
      .search {
        margin-right: 5px;
      }
    }
  }
  .page {
      text-align: right;
      margin-top: 20px;
    }
  /deep/.ivu-table-small th {
      height: 26px;
    }
  /deep/.ivu-table-small td {
    height: 26px;
  }
  /deep/ .ivu-table-cell {
      padding: 0;
    }
  .ivu-table-small th {
    height: 26px;
  }
  .ivu-table-small td {
    height: 26px;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
