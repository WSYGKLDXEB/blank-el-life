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
          <machine-group :dataList="new Array(13)"></machine-group>
        </el-card>
      </el-col>
      <el-col :span="4">
        <tree-list :treeData="treeData" isFilter @nodeClick="nodeClick"></tree-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MachineGroup from '@/components/MachineGroup.vue'
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
      ]
    }
  },

  mounted() {},

  methods: {
    // 节点点击
    nodeClick(obj, node, com) {
      // console.log(obj, node, com)
      if (!obj.children) {
        console.log(obj)
      }
      // this.$emit('nodeClick', (obj, node, com))
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
  height: 98%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
