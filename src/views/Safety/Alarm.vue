<template>
  <div class="fire">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全中心</el-breadcrumb-item>
      <el-breadcrumb-item>报警管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <!-- 左侧列表 -->
      <el-col :span="19">
        <el-card class="leftBox">
          <div slot="header" class="clearfix">
            <div style="width: auto">
              <el-select size="small" v-model="selValue" placeholder="请选择">
                <el-option label="全部" value="quanbu"></el-option>
                <el-option label="火灾" value="huizai"></el-option>
                <el-option label="入侵" value="ruqin"></el-option>
              </el-select>
              <el-date-picker
                style="margin: 0 10px"
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
          <div ref="number" style="height: 100%"></div>
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
import { CreateChart, grid, color, colorArr } from '@/assets/js/balnk'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankInvasion',

  data() {
    return {
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
      isEditState: true,
      // 选择器
      selValue: 'quanbu'
    }
  },

  mounted() {
    this.numberChart()
    this.classChart()
    this.dealWithChart()
  },

  methods: {
    // 查询
    search() {
      if (!this.datePickerValue || !this.selValue) {
        return this.$message.warning('请先选择查询条件！')
      }
      this.tableData = tableData
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
    },
    // 折线图
    numberChart() {
      const option = {
        title: [
          {
            text: '单位：条',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '7日报警数',
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
          show: true,
          itemWidth: 20,
          itemHeight: 12,
          itemStyle: {},
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        grid,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            name: '入侵',
            type: 'line',
            stack: 'Total',
            emphasis: {
              focus: 'series'
            },
            // 第一条 线是圆滑
            // smooth: true,
            // 单独修改线的样式
            lineStyle: {
              color: '#e56e62',
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
                    color: 'rgba(229, 110, 98, 0.7)' // 渐变色的起始颜色
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(229, 110, 98, 0.2)' // 渐变线的结束颜色
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
              color: '#e56e62',
              borderColor: '#e56e62',
              borderWidth: 1
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
            data: [99, 136, 88, 100, 124, 77, 99]
          },
          {
            name: '火灾',
            type: 'line',
            // smooth: true,
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
      CreateChart(this.$refs.number, option)
    },
    classChart() {
      const option = {
        // color: ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#96dee8'],
        color: colorArr,
        title: [
          {
            text: '单位：类',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '7日报警类型',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          top: '20%',
          right: 'top',
          textStyle: {
            color: '#9ec6d7'
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
            return `${name}  |   ${p}%` // 返回出图例所显示的内容是名称+百分比
            // return `${name}`; //返回出图例所显示的内容是名称+百分比
          }
        },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: ['20%', '70%'],
            center: ['25%', '65%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 6,
              borderColor: '#fff',
              borderWidth: 2
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
              { value: 22, name: 'rose 7' },
              { value: 18, name: 'rose 8' }
            ]
          }
        ]
      }
      CreateChart(this.$refs.clas, option)
    },
    dealWithChart() {
      const chart = this.$echarts.init(this.$refs.dealWith)
      const value = 0.66
      function Pie() {
        const dataArr = []
        for (let i = 0; i < 150; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              name: (i + 1).toString(),
              value: 50,
              itemStyle: {
                normal: {
                  color: '#00AFFF',
                  borderWidth: 0,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 100,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)',
                  borderWidth: 0,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }
      const data = Pie()
      const option = {
        backgroundColor: 'rgba(255, 255, 255)',
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
            text: '报警处理百分比',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        series: [
          {
            // value: 50, //  内容 配合formatter
            type: 'liquidFill',
            radius: '70%', // 控制中间圆球的尺寸（此处可以理解为距离外圈圆的距离控制）
            center: ['50%', '50%'],
            data: [
              value,
              {
                value,
                direction: 'left' // 波浪方向
              }
            ], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: 'rgba(62, 208, 255, 1)' // 球体本景色
            },
            amplitude: '6  %', // 波浪的振幅
            // 修改波浪颜色
            // color: ['#0286ea', 'l#0b99ff'], // 每个波浪不同颜色，颜色数组长度为对应的波浪个数
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: '#6CDEFC'
                  },
                  {
                    offset: 0,
                    color: '#429BF7'
                  }
                ],
                globalCoord: false
              }
            ],
            label: {
              normal: {
                // formatter: 0.87 * 100 + '\n%',
                formatter: value * 100 + '\n{d|%}',
                //  formatter: function(params){
                //     return params.value* 100 + " \n%";
                // },
                rich: {
                  d: {
                    fontSize: 20
                  }
                },
                textStyle: {
                  fontSize: 30,
                  color: '#fff'
                }
              }
            },
            outline: {
              show: false
            }
          },
          {
            type: 'pie',
            z: 1,
            center: ['50%', '50%'],
            radius: ['72%', '73.5%'], // 控制外圈圆的粗细
            hoverAnimation: false,
            data: [
              {
                name: '',
                value: 500,
                labelLine: {
                  show: false
                },
                itemStyle: {
                  color: '#00AFFF'
                },
                emphasis: {
                  labelLine: {
                    show: false
                  },
                  itemStyle: {
                    color: '#00AFFF'
                  }
                }
              }
            ]
          },
          {
            // 外发光
            type: 'pie',
            z: 1,
            zlevel: -1,
            radius: ['70%', '90.5%'],
            center: ['50%', '50%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                borderWidth: 20,
                color: 'rgba(224,242,255,1)'
              }
            },
            label: {
              show: false
            },
            data: [100]
          },
          {
            // 底层外发光
            type: 'pie',
            z: 1,
            zlevel: -2,
            radius: ['70%', '100%'],
            center: ['50%', '50%'],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                borderWidth: 20,
                color: 'rgba(224,242,255,.4)'
              }
            },
            label: {
              show: false
            },
            data: [100]
          },
          {
            type: 'pie',
            zlevel: 0,
            silent: true,
            radius: ['78%', '80%'],
            z: 1,
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data
          }
        ]
      }

      CreateChart(this.$refs.dealWith, option)
    }
  }
}
</script>

<style lang="less" scoped>
.fire {
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
    height: 35%;
    &:nth-of-type(1) {
      height: 26%;
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
// 空状态定位
.el-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
.clearfix {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
