<template>
  <div class="log">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-date-picker
          style="margin-right: 10px"
          v-model="datePickerValue"
          size="small"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        >
        </el-date-picker>
        <el-button type="primary" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BlankElEcBimRealisticLog',

  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      datePickerValue: ''
    }
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.log {
  width: 100%;
  height: 100%;
}
.el-card {
  position: relative;
  width: 100%;
  height: 96%;
}
/deep/.el-card__header {
  padding: 10px 20px !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: '微软雅黑' !important;
}
.clearfix {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
