<template>
  <div class="stairs">
    <!-- 表格显示框按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">数据表格</el-button>
    <!-- 图表 -->
    <div ref="chartBox" id="chartBox" class="chartBox">
      <el-card>
        <div ref="park" style="height: 100%"></div>
      </el-card>
      <el-row :gutter="16">
        <el-col :span="12" style="padding-left: 0">
          <el-card>
            <div ref="record" style="height: 100%"></div>
          </el-card>
        </el-col>
        <el-col :span="12" style="padding-right: 0">
          <el-card>
            <div ref="runTime" style="height: 100%"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
      <el-card>
        <div slot="header" class="clearfix">
          <div style="width: auto">
            <!-- 下拉选择框 -->
            <el-select size="small" v-model="selValue" placeholder="请选择">
              <el-option label="全部" value="quanbu"></el-option>
              <el-option label="1F" value="huizai"></el-option>
              <el-option label="2F" value="ruqin"></el-option>
            </el-select>
            <!-- 时间日期选择框 -->
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
          <div>
            <el-button v-if="tableData.length !== 0" type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <template v-if="tableData.length !== 0">
          <el-table stripe max-height="655" :data="tableData" border style="width: 100%">
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
    </el-dialog>
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
import { CreateChart, grid, color, colorArr, textColor, hex2Rgba } from '@/assets/js/blank'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankElLifeStairs',

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
      // 控制表格展示框的显示与否
      isFormDialog: false,
      formData: {
        date: '',
        name: '',
        address: ''
      },
      // 当前选中项ID,
      tableId: 0,
      // 是否为编辑状态
      isEditState: true,
      // 搜索框
      selValue: 'quanbu',
      // 左右面板比例大小（左侧）
      colSpan: 2
    }
  },

  async mounted() {
    this.parkChart()
    this.recordChart()
    this.runTime()
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
    // 电梯井
    parkChart() {
      let time = null // 存放定时器
      const data = [
        { name: '1#电梯', floorCount: 27, nowFloor: 4, type: 0 }, // 0停在某一楼层，1上行，2下行,还没做
        { name: '2#电梯', floorCount: 27, nowFloor: 1, type: 1 },
        { name: '3#电梯', floorCount: 27, nowFloor: 6, type: 0 },
        { name: '4#电梯', floorCount: 27, nowFloor: 4, type: 2 },
        { name: '5#电梯', floorCount: 27, nowFloor: 3, type: 1 },
        { name: '6#消防', floorCount: 27, nowFloor: 3, type: 1 }
      ]

      const setSeries = () => {
        const series = []
        const xData = []
        let MaxCount = 0
        for (let i = 0; i < data.length; i++) {
          xData.push(data[i].name)
          if (data[i].floorCount > MaxCount) MaxCount = data[i].floorCount
        }

        for (let i = 1; i <= MaxCount; i++) {
          const bar = {
            data: [],
            type: 'bar',
            color: 'rgba(7, 7, 7, 1)',
            // /* barGap: '-100%',//重叠*/
            stack: 'one', // 堆叠
            barWidth: 50
          }
          const bar2 = {
            type: 'bar',
            stack: 'one', // 堆叠
            color: 'rgba(125, 125, 125, 0)',
            barWidth: 50,
            data: []
          }
          for (let j = 0; j < data.length; j++) {
            if (i <= data[j].floorCount) {
              bar.data.push({
                // 方块的宽度
                value: 16,
                itemStyle: {
                  borderColor: 'rgba(150, 150, 150, .3)',
                  borderWidth: '20', // 防空遮罩阴影宽度
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 0.7, [
                    {
                      offset: 0,
                      color: i !== data[j].nowFloor ? '#087cf9' : '#f51207'
                    },
                    {
                      offset: 1,
                      color: i !== data[j].nowFloor ? '#09408a' : '#e2746e'
                    }
                  ])
                },
                label: {
                  color: '#fff',
                  show: true,
                  position: 'inside',
                  formatter: (e) => {
                    // console.log('图表', e)
                    if (i <= 2) {
                      return 3 - i + 'B'
                    } else {
                      return i - 2 + 'F'
                      // 1 2 3 4
                      // 4 3 2 1
                    }
                  }
                }
              })
              bar2.data.push(2)
            } else {
              bar.data.push(null)
              bar2.data.push(null)
            }
          }
          series.push(bar)
          series.push(bar2)
        }
        const option = {
          backgroundColor: '', // ' #0494fc',
          title: [
            {
              text: '单位：层',
              left: '6px',
              textStyle: {
                color: '#9ec6d7',
                fontSize: 10
              }
            },
            {
              text: '电梯运行状态',
              right: '6px',
              textStyle: {
                color: '#9ec6d7',
                fontSize: 10
              }
            }
          ],
          tooltip: {
            show: true,
            formatter: (params) => {
              const obj = data.filter((item) => item.name === params.name)
              let i = obj[0].nowFloor
              if (i <= 2) {
                i = i - 3
              } else {
                i = i - 2
                // 1 2 3 4
                // 4 3 2 1
              }
              return `${params.name}当前停靠:${i}层`
            }
          },
          grid: {
            top: 0,
            left: '5%',
            right: 0,
            bottom: 0
          },

          yAxis: {
            data: xData,
            axisLine: {
              lineStyle: {
                color: textColor
              },
              show: false
            },
            axisLabel: {
              show: true,
              fontSize: 14
            },
            axisTick: {
              show: false
            }
          },
          xAxis: {
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            }
          },
          series: series
        }

        CreateChart(this.$refs.park, option)
        // chart.setOption(option)
      }

      setSeries()

      // #region
      // time = setInterval(() => {
      //   if (!this.isChart) {
      //     clearInterval(time)
      //   }
      //   for (let i = 0; i < data.length; i++) {
      //     if (data[i].type === 1) {
      //       if (data[i].nowFloor < data[i].floorCount) {
      //         data[i].nowFloor++
      //       } else {
      //         data[i].type = 2
      //       }
      //     } else if (data[i].type === 2) {
      //       if (data[i].nowFloor > 1) {
      //         data[i].nowFloor--
      //       } else {
      //         data[i].type = 1
      //       }
      //     }
      //   }
      //   setSeries()
      // }, 2000)
      // #endregion

      // if (!this.isChart) {
      //   clearInterval(time)
      // } else {
      time = setInterval(() => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].type === 1) {
            if (data[i].nowFloor < data[i].floorCount) {
              data[i].nowFloor++
            } else {
              data[i].type = 2
            }
          } else if (data[i].type === 2) {
            if (data[i].nowFloor > 1) {
              data[i].nowFloor--
            } else {
              data[i].type = 1
            }
          }
        }
        setSeries()
      }, 2000)
      // }
    },

    recordChart() {
      const option = {
        color: ['#09bcb7', '#ff999a'],
        grid,
        title: [
          {
            text: '单位：人',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '12时出入记录',
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
            type: 'shadow',
            label: {
              backgroundColor: '#9ec6d7'
            }
          }
        },
        legend: {
          show: true,
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show: false,
            lineStyle: {
              color
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: textColor
            }
          },
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {
          type: 'value',
          axistick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color
            }
          },
          axisLabel: {
            textStyle: {
              color: textColor
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color
            }
          }
        },
        series: [
          {
            type: 'line',
            name: '入',
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(9,188,183,0.7)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(9,188,183,0.01)'
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0,0,0,0.01)',
              shadowBlur: 10
            },
            smooth: true,
            lineStyle: {
              color: '#09bcb7'
            },
            data: [180, 160, 140, 88, 97, 75, 100, 86, 78, 28, 39, 67]
          },
          {
            type: 'line',
            name: '出',
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: 'rgba(255,153,154,0.7)'
                  },
                  {
                    offset: 0.8,
                    color: 'rgba(255,153,154,0.01)'
                  }
                ],
                false
              ),
              shadowColor: 'rgba(0,0,0,0.01)',
              shadowBlur: 10
            },
            smooth: true,
            lineStyle: {
              color: '#ff999a'
            },
            data: [150, 90, 30, 188, 99, 88, 40, 56, 45, 66, 78, 90]
          }
        ]
      }

      CreateChart(this.$refs.record, option)
    },

    runTime() {
      const option = {
        title: [
          {
            text: '单位：时',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '电梯运行时间',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        grid,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              backgroundColor: '#9ec6d7'
            }
          }
        },
        legend: {
          show: true,
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false,
            lineStyle: {
              color
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: textColor
            }
          },
          data: ['1#电梯', '2#电梯', '3#电梯', '4#电梯', '5#电梯', '6#消防']
        },
        yAxis: {
          type: 'value',
          axistick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color
            }
          },
          axisLabel: {
            textStyle: {
              color: textColor
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color
            }
          }
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110],
            type: 'bar',
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              // color: (params) => {
              //   // 对每个bar显示一种颜色
              //   return colorArr[params.dataIndex]
              // },
              color: (params) =>
                new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[params.dataIndex]
                  },
                  {
                    offset: 1,
                    color: hex2Rgba(colorArr[params.dataIndex], 0.3)
                  }
                ])
            }
          }
        ]
      }

      CreateChart(this.$refs.runTime, option)
    }
  }
}
</script>

<style lang="less" scoped>
.stairs {
  position: relative;
  width: 100%;
  height: 100%;
}

// 图表
.chartBox {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  /deep/.el-card__body {
    height: 100%;
  }
  .el-card {
    &:nth-of-type(1) {
      height: 68%;
    }
    & > div {
      width: 100%;
      height: 100%;
    }
  }
  /deep/.el-row {
    margin: 0 !important;
    width: 100%;
    height: 30%;
    .el-col {
      height: 100%;
      & > div {
        width: 100%;
        height: 100%;
      }
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
