<template>
  <div class="auditCenter">
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
      columns: [
        {
          title: '审核ID',
          key: 'id',
          align: "center",
          minWidth: 30
        },
        {
          title: '申请人ID',
          key: 'proposerId',
          align: "center"
        },
        {
          title: '申请人账号',
          key: 'proposerName',
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
      return dayjs(row.createAt).format('YYYY-MM-DD')
    },
    search() {
      this.getAudit()
    },
    reset() {
      this.getAudit()
    },
    getAudit() {
      queryAudit().then(res => {
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
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
