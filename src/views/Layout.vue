<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="header between">
          <div class="back between">
            <div class="return between" @click="$router.back()">
              <i class="el-icon-back"></i>
              <span>返回</span>
            </div>
            <div class="title">{{ $route.meta.name }}</div>
          </div>
          <div class="butGroup between">
            <!-- 用户 -->
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link"> 管理员<i class="el-icon-arrow-down el-icon--right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="user">用户管理</el-dropdown-item>
                <el-dropdown-item command="authorit">权限管理</el-dropdown-item>
                <el-dropdown-item command="quit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'BlankElEcBimRealisticLayout',

  data() {
    return {}
  },
  mounted() {
    // const s = Math.floor(Math.random() * 10) * 1000
    // const h = this.$createElement
    // const time = setInterval(() => {
    //   this.$notify.error({
    //     title: '安全警告',
    //     // 是否将 message 属性作为 HTML 片段处理
    //     dangerouslyUseHTMLString: true,
    //     // message: h('a', { style: 'color: teal' }, '服务主机遭受不明网络攻击！')
    //     message: '<p>服务主机遭受不明网络攻击！</p><a href="#/alarm">点击跳转到报警管理页</a>',
    //     // 偏移
    //     offset: 60
    //   })
    // }, 1000)
    console.log(this.$router, this.$route)
  },
  computed: {},
  methods: {
    handleCommand(command) {
      console.log(command)
      if (command === 'user') {
        this.$router.push('/user')
      } else if (command === 'authorit') {
        this.$router.push('/authorit')
      } else {
        window.sessionStorage.removeItem('token')
        this.$router.push('/login')
        // 退出全屏
        // 兼容各个浏览器退出全屏方法
        ;(document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen).call(document)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.layout {
  position: relative;
  height: 100%;
  width: 100%;
}
.el-container {
  height: 100%;
}
.el-main {
  // height: calc(100vh - 0.5rem);
  padding: 14px !important;
  overflow: visible !important;
}
.el-header {
  padding: 0 14px !important;
  height: 0.5rem !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: var(--theme);
  // background-color: var(--bgc-default);
  font-size: 0.24rem !important;
  color: #dfdfdf !important;
  /deep/.el-page-header__content {
    color: #dfdfdf !important;
  }
  // 返回
  .back {
    justify-content: flex-start;
    width: 40%;
    .return {
      cursor: pointer;
      margin-right: 0.2rem;
    }
    span {
      margin-left: 0.05rem;
      font-size: 0.18rem;
    }
    .title {
      text-align: right;
      width: 1rem;
      font-size: 0.18rem;
      border-left: 1px solid #dfdfdf;
    }
  }
  // 按钮组
  .butGroup {
    justify-content: flex-end;
    width: 40%;
    height: 100%;
  }
  /deep/.el-dropdown {
    cursor: pointer;
    color: #dfdfdf !important;
  }
}

.header {
  padding: 0 0.1rem;
  width: 100%;
  height: 100%;
  // cursor: pointer;
  background-color: var(--bgc-default);
  font-size: 0.24rem !important;
  border-radius: 0 0 4px 4px !important;
}
// 下拉
/deep/.el-dropdown-menu__item {
  position: relative;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  img {
    margin-right: 10px;
  }
  .inputColor {
    width: 18px;
    height: 18px;
    background: var(--theme);
    border-radius: 3px;
    margin-right: 10px;
  }
  // 颜色input
  /deep/.el-color-picker {
    position: absolute !important;
  }
}
/deep/.el-color-picker__trigger {
  opacity: 0;
  height: 36px;
  margin-top: -8px;
  width: 80px !important;
}
</style>
