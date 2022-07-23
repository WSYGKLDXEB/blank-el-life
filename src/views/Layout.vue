<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="header">
          <h1>数据监控云平台</h1>

          <el-dropdown @command="handleCommand">
            <img style="width: 34px; height: 34px" src="../assets/image/user-default.png" alt="" />
            <!-- <el-image style="width: 80px; height: 80px" src="../assets/image/user-default.png" fit="cover"></el-image> -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-user-solid" command="a">个人中心</el-dropdown-item>
              <el-dropdown-item icon="el-icon-download" command="b">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="ifFold ? '64px' : '160px'">
          <el-menu
            router
            unique-opened
            :collapse-transition="false"
            :default-active="$route.path"
            :collapse="ifFold"
            class="el-menu-vertical-demo"
            background-color="#fff"
            text-color="#333"
            active-text-color="#62d2a2"
          >
            <el-menu-item :index="asideData[0].path">
              <i :class="'el-icon-' + asideData[0].icon"></i>
              <span>{{ asideData[0].label }}</span>
            </el-menu-item>
            <el-submenu :index="item.name" v-show="i !== 0" v-for="(item, i) in asideData" :key="i">
              <template slot="title">
                <i :class="'el-icon-' + item.icon"></i>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.path">
                <template slot="title">
                  <i class="el-icon-arrow-right"></i>
                  <span>{{ subItem.label }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
          <!-- 菜单折叠按钮 -->
          <i :class="['fold', ifFold ? 'el-icon-arrow-right' : 'el-icon-arrow-left']" id="fold" @click="setFold"></i>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'BlankElEcBimRealisticLayout',

  data() {
    return {
      asideData: [
        {
          path: '/home',
          name: 'home',
          label: '首页',
          icon: 's-home'
        },
        {
          path: '/monitor',
          name: 'monitor',
          label: '在线监控',
          icon: 'video-camera',
          children: [
            {
              path: '/time',
              name: 'time',
              label: '实时数据',
              icon: 'help'
            },
            {
              path: '/video',
              name: 'video',
              label: '视频监控',
              icon: 'help'
            },
            {
              path: '/page',
              name: 'page',
              label: '继电器控制',
              icon: 'help'
            }
          ]
        },
        {
          path: '/data',
          name: 'data',
          label: '数据中心',
          icon: 's-data',
          children: [
            {
              path: '/history',
              name: 'history',
              label: '历史数据',
              icon: 's-order'
            },
            {
              path: '/error',
              name: 'error',
              label: '报警数据',
              icon: 'error'
            },
            {
              path: '/notice',
              name: 'notice',
              label: '通知记录',
              icon: 'warning'
            }
          ]
        },
        {
          label: '系统管理',
          name: 'tools',
          icon: 's-tools',
          children: [
            {
              path: '/user',
              name: 'user',
              label: '账号管理',
              icon: 'help'
            },
            {
              path: '/equipment',
              name: 'equipment',
              label: '设备管理',
              icon: 'help'
            },
            {
              path: '/log',
              name: 'log',
              label: '日志',
              icon: 'help'
            }
          ]
        }
      ],
      ifFold: false
    }
  },

  mounted() {},

  methods: {
    setFold() {
      this.ifFold = !this.ifFold
      // this.$refs.fold.classList.add('running')
      document.querySelector('#fold').classList.add('running')
      // console.log(666)
    },
    quit() {
      console.log(1315413)
      this.$router.push('/login')
      window.sessionStorage.removeItem('token')
    },
    handleCommand(com) {
      if (com === 'b') {
        this.quit()
      }
    }
  }
}
</script>

<style lang="less" scoped>
// @import './assets/style/blank-px.css';
// 隐藏
@keyframes hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
// 运行
.running {
  animation-play-state: running;
}
// 暂停
.paused {
  animation-play-state: paused;
}

// 折叠按钮
.fold {
  cursor: pointer;
  position: absolute;
  right: -14px;
  bottom: 30px;
  // left: 160px;
  z-index: 1000;
  width: 14px;
  height: 50px;
  line-height: 50px;
  background-color: #9df3c4;
  border-radius: 0 6px 6px 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.15);
  transition: all 0.1s;
  animation: hide 3s linear;
  animation-play-state: paused;
}
.layout {
  position: relative;
  height: 100vh;
  width: 100%;
}
.el-container {
  height: 100%;
}
.el-aside {
  position: relative;
  background-color: #dfdfdf;
  overflow: visible !important;
}
.el-submenu {
  overflow: hidden;
}
.el-submenu li {
  padding: 0 0 0 45px !important;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #9df3c4;
}
.el-menu {
  border-right: none;
  height: 100%;
}
/deep/.is-active {
  // border-left: 2px solid #62d2a2;
  & > div {
    padding-left: 18px !important;
    border-left: 2px solid #62d2a2;
    i:first-of-type {
      color: #62d2a2 !important;
    }
    span {
      color: #62d2a2 !important;
    }
  }
}
// /deep/.el-menu-item .is-active {
//   padding-left: 18px !important;
//   border-left: 2px solid #62d2a2;
// }
/deep/.is-opened li:hover {
  padding-left: 38px !important;
  border-left: #9df3c4 2px solid !important;
  transition: all 0.3s;
}

.header {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h1 {
    color: #fff;
    opacity: 0.6;
    font-family: '宋体';
  }
}
</style>
