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
          <!-- 数据列表显示按钮 -->
          <i :class="['showList', isShowList ? 'el-icon-top-right' : 'el-icon-bottom-left']" @click="isShowList = !isShowList"></i>
          <machine-group v-show="isShowList" :dataList="new Array(13)"></machine-group>
          <iframe v-show="!isShowList" ref="scenes" src="https://www.thingjs.com/pp/889475f1d1cd354ffe1fc1f6" frameborder="0"></iframe>
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
      <div class="operateBox">
        <machine-group :iframe="iframeRef" isAniBut horizontal :dataList="new Array(1)"></machine-group>
      </div>
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
        },
        {
          label: '5f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        },
        {
          label: '6f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        },
        {
          label: '7f',
          children: [{ label: '空调机-1' }, { label: '空调机-2' }, { label: '空调机-3' }, { label: '空调机-4' }, { label: '空调机-5' }, { label: '空调机-6' }, { label: '空调机-7' }]
        }
      ],
      // 拓扑图的显示与否
      isTopology: false,
      modelInfo: null,
      // 控制动画按钮的显示与否
      isAniBut: false,
      // 控制控制项列表的显示与否
      isShowList: false,
      // 用于存放模型展示的iframe节点信息=>解决行内直接转递因节点尚未加载完成而造成的节点信息为空的问题
      iframeRef: null
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
      // console.log(e)
      if (e.data.cmd) {
        this.isAniBut = e.data.res.ani.length > 0
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
      if (!obj.children) {
        console.log(obj)
      }
    },
    // 拓扑图弹出框打开动画结束后的回调
    dialogOpened() {
      const time = setTimeout(() => {
        sendSonInfo(this.$refs.model, this.modelInfo)
        clearTimeout(time)
        this.iframeRef = this.$refs.model
      }, 1000)
      // this.$refs.model.on('load', (e) => {
      //   console.log(e)
      // })
    },
    // 拓扑图弹出框关闭
    dialogClose() {
      const info = {
        cmd: 'level'
      }
      sendSonInfo(this.$refs.scenes, info)
    }
  },
  components: {
    MachineGroup
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
  position: relative;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
/deep/.el-dialog {
  background-color: var(--bgc-theme);
}
// 数据列表显示按钮
.showList {
  cursor: pointer;
  position: absolute;
  right: 1px;
  top: 1px;
  color: var(--theme);
  font-weight: 700;
  border-width: 0 0 1px 1px;
  border-color: var(--color-theme);
  border-style: solid;
  transition: all 0.3s;
}
</style>
