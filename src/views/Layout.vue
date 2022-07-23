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
            background-color="var(--color-default)"
            text-color="#333"
            active-text-color="var(--color-theme)"
          >
            <el-menu-item :index="item.path" v-for="(item, i) in levelNav(1)" :key="i">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </el-menu-item>
            <el-submenu :index="item.name" v-for="(item, i) in levelNav(2)" :key="i">
              <template slot="title">
                <i :class="[item.icon]"></i>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.path">
                <template slot="title">
                  <i :class="subItem.icon"></i>
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
          icon: 'el-icon-s-home'
        },
        {
          name: 'Building',
          label: '楼宇智控',
          icon: 'iconfont icon-louyu',
          children: [
            {
              path: '/equipment',
              name: 'equipment',
              label: '设备平面',
              icon: 'iconfont icon-shebeiguanli2'
            },
            {
              path: '/video',
              name: 'video',
              label: '视频监控',
              icon: 'iconfont icon-shipinjiankong'
            },
            {
              path: '/electricity',
              name: 'electricity',
              label: '高压配电',
              icon: 'iconfont icon-dian'
            },
            {
              path: '/door',
              name: 'door',
              label: '门禁管理',
              icon: 'iconfont icon-menjin'
            },
            {
              path: '/energy',
              name: 'energy',
              label: '能源管理',
              icon: 'iconfont icon-zu2327'
            },

            {
              path: '/stairs',
              name: 'stairs',
              label: '梯控管理',
              icon: 'iconfont icon-dianti'
            },
            {
              path: '/parking',
              name: 'parking',
              label: '停车管理',
              icon: 'iconfont icon-tingchechang'
            }
          ]
        },
        {
          name: 'alarm',
          label: '报警中心',
          icon: 'iconfont icon-risk-alarm_fill',
          children: [
            {
              path: '/record',
              name: 'record',
              label: '报警记录',
              icon: 'el-icon-s-data'
            },
            {
              path: '/invasion',
              name: 'invasion',
              label: '入侵报警',
              icon: 'iconfont icon-zhujiruqin'
            },
            {
              path: '/fire',
              name: 'fire',
              label: '火灾报警',
              icon: 'iconfont icon-fire-monitoring'
            }
          ]
        },
        {
          label: '系统管理',
          name: 'tools',
          icon: 'el-icon-s-tools',
          children: [
            {
              path: '/user',
              name: 'user',
              label: '用户管理',
              icon: 'el-icon-user-solid'
            },
            {
              path: '/authorit',
              name: 'authorit',
              label: '权限分配',
              icon: 'iconfont icon-xitongquanxian'
            }
          ]
        }
      ],
      ifFold: false
    }
  },
  mounted() {
    console.log(this.levelNav(2))
  },
  computed: {
    // 获取层级菜单项
    levelNav() {
      return (i) => {
        let j
        if (i === 1) {
          j = this.asideData.filter((item) => !item.children)
        } else if (i === 2) {
          j = this.asideData.filter((item) => item.children)
        }
        return j
      }
    }
  },
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
  background-color: var(--theme);
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
  background-color: var(--theme);
}
.el-menu {
  border-right: none;
  height: 100%;
}
/deep/.is-active {
  // border-left: 2px solid var(--color-theme);
  & > div {
    padding-left: 18px !important;
    border-left: 2px solid var(--color-theme);
    i:first-of-type {
      color: var(--color-theme) !important;
    }
    span {
      color: var(--color-theme) !important;
    }
  }
}
// /deep/.el-menu-item .is-active {
//   padding-left: 18px !important;
//   border-left: 2px solid var(--color-theme);
// }
/deep/.is-opened li:hover {
  padding-left: 38px !important;
  border-left: var(--theme) 2px solid !important;
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
    color: var(--color-default);
    opacity: 0.6;
    font-family: '宋体';
  }
}
</style>
