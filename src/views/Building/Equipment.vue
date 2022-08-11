<template>
  <div class="equipment">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇智控</el-breadcrumb-item>
      <el-breadcrumb-item>设备平面</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :span="20">
        <el-card class="box-card">
          <!-- <machine-group :dataList="new Array(13)"></machine-group> -->
          <iframe ref="scenes" src="https://www.thingjs.com/pp/889475f1d1cd354ffe1fc1f6" frameborder="0"></iframe>
        </el-card>
      </el-col>
      <el-col :span="4">
        <tree-list :treeData="treeData" isFilter @nodeClick="nodeClick"></tree-list>
      </el-col>
    </el-row>

    <!-- 拓扑图弹出框 -->
    <el-dialog title="提示" @close="dialogClose" @opened="dialogOpened" :visible.sync="isTopology" width="50%">
      <el-row>
        <el-col :span="5">
          <iframe style="height: 30vh" src="https://www.thingjs.com/pp/02bd193a855ff246a808114b" ref="model" frameborder="0" scrolling="no"></iframe>
        </el-col>
        <el-col :span="19">
          <iframe ref="topology" style="height: 30vh" src="https://www.thingjs.com/pp/de7ef0dd152cca61697e76f3" frameBorder="0"></iframe>
        </el-col>
      </el-row>
      <el-button @click="modelOpen">开关</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { receiveSonInfo, sendSonInfo } from '@/assets/js/blank'
import MachineGroup from '@/components/MachineGroup.vue'
import { nextTick } from 'vue'
export default {
  name: 'BlankElLifeEquipment',

  data() {
    return {
      treeData: [
        {
          label: '1f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        },
        {
          label: '2f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        },
        {
          label: '3f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        },
        {
          label: '4f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        }
      ],
      // 拓扑图的显示与否
      isTopology: false,
      modelInfo: null
    }
  },

  mounted() {
    // 接收子页面发来的消息
    // this.info = receiveSonInfo()
    // console.log(this.info)
    // if (this.info.data.cmd) {
    //   console.log(this.info)
    // }
    // 接收子页面发来的消息
    window.addEventListener('message', (e) => {
      if (e.data.cmd) {
        this.isTopology = true
        this.modelInfo = e.data
      }
    })
  },
  watch: {
    modelInfo: {
      handler(New, Old) {
        // // console.log(666)
        // if (this.info.data.cmd) {
        //   this.isTopology = true
        // }
      },
      deep: false,
      immediate: false
    }
  },
  methods: {
    // 节点点击
    nodeClick(obj, node, com) {
      // console.log(obj, node, com)
      if (!obj.children) {
        console.log(obj)
      }
      // this.$emit('nodeClick', (obj, node, com))
    },
    // 拓扑图弹出框打开动画结束后的回调
    dialogOpened() {
      console.log('开了！！！！')
      console.log(this.modelInfo)
      // this.$nextTick(() => {

      // })
      const time = setTimeout(() => {
        sendSonInfo(this.$refs.model, this.modelInfo)
        clearTimeout(time)
      }, 1000)
    },
    // 拓扑图弹出框关闭
    dialogClose() {
      const info = {
        cmd: 'level'
      }
      sendSonInfo(this.$refs.scenes, info)
    },
    // 模型开关
    modelOpen() {
      const info = {
        cmd: 'Open'
      }
      sendSonInfo(this.$refs.model, info)
    }
  },
  components: {
    // MachineGroup
  }
}
</script>

<style lang="less" scoped>
.equipment {
  width: 100%;
  height: 100%;
}
.el-row {
  height: 96%;
  .el-col {
    height: 100%;
  }
}
.el-card {
  width: 100%;
  height: 100%;
}
/deep/.el-card__body {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
