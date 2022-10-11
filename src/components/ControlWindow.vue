<template>
  <!-- 窗口操作按钮 -->
  <div class="controlWindow between notDrag">
    <i class="el-icon-minus" @click="toMin"></i>
    <i :class="isFullScreen ? 'el-icon-bottom-left' : 'el-icon-top-right'" @click="toExpand"></i>
    <i class="el-icon-close" @click="toClose"></i>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
// const ipcRenderer = require('electron')
export default {
  name: 'BlankElLifeControlWindow',

  data() {
    return {
      isFullScreen: false
    }
  },

  mounted() {
    ipcRenderer.on('isFullScreen', (e, bel) => {
      this.isFullScreen = !bel
    })
  },

  methods: {
    toMin() {
      ipcRenderer.send('min-app')
    },
    toExpand() {
      ipcRenderer.send('fullScreen-app')
    },
    toClose() {
      ipcRenderer.send('close-app')
    }
  }
}
</script>

<style lang="less" scoped>
.controlWindow {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 16px;
  z-index: 99;
  width: 100px;
  height: 30px;
  line-height: 30px;
  cursor: pointer;
  // background-color: #fff;
  border-radius: 0 0 0 4px;
  // padding: 0 10px;
  -webkit-app-region: no-drag !important;
  i {
    -webkit-app-region: no-drag !important;
    width: 30px;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    text-align: center;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    &:last-of-type:hover {
      background-color: rgba(251, 115, 115) !important;
    }
  }
}
</style>
