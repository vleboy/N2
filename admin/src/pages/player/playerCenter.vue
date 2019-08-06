<template>
  <div class="playerCenter">
    <div>
      <div class="content">
        <div class="fl">
          <Input v-model="playerId" size="small">
            <span slot="prepend">玩家ID</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="playerAccount" size="small">
            <span slot="prepend">玩家账号</span>
          </Input>
        </div>
        <div class="fl">
          <Input v-model="playerAccount" size="small">
            <span slot="prepend">玩家昵称</span>
          </Input>
        </div>
       
        <div class="fl">
          <Button type="primary" @click="search" size="small" class="search">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    </div>
    <div class="playerform">
      <Table :columns="columns" :data="playerList" size="small">
         
      </Table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import dayjs from "dayjs";
import {getplayerList} from '../../service/index'
import { log } from 'util';
export default {
  data() {
    return {
      playerId: '',
      playerAccount: '',
      playerNickname: '',
      playerList: [],
      columns: [
        {
          title: "玩家ID",
          key: "id",
          align: "center",
        },
         {
          title: "玩家账号",
          align: "center",
          key: "playerName",
          
        },
        {
          title: "玩家昵称",
          key: "playernick",
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createAt",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", dayjs(params.row.createAt).format("YYYY-MM-DD"));
          },
        },
        {
          title: "操作",
          key: "action",
          align: "center"
        }
      ]
    };
  },
  computed: {
    
  },
  mounted() {
    this.search()
  },
  methods: {
   search() {
     getplayerList().then(res => {
       this.playerList = res
     })
   },
   reset() {

   }
  }
};
</script>

<style scpoed lang="less">
  .playerCenter {
    .content {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .fl {
        margin-right: 20px;
        >p {
          margin-left: 10px;
        }
        .search {
          margin-right: 5px;
        }
      }
    }
    
  }
</style>
