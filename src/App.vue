<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  name: 'app',
  created() {
    ipcRenderer.on('identity', (e, obj) => {
      console.log('身份', e, obj)
      for (const key in obj) {
        sessionStorage.setItem(key, obj[key])
      }
    })
  },
  mounted() {
    document.title = '中国人寿'
  }
}
</script>

<style lang="less">
#app {
  position: relative;
  // background-color: var(--bgc-theme);
  // background: url('../src/assets/image/bg1.png');
  background-size: 100% 100%;
  // 隐藏滚动条
  overflow: auto !important;
  // overflow-y: auto;
  // overflow-x: hidden;
  // 解决隐藏滚动条无法滚动的问题
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
