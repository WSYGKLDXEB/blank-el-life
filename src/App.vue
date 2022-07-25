<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    document.title = '中国人寿'
  }
}
</script>

<style lang="less">
#app {
  min-width: 1200px;
  background-color: var(--bgc-theme);
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
>
