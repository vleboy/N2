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
            <!-- <slot>{{val[item.key]}}</slot> -->
            <slot :name="item.key" :todo="val">
              <!-- 后备内容 -->
              {{ val[item.key] }}
            </slot>
          </td>
        </tr>
      </table>
    </div>
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
      return this.stripe == undefined ? false : this.stripe
    }
  }  
}
</script>

<style scoped lang="less">

  table,td {
    border-collapse:separate;/*默认值，边框会被分开*/
    border-collapse:collapse;/*如果可能，边框会合并为一个单一的边框*/
    font-size: 12.8px;
  }
  th {
    color: #737373;
    background: #F8FBFF;
    height: 32px;
  }
  td {
    height: 32px;
  }
  
  .stripe {
    &:nth-child(2n-1) {
      background: #FAF9F9;
    }
  }
  
  .align-center {
    text-align: center;
    width: 100%;
  }
</style>
