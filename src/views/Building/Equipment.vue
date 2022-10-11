<template>
  <div class="equipment">
    <!-- 设备列表显示按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isShowList = !isShowList">{{ isShowList ? '场景操控' : '操控面板' }}</el-button>
    <el-row :gutter="16">
      <el-col :span="20">
        <el-card class="box-card">
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
        <machine-group :iframe="iframeRef" :isAniBut="isAniBut" horizontal :dataList="new Array(1)"></machine-group>
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
          value: 'floor1',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' },
            { label: '空调机-3', value: 'tem3' },
            { label: '空调机-4', value: 'tem4' },
            { label: '空调机-5', value: 'tem5' },
            { label: '空调机-6', value: 'tem6' },
            { label: '空调机-7', value: 'tem7' }
          ]
        },
        {
          label: '2f',
          value: 'floor2',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' },
            { label: '空调机-3', value: 'tem3' },
            { label: '空调机-4', value: 'tem4' },
            { label: '空调机-5', value: 'tem5' },
            { label: '空调机-6', value: 'tem6' },
            { label: '空调机-7', value: 'tem7' },
            { label: '空调机-8', value: 'tem8' },
            { label: '空调机-9', value: 'tem9' },
            { label: '空调机-10', value: 'tem10' }
          ]
        },
        {
          label: '3f',
          value: 'floor3',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' },
            { label: '空调机-3', value: 'tem3' },
            { label: '空调机-4', value: 'tem4' },
            { label: '空调机-5', value: 'tem5' },
            { label: '空调机-6', value: 'tem6' },
            { label: '空调机-7', value: 'tem7' },
            { label: '空调机-8', value: 'tem8' },
            { label: '空调机-9', value: 'tem9' },
            { label: '空调机-10', value: 'tem10' },
            { label: '空调机-11', value: 'tem11' }
          ]
        },
        {
          label: '4f',
          value: 'floor4',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' }
          ]
        },
        {
          label: '5f',
          value: 'floor6',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' }
          ]
        },
        {
          label: '6f',
          value: 'floor6',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' }
          ]
        },
        {
          label: '7f',
          value: 'floor7',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' }
          ]
        },
        {
          label: '8f',
          value: 'floor8',
          children: [
            { label: '空调机-1', value: 'tem1' },
            { label: '空调机-2', value: 'tem2' }
          ]
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
        console.log(this.isAniBut)
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
      console.log(obj, node, com)
      // if (!obj.children) {
      const object = {
        cmd: obj.value
      }

      sendSonInfo(this.$refs.scenes, object)
      // }
    },
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
  // position: relative;
  width: 100%;
  height: 100%;
}
.el-row {
  height: 100%;
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
</style>
