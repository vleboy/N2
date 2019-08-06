<template>
  <div ref="scrollCon" class="tags-outer-scroll-con taglist">
    <div ref="scrollBody" class="tags-inner-scroll-body" >
      <!--  :style="{left: tagBodyLeft + 'px'}"-->
      <div>
        <transition-group name="taglist-moving-animation" class="taglist">
          <Tag
            type="dot"
            v-for="(item, index) in arrList"
            ref="tagsPageOpened"
            :key="item.name"
            :name="item.name"
            @on-close="closePage"
            @click.native="linkTo(item)"
            :closable="true"
            :color="item.children?(item.children[0].name===currentPageName?'#000':'default'):(item.name===currentPageName?'#000':'default')"
          >{{ item.title }}</Tag>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tagsPageOpened",
  data() {
    return {
      currentPageName: this.$route.name
    };
  },
  props: {
    pageTagsList: Array,
    beforePush: {
      type: Function,
      default: item => {
        return true;
      }
    }
  },
  computed: {
    arrList() {
      if (this.pageTagsList.length >=7) {
        this.pageTagsList.shift()
      } 
        return this.pageTagsList
      
    },
    tagsList() {
      return this.$store.state.home.pageOpenedList;
    }
  },
  methods: {
    closePage(event, name) {
      let pageOpenedList = this.$store.state.home.pageOpenedList;
      let lastPageObj = pageOpenedList[0];
      if (this.currentPageName === name) {
        let len = pageOpenedList.length;
        for (let i = 1; i < len; i++) {
          if (pageOpenedList[i].name === name) {
            if (i < len - 1) {
              lastPageObj = pageOpenedList[i + 1];
            } else {
              lastPageObj = pageOpenedList[i - 1];
            }
            break;
          }
        }
      } else {
        let tagWidth = event.target.parentNode.offsetWidth;
      }
      this.$store.commit("removeTag", name);
      this.$store.commit("closePage", name);
      pageOpenedList = this.$store.state.home.pageOpenedList;
      if (this.currentPageName === name) {
        this.linkTo(lastPageObj);
      }
    },
    linkTo(item) {
      //('into');

      let routerObj = {};
      routerObj.name = item.name;
      if (item.argu) {
        routerObj.params = item.argu;
      }
      if (item.query) {
        routerObj.query = item.query;
      }
      if (this.beforePush(item)) {
        this.$router.push(routerObj);
      }
    }
    // moveToView(tag) {
    //   if (tag.offsetLeft < -this.tagBodyLeft) {
    //     // 标签在可视区域左侧
    //     this.tagBodyLeft = -tag.offsetLeft + 10;
    //   } else if (
    //     tag.offsetLeft + 10 > -this.tagBodyLeft &&
    //     tag.offsetLeft + tag.offsetWidth <
    //       -this.tagBodyLeft + this.$refs.scrollCon.offsetWidth - 100
    //   ) {
    //     // 标签在可视区域
    //     this.tagBodyLeft = Math.min(
    //       0,
    //       this.$refs.scrollCon.offsetWidth -
    //         100 -
    //         tag.offsetWidth -
    //         tag.offsetLeft -
    //         20
    //     );
    //   } else {
    //     // 标签在可视区域右侧
    //     this.tagBodyLeft = -(
    //       tag.offsetLeft -
    //       (this.$refs.scrollCon.offsetWidth - 100 - tag.offsetWidth) +
    //       20
    //     );
    //   }
    // }
  },
  mounted() {
    // this.refsTag = this.$refs.tagsPageOpened;
    // console.log(this.refsTag);
    // // setTimeout(() => {
    // //     this.refsTag.forEach((item, index) => {
    // //         if (this.$route.name === item.name) {
    // //             let tag = this.refsTag[index].$el;
    // //             // console.log(tag);
    // //             this.moveToView(tag);
    // //         }
    // //     });
    // // }, 1); // 这里不设定时器就会有偏移bug
    
    
  },
  watch: {
    $route(to) {
      this.currentPageName = to.name;
      // this.refsTag = this.$refs.tagsPageOpened;
      // this.$nextTick(() => {
      //   this.refsTag.forEach((item, index) => {
      //     if (to.name === item.name) {
      //       let tag = this.refsTag[index].$el;
      //       this.moveToView(tag);
      //     }
      //   });
      // });
    }
  }
};
</script>
<style lang="less" scoped>

.tags-outer-scroll-con {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .tags-inner-scroll-body {
    // position: absolute;
    padding: 0 10px;
    overflow: visible;
    white-space: nowrap;
    transition: left 0.3s ease;
  }
}
.taglist {
  display:flex;
  align-items: center;
}
.taglist-moving-animation-move {
  transition: transform 0.3s;
}
</style>