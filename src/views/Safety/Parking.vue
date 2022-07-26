<template>
  <div class="parking">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全中心</el-breadcrumb-item>
      <el-breadcrumb-item>停车管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <!-- 左侧列表 -->
      <el-col :span="19">
        <el-card class="leftBox">
          <div slot="header" class="clearfix">
            <div style="width: auto">
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
              <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
            </div>
            <el-button v-if="tableData.length !== 0" type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
          </div>
          <!-- 表格 -->
          <template v-if="tableData.length !== 0">
            <el-table max-height="655" :data="tableData" border style="width: 100%">
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column prop="date" label="日期" width="180"> </el-table-column>
              <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
              <el-table-column prop="address" label="地址"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="del(scope)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!-- 分页 -->
          <el-pagination
            v-if="tableData.length !== 0"
            background
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          >
          </el-pagination>
          <!-- 空状态 -->
          <el-empty v-else description="选择条件查询！"></el-empty>
        </el-card>
      </el-col>
      <!-- 右侧图表 -->
      <el-col :span="5" class="chartBox">
        <el-card>
          <div class="box">
            <div v-for="item in iconArr" :key="item.number">
              <img :src="item.url" alt="" srcset="" />
              <span>{{ item.title }}</span>
              <p class="text">{{ item.number }}</p>
            </div>
          </div>
        </el-card>
        <el-card>
          <div ref="clas" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="dealWith" style="height: 100%"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑弹出框 -->
    <el-dialog center :title="isEditState ? '编辑' : '添加'" :visible.sync="isDialog" :show-close="false" width="40%" @close="close">
      <el-form ref="formRef" label-position="right" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="日期" prop="date">
          <!-- <el-input v-model="formData.date"></el-input> -->
          <el-date-picker value-format="yyyy-MM-dd" format="yyyy年MM月dd日" clearable v-model="formData.date" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            () => {
              isEditState ? edit() : add()
            }
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BlankParking',

  data() {
    return {
      // 右侧图标数组
      iconArr: [
        {
          title: '车位总数',
          number: '1,240',
          url: require('@/assets/image/icon/info-img-1.png')
        },
        {
          title: '当前已停',
          number: '888',
          url: require('@/assets/image/icon/info-img-2.png')
        },
        {
          title: '今日活跃数',
          number: '2,540',
          url: require('@/assets/image/icon/info-img-3.png')
        },
        {
          title: '今日活跃率',
          number: '88%',
          url: require('@/assets/image/icon/info-img-4.png')
        }
      ],
      // 时间日期配置项
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
      // 表单项规则
      formRules: {
        date: [{ required: true, message: '请输入日期', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        address: [{ type: 'string', required: true, message: '请输入地址', trigger: 'blur' }]
      },
      // 时间日期
      datePickerValue: '',
      // table表格数据
      tableData: [],
      // 分页
      currentPage: 1,
      // 弹出框弹出与否
      isDialog: false,
      formData: {
        date: '',
        name: '',
        address: ''
      },
      // 当前选中项ID,
      tableId: 0,
      // 是否为编辑状态
      isEditState: true
    }
  },

  mounted() {},

  methods: {
    // 查询
    search() {
      if (!this.datePickerValue) {
        return this.$message.warning('请先选择查询条件！')
      }
      this.tableData = [
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
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
      ]
    },
    // 显示对话框
    showEditDialog(item) {
      this.isEditState = true
      this.tableId = item.$index
      this.isDialog = true
      this.formData = item.row
      this.$refs.formRef.resetFields()
    },
    showAddDialog() {
      this.isEditState = false
      this.formData = {
        date: '',
        name: '',
        address: ''
      }
      this.isDialog = true
      // this.$refs.formRef.resetFields()
    },
    add() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.tableData.push(this.formData)
        this.isDialog = false
        this.$message.success('添加成功！')
      })
    },
    // 编辑
    edit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.tableData[this.tableId] = this.formData
        this.isDialog = false
        this.$message.success('编辑成功！')
      })
    },
    // 删除
    async del(item) {
      const isDel = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // console.log(isDel)
      // console.log(item)
      if (isDel === 'confirm') {
        this.tableData.splice(item.$index, 1)
        return this.$message.success('删除成功！')
      }
    },
    close() {
      // this.$refs.formRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.parking {
  width: 100%;
  height: 100%;
}
.leftBox {
  /deep/.el-card__body {
    height: 93%;
  }
}
// 右侧图表
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  /deep/.el-card__body {
    height: 100%;
  }
  .el-card {
    height: 30%;
    &:nth-of-type(1) {
      height: 36%;
    }
    & > div {
      width: 100%;
      height: 30vh;
    }
  }
}
// 右侧上
.text {
  background-image: -webkit-linear-gradient(270deg, #fff, var(--theme));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.box {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  div {
    position: relative;
    //   flex: 50%;
    width: 50%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    & > ::before {
      position: absolute;
      content: '';
    }
  }
  div:nth-of-type(-n + 2) {
    padding-bottom: 0.14rem;
  }
  div:nth-of-type(n + 2) {
    padding-top: 0.14rem;
  }
  div:nth-of-type(1) ::before {
    bottom: 0;
    right: -1px;
    height: 80%;
    width: 1px;
    background: linear-gradient(to top, var(--theme), transparent);
  }
  div:nth-of-type(2) ::before {
    bottom: 0;
    left: 0;
    height: 1px;
    width: 80%;
    background: linear-gradient(to right, var(--theme), transparent);
  }
  div:nth-of-type(3) ::before {
    top: -1px;
    right: 0;
    height: 1px;
    width: 80%;
    background: linear-gradient(to left, var(--theme), transparent);
  }
  div:nth-of-type(4) ::before {
    top: 0;
    left: 0;
    height: 80%;
    width: 1px;
    background: linear-gradient(to bottom, var(--theme), transparent);
  }
  img {
    // opacity: var(--opacity);
    opacity: 0.9;
  }
  span {
    margin: 8px 0;
    color: var(--theme);
  }
  p {
    margin: 4px 0;
    font-size: 30px;
    font-weight: 600;
    font-family: 'electronicFont';
    color: var(--theme);
  }
}
// 分页定位
.el-pagination {
  position: absolute;
  bottom: 15px;
}
// 空状态定位
.el-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.clearfix {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
</style>
