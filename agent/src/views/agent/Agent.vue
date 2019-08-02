<template>
  <div class="agent">
    <van-nav-bar
      title="代理链接"
  />
    <div class="box">
      <ul class="list">
        <li>
          <div>H5版代理链接</div>
          <div class="content">
            <div class="link">https://www.bilibili.com/</div>
            <van-button type="info" size="small" round >复制</van-button>
          </div>
        </li>
        <li>
          <div>PC代理链接</div>
          <div class="content">
            <div class="link">https://www.bilibili.com/</div>
            <van-button type="info" size="small" round >复制</van-button>
          </div>
        </li>
        <li>
          <div>全站APP代理链接</div>
          <div class="content">
            <div class="link">https://www.bilibili.com/</div>
            <van-button type="info" size="small" round >复制</van-button>
          </div>
        </li>
        <li>
          <div>体育APP版代理链接</div>
          <div class="content">
            <div class="link">https://www.bilibili.com/</div>
            <van-button type="info" size="small" round >复制</van-button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>


<style lang="less" scoped>
  .agent {
    font-size: 16px;
    color: #515151;
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #515151;
      font-size: 19.2px; 
    }
    .van-nav-bar__title {
      color: #50505;
      font-size: 19.2px; 
    }
  }
    .box {
      padding: 0 16px;
      .list {
        li {
          border-bottom: 1px solid #ededed;
          padding: 16px 0 ;
          .content {
            display: flex;
            align-items: center;
            justify-content: space-between;
          
            .link {
              width: 224px;
              overflow: auto;
              word-wrap:break-word;
              font-size: 12.8px;
              color: #b6b6b6;
            }
          }
        }
      }
    }
    .van-button--small {
      padding: 0 32px;
    }
  }

</style>
