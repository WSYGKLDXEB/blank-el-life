<template>
  <div class="time">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线监控</el-breadcrumb-item>
      <el-breadcrumb-item>视频监控</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :span="20">
        <el-card class="box-card">
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <tree-list title="设备列表"></tree-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'BlankElEcBimRealisticVideo',

  data() {
    return {}
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.time {
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
/deep/.el-card__header {
  padding: 10px 20px !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: '微软雅黑' !important;
}
</style>
