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
    color: #515151;
    /*顶部导航*/
  .van-nav-bar {
    height: 50px;
    line-height: 50px;
    .van-icon {
      color: #515151;
      font-size: 1.2rem; 
    }
    .van-nav-bar__title {
      color: #50505;
      font-size: 1.2rem; 
    }
  }
    .box {
      padding: 0 1rem;
      .list {
        li {
          border-bottom: 1px solid #ededed;
          padding: 1rem 0 ;
          .content {
            display: flex;
            align-items: center;
            justify-content: space-between;
          
            .link {
              width: 14rem;
              overflow: auto;
              word-wrap:break-word;
              font-size: .8rem;
              color: #b6b6b6;
            }
          }
        }
      }
    }
    .van-button--small {
      padding: 0 2rem;
    }
  }

</style>
