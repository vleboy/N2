<template>
  <div class="auditCenter">
     <div class="content">
      <div class="fl">
          <Input v-model="proposerName" size="small">
            <span slot="prepend">申请人账号</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="proposerId" size="small">
            <span slot="prepend">申请人ID</span>
          </Input>
        </div>
        <div class="fl">
          <Select v-model="role" style="width:100px" size="small">
            <Option v-for="item in roleList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </div> 
        <div class="fl">
          <Select v-model="project" style="width:100px" size="small">
              <Option v-for="item in projectList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
        </div> 
        <div class="fl">
          <Select v-model="status" style="width:100px" size="small">
              <Option v-for="item in statusList" :value="item.label" :key="item.value">{{ item.value }}</Option>
          </Select>
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
            <Button type="success" ghost disabled size="small">已审核</Button>
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
      totalPage: 200,
      currentPage: 1,
      pageSize: 50,
      startKey: null,
      spinShow: false,
      role: 'all',
      project: 'all',
      status: 'all',
      roleList: [
        {
          value: '全部角色',
          label: 'all'
        },
        {
          value: '玩家',
          label: 'player'
        },
        {
          value: '代理',
          label: 'agent'
        }
      ],
      projectList: [
        {
          value: '全部类型',
          label: 'all'
        },
        {
          value: '存款',
          label: 'deposit'
        },
        {
          value: '取款',
          label: 'withdraw'
        }
      ],
      statusList: [
        {
          value: '全部状态',
          label: 'all'
        },
        {
          value: '未处理',
          label: '0'
        },
        {
          value: '同意',
          label: '1'
        },
        {
          value: '拒绝',
          label: '2'
        }
      ],
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
          key: 'projectStr',
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
    /* changeRole(value) {
      console.log(value);
    },
    changeProject(value) {
      console.log(value);
    },
    changeStatus(value) {
      console.log(value);
    }, */
    search() {
      this.initPage()
      this.getAudit()
    },
    reset() {
      this.proposerId = '',
      this.proposerName = '',
      this.role = 'all',
      this.project = 'all',
      this.status = 'all'
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
        startKey: this.startKey,
        role: this.role,
        project: this.project,
        status: this.status
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
