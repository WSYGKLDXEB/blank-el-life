<template>
  <div class="page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>在线监控</el-breadcrumb-item>
      <el-breadcrumb-item>继电器控制</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :span="20">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button type="primary" size="mini" icon="el-icon-plus">添加继电器</el-button>
            <el-button type="primary" size="mini" icon="el-icon-s-grid">批量添加继电器</el-button>
            <el-button type="primary" size="mini" icon="el-icon-s-operation">批量控制继电器</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete-solid">删除</el-button>

            <el-input size="small" placeholder="请输入内容" v-model="input3" class="input-with-select" style="width: 200px; margin-left: 10px">
              <template slot="append">
                <el-button size="mini" type="primary" icon="el-icon-search"></el-button>
              </template>
            </el-input>
          </div>
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
  name: 'BlankElEcBimRealisticParking',

  data() {
    return {}
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.page {
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
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: '微软雅黑' !important;
}
</style>
