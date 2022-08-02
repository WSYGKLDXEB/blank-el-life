<template>
  <div class="layout">
    <el-container>
      <el-header>
        <div class="header">
          <h1>数据监控云平台</h1>
          <div>
            <!-- 主题 -->
            <el-dropdown @command="themeHandle" class="setTheme">
              <i class="iconfont icon-sketchpad-theme-full"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="theme-green"><img src="../assets//image/icon/theme-green.png" />健康绿</el-dropdown-item>
                <el-dropdown-item command="theme-blue"><img src="../assets//image/icon/theme-blue.png" />科技蓝</el-dropdown-item>
                <el-dropdown-item command="theme-black"><img src="../assets//image/icon/theme-black.png" />酷炫黑</el-dropdown-item>
                <el-dropdown-item command="theme-custom"
                  ><el-color-picker
                    @change="activeColor"
                    @active-change="colorChage"
                    style="width: 18px; height: 18px; position: absolute"
                    size="mini"
                    v-model="colorValue"
                    show-alpha
                    :predefine="predefineColors"
                  >
                  </el-color-picker>
                  <span class="inputColor"></span>自定义</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 用户头像 -->
            <el-dropdown @command="handleCommand">
              <img style="width: 34px; height: 34px" src="../assets/image/user-default.png" alt="" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-user-solid" command="a">个人中心</el-dropdown-item>
                <el-dropdown-item icon="el-icon-download" command="b">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
            background-color="var(--bgc-default)"
            text-color="var(--color-secondary)"
            active-text-color="var(--color-theme)"
          >
            <el-menu-item :index="item.path" v-for="(item, i) in levelNav(1)" :key="i + '一'">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
            </el-menu-item>
            <el-submenu :index="item.name" v-for="(item, i) in levelNav(2)" :key="i + '二'">
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
          <i :class="['fold', ifFold ? 'el-icon-arrow-right' : 'el-icon-arrow-left']" id="fold" @click="setFold" style="color: var(--color-default)"></i>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import menuData from '@/assets/js/menuData'
export default {
  name: 'BlankElEcBimRealisticLayout',

  data() {
    return {
      asideData: menuData,
      ifFold: false,
      colorValue: '',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(49, 180, 149, 1)',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    }
  },
  mounted() {
    const s = Math.floor(Math.random() * 10) * 1000
    const h = this.$createElement
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
    // }, 12000)
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
    },
    themeHandle(com) {
      const dom = document.documentElement.style
      if (com === 'theme-green') {
        // 健康绿
        dom.setProperty('--theme', 'rgba(71, 169, 108, .8)')
        dom.setProperty('--color-theme', 'rgba(71, 169, 108, 1)')
        dom.setProperty('--br-theme', 'rgba(255, 255, 255, 0)')
        dom.setProperty('--color-secondary', '#333')
        dom.setProperty('--bgc-default', '#fff')
        dom.setProperty('--bgc-theme', '#eff2f9')
      } else if (com === 'theme-blue') {
        // 科技蓝
        dom.setProperty('--theme', 'rgba(21, 136, 199, .8)')
        dom.setProperty('--color-theme', 'rgba(21, 136, 199, 1)')

        dom.setProperty('--color-secondary', '#333')
        dom.setProperty('--bgc-default', '#fff')
        dom.setProperty('--bgc-theme', '#eff2f9')
      } else if (com === 'theme-black') {
        // 酷炫黑
        dom.setProperty('--theme', 'rgba(36, 39, 48, .8)')
        dom.setProperty('--color-theme', 'rgba(255,255,255, 1)')
        dom.setProperty('--color-secondary', '#787878')
        dom.setProperty('--bgc-default', 'rgba(36, 39, 48, 1)')
        dom.setProperty('--bgc-theme', 'rgba(29, 32, 39, 1)')
      } else if (com === 'theme-custom') {
        // 自定义
        dom.setProperty('--color-secondary', '#333')
        dom.setProperty('--bgc-default', '#fff')
        dom.setProperty('--bgc-theme', '#eff2f9')
      }
    },
    colorChage(color) {
      this.setBGC(color)
    },
    activeColor() {
      this.setBGC(this.colorValue)
    },
    setBGC(color) {
      const dom = document.documentElement.style

      const i = color.lastIndexOf(',')
      // 透明度a
      const j = Number(color.slice(i + 1, color.lastIndexOf(')')))
      // rgb
      const k = color.slice(5, i)
      console.log(Number(j) <= 0.3)
      if (j <= 0.3) {
        dom.setProperty('--theme', 'rgba(' + k + ', .1)')
        dom.setProperty('--color-theme', 'rgba(' + k + ', .3)')
      } else {
        dom.setProperty('--theme', 'rgba(' + k + ',' + (j - 0.2) + ')')
        dom.setProperty('--color-theme', 'rgba(' + k + ',' + j + ')')
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
  overflow: auto !important;
  // 解决隐藏滚动条无法滚动的问题
  &::-webkit-scrollbar {
    display: none;
  }
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
  // cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    height: 100%;
    display: flex;
    align-items: center;
  }
  h1 {
    color: var(--color-default);
    opacity: 0.6;
    font-family: '宋体';
  }
  // 下拉菜单
  .el-dropdown {
    cursor: pointer;
    margin-left: 20px;
  }

  // 主题图标
  .iconfont {
    padding: 0 10px;
    position: relative;
    cursor: pointer;
    display: block;
    // height: 100%;
    font-size: 30px;
    color: rgba(255, 255, 255, 0.4);
    // color: #efefef;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -14px;
      width: 100%;
      height: 4px;
      background-color: var(--color-theme);
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
    }
  }
}
.setTheme {
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
