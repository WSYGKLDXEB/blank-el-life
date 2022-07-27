<template>
  <div class="user">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="16">
      <!-- 左侧数据 -->
      <el-col :span="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <div>
              <el-input clearable size="small" placeholder="请输入用户名" v-model="searchValue" class="input-with-select" @keyup.enter.native="search" @clear="inputClear">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
          </div>
          <!-- 表格 -->
          <el-table max-height="655" :data="userList" border style="width: 100%">
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="username" label="用户" width="180"> </el-table-column>
            <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
            <el-table-column prop="mobile" label="电话"> </el-table-column>
            <el-table-column prop="role_name" label="权限"> </el-table-column>
            <el-table-column prop="mg_state" label="状态">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.mg_state" active-color="#409eff" inactive-color="#dcdfe6"> </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="del(scope)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="权限分配" placement="top">
                  <el-button type="warning" size="mini" icon="el-icon-s-tools" @click="showAssignDialog(scope)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination background :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
        </el-card>
      </el-col>
      <!-- 右侧图表 -->
      <el-col :span="5" class="chartBox">
        <el-card>
          <div ref="state" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="number" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="active" style="height: 100%"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作弹出框 -->
    <el-dialog center :title="isEditState ? '修改用户信息' : '添加用户'" :visible.sync="isDialog" :show-close="false" width="40%" @close="close">
      <el-form ref="formRef" label-position="right" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="用户名" prop="username">
          <el-input :disabled="isEditState" v-model="formData.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="formData.mobile" clearable></el-input>
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

    <!-- 分配权限弹出框 -->
    <el-dialog center title="权限分配" :visible.sync="isAssignDialog" :show-close="false" width="40%">
      <p>
        当前用户：<span>{{ formData.username }}</span>
      </p>
      <p>
        当前权限：<span>{{ formData.role_name }}</span>
      </p>
      <p>
        分配权限：<el-select v-model="selValue" placeholder="请选择">
          <el-option v-for="item in userPerm" :key="item.id" :label="item.roleName" :value="item.roleName"> </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAssignDialog = false">取 消</el-button>
        <el-button type="primary" @click="distribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userData from '@/assets/js/userData'
import userPerm from '@/assets/js/userPerm'
import { CreateChart, color, colorArr, grid } from '@/assets/js/balnk'
export default {
  name: 'BlankElEcBimRealisticUser',

  data() {
    // 邮箱验证
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 手机号验证
    const checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        // 合法的手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      searchValue: '',
      userList: userData,
      currentPage: 1,
      // 表单项规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          // { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          // { required: true, message: '请输入电话', trigger: 'blur' },
          // { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 弹出框弹出与否
      isDialog: false,
      // 分配权限弹出框
      isAssignDialog: false,
      formData: {
        username: '',
        email: '',
        mobile: ''
      },
      // 当前选中项ID,
      tableId: 0,
      // 是否为编辑状态
      isEditState: true,
      userPerm,
      selValue: ''
    }
  },

  mounted() {
    this.stateChart()
    this.numberChart()
    this.activeChart()
  },

  methods: {
    // 搜索框清理
    inputClear() {
      this.userList = userData
    },
    // 查询
    search() {
      if (!this.searchValue) {
        this.userList = userData
        return this.$message.warning('输入框不能为空！')
      }
      this.userList = userData.filter((item) => item.username.indexOf(this.searchValue) !== -1)
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
        username: '',
        email: '',
        mobile: ''
      }
      this.isDialog = true
      // this.$refs.formRef.resetFields()
    },
    showAssignDialog(item) {
      this.tableId = item.$index
      this.formData = item.row
      this.isAssignDialog = true
      this.selValue = ''
    },
    add() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        const from = {
          username: this.formData.username,
          email: this.formData.email,
          mobile: this.formData.mobile,
          role_name: '操作员',
          mg_state: true
        }
        this.userList.push(from)
        this.isDialog = false
        this.$message.success('添加成功！')
      })
    },
    // 编辑
    edit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.userList[this.tableId] = this.formData
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
        this.userList.splice(item.$index, 1)
        return this.$message.success('删除成功！')
      }
    },
    // 分配权限
    distribute() {
      if (!this.selValue) {
        return this.$message.error('输入框不能为空!')
      }
      this.isAssignDialog = false
      this.userList[this.tableId].role_name = this.selValue

      this.$message.success('分配权限成功！')
    },
    close() {
      // this.$refs.formRef.resetFields()
    },
    stateChart() {
      const option = {
        // color: ["#3fb1e3", "#6be6c1", "#626c91", "#a0a7e6", "#c4ebad", "#96dee8"],
        color: colorArr,
        title: [
          {
            text: '单位：%',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '权限比',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'item'
          // formatter: "{b}  <br/>{c}辆",
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          // right: 'right',
          x: 'right',
          y: '20%',
          textStyle: {
            color: '#b8f0fc'
          },
          formatter: (name) => {
            // 该函数用于设置图例显示后的百分比
            let total = 0
            let value
            // debugger;
            option.series[0].data.forEach((item) => {
              total += Number(item.value)
              if (item.name === name) {
                value = item.value
              }
            })
            const p = Math.round((value / total) * 100) // 求出百分比
            return `${name} |  ${p}%` // 返回出图例所显示的内容是名称+百分比
            // return `${name}`; //返回出图例所显示的内容是名称+百分比
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: ['20%', '70%'],
            center: ['30%', '60%'],
            roseType: 'area',
            itemStyle: {
              show: false,
              borderRadius: 0
            },
            label: {
              show: false
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
              { value: 22, name: 'rose 7' }
            ]
          }
        ]
      }

      CreateChart(this.$refs.state, option)
    },
    numberChart() {
      const option = {
        // backgroundColor: "#141f56",
        title: [
          {
            text: '单位：个',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '权限数量',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          show: 'true',
          trigger: 'item',
          backgroundColor: 'rgba(0,0,0,0.4)', // 背景
          padding: [8, 10], // 内边距
          // extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
          formatter: function (params) {
            if (params.seriesName !== '') {
              return params.name + ' ：  ' + params.value + ' 辆'
            }
          }
        },
        grid,
        xAxis: [
          {
            type: 'category',

            axisTick: {
              show: false
            },

            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255,0.2)'
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: '#b8f0fc',
                fontWeight: 'normal',
                fontSize: '12'
              }
              // formatter:function(val){
              //     return val.split("").join("\n")
              // },
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          {
            type: 'category',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: {
          min: 10,
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color
            }
          },
          axisLabel: {
            textStyle: {
              color: '#b8f0fc',
              fontWeight: 'normal',
              fontSize: '12'
            },
            formatter: '{value}'
          }
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              normal: {
                show: true,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#00c0e9'
                  },
                  {
                    offset: 1,
                    color: '#3b73cf'
                  }
                ]),
                barBorderRadius: 50,
                borderWidth: 0
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: 'rgba(105,123, 214, 0.7)'
              }
            },
            zlevel: 2,
            barWidth: '20%',
            data: [23, 22, 20, 30, 22, 15, 16]
          },
          {
            name: '',
            type: 'bar',
            xAxisIndex: 1,
            zlevel: 1,
            itemStyle: {
              normal: {
                color: 'transparent',
                borderWidth: 0,
                shadowBlur: {
                  shadowColor: 'rgba(255,255,255,0.31)',
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 2
                }
              }
            },
            barWidth: '20%',
            data: [30, 30, 30, 30, 30, 30, 30]
          }
        ]
      }

      CreateChart(this.$refs.number, option)
    },
    activeChart() {
      const option = {
        title: [
          {
            text: '单位：%',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '活跃度',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        legend: {
          top: '0%',
          textStyle: {
            color: '#9ec6d7',
            fontSize: '12'
          }
        },
        grid,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['01', '02', '03', '04', '05', '06', '07'],
            axisLabel: {
              textStyle: {
                color: '#b8f0fc',
                fontSize: 12
              }
            },

            axisLine: {
              lineStyle: {
                color
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color
              }
            },
            axisLabel: {
              textStyle: {
                color: '#b8f0fc',
                fontSize: 12
              }
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color
              }
            }
          }
        ],
        series: [
          {
            name: '正常',
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series'
            },
            // 第一条 线是圆滑
            smooth: true,
            // 单独修改线的样式
            lineStyle: {
              color: '#0184d5',
              width: 2
            },
            // 填充区域
            areaStyle: {
              // 渐变色，
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(1, 132, 213, 0.7)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(1, 132, 213, 0.2)' // 渐变线的结束颜色
                  }
                ],
                global: false // 缺省为 false
              },
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            // 设置拐点 小圆点
            symbol: 'circle',
            // 拐点大小
            symbolSize: 8,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: '#0184d5',
              borderColor: 'rgba(221, 220, 107, .1)',
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: [99, 136, 88, 100, 124, 77, 99]
          },
          {
            name: '超标',
            type: 'line',
            smooth: true,
            lineStyle: {
              normal: {
                color: '#00d887',
                width: 2
              }
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(0, 216, 135, 0.7)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(0, 216, 135, 0.2)'
                  }
                ],
                global: false // 缺省为 false
              },
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            // 设置拐点 小圆点
            symbol: 'circle',
            // 拐点大小
            symbolSize: 8,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: '#00d887',
              borderColor: 'rgba(221, 220, 107, .1)',
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: [6, 2, 8, 1, 1, 5, 7]
          }
        ]
      }
      CreateChart(this.$refs.active, option)
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
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
// 分页定位
.el-pagination {
  position: absolute;
  bottom: 15px;
}
.el-card {
  position: relative;
  width: 100%;
  height: 100%;
}
/deep/.el-card__body {
  height: 93%;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-row {
  height: 96%;
  .el-col {
    height: 100%;
  }
}
</style>
