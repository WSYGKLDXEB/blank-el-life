<template>
  <div class="equ">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="16">
      <el-col :span="20">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-button type="primary" size="mini" icon="el-icon-rank">批量移动设备</el-button>
            <div>
              <el-input v-model="search" size="small" placeholder="请输入内容" style="width: 200px; margin: 0 10px"></el-input>
              <el-button type="primary" size="mini" icon="el-icon-menu" title="展开"></el-button>
            </div>
          </div>
          <el-table highlight-current-row :data="tableData" border style="width: 100%">
            <el-table-column type="selection" ></el-table-column>
            <el-table-column prop="date" label="日期" width="180"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="160"> </el-table-column>
            <el-table-column prop="address" label="地址" width="300"> </el-table-column>
            <el-table-column label="操作">
              <template>
                <el-button size="mini" type="primary" icon="el-icon-share">权限分配</el-button>
                <el-button size="mini" type="success">成功按钮</el-button>
                <el-button size="mini" type="danger">危险按钮</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPageValue"
              :page-sizes="[100, 200, 300, 400]"
              :page-size="100"
              layout="total, sizes, prev, pager, next, jumper"
              :total="400"
            >
            </el-pagination>
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
  name: 'BlankElEcBimRealisticAuthorit',

  data() {
    return {
      search: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      currentPageValue: 1
    }
  },

  mounted() {},

  methods: {}
}
</script>

<style lang="less" scoped>
.equ {
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
  position: relative;
  width: 100%;
  height: 100%;
}
/deep/.el-card__header {
  padding: 10px 20px !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: '微软雅黑' !important;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer {
  // margin: 0 14px;
  padding: 10px 5px 0;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 94%;
  border-top: 1px solid #ebeef5;
  box-sizing: border-box;
  // background-color: pink;
}
</style>
