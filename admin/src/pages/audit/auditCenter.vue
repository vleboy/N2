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
         <template #createAt="row">
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
          align: "center"
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
    search() {
      this.getAudit()
    },
    reset() {
      this.proposerId = '',
      this.proposerName = '',
      this.proposerNick = '',
      this.getAudit()
    },
    getAudit() {
      let params = {
        proposerId: this.proposerId,
        proposerName: this.proposerName,
        proposerNick: this.proposerNick,
      }
      queryAudit(params).then(res => {
        this.auditList = res
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
  /deep/.ivu-table-small th {
      height: 26px;
    }
    /deep/.ivu-table-small td {
      height: 26px;
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
