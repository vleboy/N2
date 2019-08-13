<template>
  <div class="auditCenter">
     <div class="content">
        <div class="fl">
          <Input v-model="proposerId" size="small">
            <span slot="prepend">申请人ID</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="proposerName" size="small">
            <span slot="prepend">申请人账号</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="proposerNick" size="small">
            <span slot="prepend">申请人昵称</span>
          </Input>
        </div>

        <div class="fl">
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    <div class="auditform">
      <Table :columns="columns" :data="auditList" size="small">
         <template #createAt="{row}">
          {{createAtConfig(row)}}
        </template>
        <template #status="{row}">
          <Tag type="border" color="primary" v-if="row.status == 0">待审核</Tag>
          <Tag type="border" color="success" v-else-if="row.status == 1">同意</Tag>
          <Tag type="border" color="error" v-else>拒绝</Tag>
        </template>
        <template #operate="{row}">
          <div v-if="row.status == 0">
            <Button size="small" type="info" ghost style="margin-right:5px" @click="operate(row, true)">同意</Button>
            <Button size="small" type="error" ghost @click="operate(row, false)">拒绝</Button>
          </div>
          <div v-else>
            <Button type="success" ghost disabled>已审核</Button>
          </div>
        </template>
      </Table>
    </div>

    <div class="page">
      <Page :current="currentPage" :total="totalPage" :page-size="pageSize" @on-change="changepage"/>
    </div>

    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>  
</template>

<script>
import dayjs from 'dayjs'
import {queryAudit, operateAudit} from '../../service/index'
export default {
  data() {
    return {
      proposerId: '',
      proposerName: '',
      proposerNick: '',
      totalPage: 200,
      currentPage: 1,
      pageSize: 50,
      startKey: null,
      spinShow: false,
      data: [],
      columns: [
        {
          title: '申请人账号',
          key: 'proposerName',
          align: "center"
        },
        {
          title: '申请人ID',
          key: 'proposerId',
          align: "center"
        },
        {
          title: '申请人昵称',
          key: 'proposerNick',
          align: "center"
        },
        {
          title: '申请人角色',
          key: 'role',
          align: "center"
        },
        {
          title: '申请类型',
          key: 'project',
          align: "center"
        },
        {
          title: '申请金额',
          key: 'amount',
          align: "center"
        },
        {
          title: '申请单状态',
          slot: 'status',
          align: "center"
        },
        {
          title: '流水号',
          key: 'billId',
          align: "center"
        },
        {
          title: '创建时间',
          slot: 'createAt',
          align: "center"
        },
        {
          title: '审核人',
          key: 'reviewerName',
          align: "center"
        },
        {
          title: '审核人昵称',
          key: 'reviewerNick',
          align: "center"
        },
        {
          title: '操作',
          slot: 'operate',
          align: "center",
          minWidth: 20
        }
      ],
      auditList: []
    }
  },
  mounted() {
    this.search()   
  },
  methods: {
    createAtConfig(row) {
      return dayjs(row.createAt).format('YY-MM-DD')
    },
    //切换页码
    changepage(val) {
      this.currentPage = val
      if (this.startKey != null && this.currentPage % 4 == 0 && this.currentPage * this.pageSize >= this.data.length) {
        this.getAudit()
      } else {
        this.auditList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
      }
    },
    search() {
      this.initPage()
      this.getAudit()
    },
    reset() {
      this.proposerId = '',
      this.proposerName = '',
      this.proposerNick = '',
      this.search()
    },
    //重置分页
    initPage() {
      this.data = []
      this.startKey = null
      this.currentPage = 1
    },
    getAudit() {
      let params = {
        proposerId: this.proposerId,
        proposerName: this.proposerName,
        proposerNick: this.proposerNick,
        startKey: this.startKey
      }
      this.spinShow = true
      queryAudit(params).then(res => {
        this.data = this.data.concat(res.res)
        this.totalPage = this.data.length
        this.auditList = _.chunk(this.data, this.pageSize)[this.currentPage - 1]
        this.startKey = res.startKey
        this.spinShow = false
      }).catch(err => {
        this.spinShow = false
      })
    },
    operate(row, bool) {
      let text = bool ? "同意" : "拒绝";
      let params = {
        id: row.id,
        status: bool ? 1 : 2
      }
      this.$Modal.confirm({
        title: "审核操作",
        content: `是否${text}`,
        onOk: () => {
          operateAudit(params).then(res => {
            this.$Message.success(`审核成功`);
            this.search()
          }).catch(err => {
            this.$Message.error(`审核失败`);
            this.search()
          })
        }
      });
    },
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
