<template>
  <div>
    <div v-if="tabData == '' || tabData == undefined" style="border:1px solid #000;">
      <table class="align-center">
        <tr v-if="isShowHeader">
          <th v-for="(item, index) in tabColumns" :key="index">{{item.title}}</th>
        </tr>
        <tr>暂无数据</tr>
      </table>
    </div>
    <div v-else>
      <table class="align-center">
        <tr v-if="isShowHeader">
          <th v-for="(item, index) in tabColumns" :key="index">{{item.title}}</th>
        </tr>
        <tr v-for="(val ,index1) in tabData" :key="index1" :class="{'stripe': isShowStripe}">
          <td v-for="(item, index) in tabColumns" :key="index">
            {{val[item.key]}}
          </td>
        </tr>
      </table>
    </div>
    <div style="height:10rem;background:red;"></div>
    <div style="height:10vh;background:blue;"></div>
  </div>
</template>

<script>
export default {
  name: 'van-table',
  props: ['columns', 'data', 'showHeader', 'stripe'],  
  computed: {
    tabColumns() {
      return this.columns
    },
    tabData() {
      return this.data
    },
    //是否显示表头,默认显示
    isShowHeader() {
      return this.showHeader == undefined ? true : this.showHeader
    },
    //是否显示斑马纹,默认不显示
    isShowStripe() {
      return this.stripe == undefined ? false : this.showHeader
    }
  }  
}
</script>

<style scoped lang="less">

  table,td {
    border-collapse:separate;/*默认值，边框会被分开*/
    border-collapse:collapse;/*如果可能，边框会合并为一个单一的边框*/
    font-size: .8rem;
  }
  th {
    background: skyblue;
    height: 2rem;
  }
  td {
    height: 2rem;
  }
  
  .stripe {
    &:nth-child(2n-1) {
      background: red;
    }
  }
  
  .align-center {
    text-align: center;
    width: 100%;
  }
</style>
