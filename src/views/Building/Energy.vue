<template>
  <div class="energy">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇智控</el-breadcrumb-item>
      <el-breadcrumb-item>能源管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="16">
      <el-col :span="19">
        <el-card class="leftBody">
          <div slot="header" class="clearfix">
            <div>
              <el-cascader v-model="cascaderValue" size="small " :options="options" :props="{ expandTrigger: 'hover' }"></el-cascader>
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
      <el-col :span="5" class="chartBox">
        <el-card class="box-card temHun">
          <div ref="tem" style="width: 50%; height: 100%"></div>
          <div ref="hun" style="width: 50%; height: 100%"></div>
        </el-card>
        <el-card class="box-card">
          <div ref="water" style="height: 100%"></div>
        </el-card>
        <el-card class="box-card">
          <div ref="elec" style="height: 100%"></div>
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
import { CreateChart, color, grid } from '@/assets/js/balnk'
import chartUrl1 from '@/assets/image/custom-gauge-panel-1.png'
import chartUrl2 from '@/assets/image/custom-gauge-panel-2.png'
export default {
  name: 'BlankElLifeEnergy',

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
      // 级联选择器配置项
      options: [
        {
          value: 'water',
          label: '用水'
        },
        {
          value: 'electricity',
          label: '用电'
        }
      ],
      // 表单项规则
      formRules: {
        date: [{ required: true, message: '请输入日期', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        address: [{ type: 'string', required: true, message: '请输入地址', trigger: 'blur' }]
      },
      // 时间日期
      datePickerValue: '',
      // 级联选择器
      cascaderValue: '',
      // 分页
      currentPage: 1,
      // table表格数据
      tableData: [],
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

  mounted() {
    this.waterChart()
    this.elecChart()
    this.temHunChart(this.$refs.tem, 26, 1, chartUrl1)
    this.temHunChart(this.$refs.hun, 88, 2, chartUrl2)
  },

  methods: {
    // 查询
    search() {
      if (!this.datePickerValue || !this.cascaderValue) {
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
      console.log(isDel)
      console.log(item)
      if (isDel === 'confirm') {
        this.tableData.splice(item.$index, 1)
        return this.$message.success('删除成功！')
      }
    },
    close() {
      // this.$refs.formRef.resetFields()
    },
    // temHunChart(节点, 初始值, i, _panelImageURL)
    temHunChart(dom, val, i, _panelImageURL) {
      const chart = this.$echarts.init(dom)
      // const _panelImageURL = 'src/images/custom-gauge-panel-' + i + '.png'
      const _animationDuration = 1000
      const _animationDurationUpdate = 1000
      const _animationEasingUpdate = 'quarticInOut'
      const _valOnRadianMax = 100
      const _outerRadius = 70
      const _innerRadius = 50
      const _pointerInnerRadius = 20
      const _insidePanelRadius = 40
      const _currentDataIndex = 0
      function renderItem(params, api) {
        const valOnRadian = api.value(1)
        const coords = api.coord([api.value(0), valOnRadian])
        const polarEndRadian = coords[3]
        const imageStyle = {
          image: _panelImageURL,
          x: params.coordSys.cx - _outerRadius,
          y: params.coordSys.cy - _outerRadius,
          width: _outerRadius * 2,
          height: _outerRadius * 2
        }
        return {
          type: 'group',
          children: [
            {
              type: 'image',
              style: imageStyle,
              clipPath: {
                type: 'sector',
                shape: {
                  cx: params.coordSys.cx,
                  cy: params.coordSys.cy,
                  r: _outerRadius,
                  r0: _innerRadius,
                  startAngle: 0,
                  endAngle: -polarEndRadian,
                  transition: 'endAngle',
                  enterFrom: { endAngle: 0 }
                }
              }
            },
            {
              type: 'image',
              style: imageStyle,
              clipPath: {
                type: 'polygon',
                shape: {
                  points: makePionterPoints(params, polarEndRadian)
                },
                extra: {
                  polarEndRadian: polarEndRadian,
                  transition: 'polarEndRadian',
                  enterFrom: { polarEndRadian: 0 }
                },
                during: function (apiDuring) {
                  apiDuring.setShape('points', makePionterPoints(params, apiDuring.getExtra('polarEndRadian')))
                }
              }
            },
            {
              type: 'circle',
              shape: {
                cx: params.coordSys.cx,
                cy: params.coordSys.cy,
                r: _insidePanelRadius
              },
              style: {
                fill: '#fff',
                shadowBlur: 25,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: 'rgba(76,107,167,0.4)'
              }
            },
            {
              type: 'text',
              extra: {
                valOnRadian: valOnRadian,
                transition: 'valOnRadian',
                enterFrom: { valOnRadian: 0 }
              },
              style: {
                text: makeText(valOnRadian),
                fontSize: 20,
                fontWeight: 700,
                x: params.coordSys.cx,
                y: params.coordSys.cy,
                fill: i === 1 ? '#ffa77f' : '#61e7ff',
                align: 'center',
                verticalAlign: 'middle',
                enterFrom: { opacity: 0 }
              },
              during: function (apiDuring) {
                apiDuring.setStyle('text', makeText(apiDuring.getExtra('valOnRadian')))
              }
            }
          ]
        }
      }
      function convertToPolarPoint(renderItemParams, radius, radian) {
        return [Math.cos(radian) * radius + renderItemParams.coordSys.cx, -Math.sin(radian) * radius + renderItemParams.coordSys.cy]
      }
      function makePionterPoints(renderItemParams, polarEndRadian) {
        return [
          convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
          convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian + Math.PI * 0.03),
          convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
        ]
      }
      function makeText(valOnRadian) {
        // Validate additive animation calc.
        if (valOnRadian < -10) {
          alert('illegal during val: ' + valOnRadian)
        }
        return ((valOnRadian / _valOnRadianMax) * 100).toFixed(0) + (i === 1 ? '°C' : '%') + '\n' + (i === 1 ? '温度' : '湿度')
      }
      const option = {
        animationEasing: _animationEasingUpdate,
        animationDuration: _animationDuration,
        animationDurationUpdate: _animationDurationUpdate,
        animationEasingUpdate: _animationEasingUpdate,
        title: {
          show: i === 1,
          text: '温湿度',
          left: '6px',
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        dataset: {
          source: [[1, val]]
        },
        tooltip: {
          formatter: (name) => {
            // console.log(name)

            return `${name.seriesName}:${name.data[1]}${i === 1 ? '°c' : '%'}`
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0,
          show: false,
          min: 0,
          max: _valOnRadianMax
        },
        radiusAxis: {
          type: 'value',
          show: false
        },
        polar: {},
        series: [
          {
            name: i === 1 ? '温度' : '湿度',
            type: 'custom',
            coordinateSystem: 'polar',
            renderItem: renderItem
          }
        ]
      }
      setInterval(() => {
        let nextSource
        if (i === 1) {
          nextSource = [[1, Math.round(Math.random() * 5) + 25]]
        } else {
          nextSource = [[1, Math.round(Math.random() * 10) + 75]]
        }

        chart.setOption({
          dataset: {
            source: nextSource
          }
        })
      }, 3000)
      chart.setOption(option)
      window.addEventListener('resize', () => {
        chart.resize()
      })
    },
    waterChart() {
      const option = {
        color: 'rgba(0, 191, 255, .6)',
        backgroundColor: '',
        title: [
          {
            text: '单位：吨',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '7日用水量',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {
          data: ['用水', '趋势'],
          itemWidth: 20,
          itemHeight: 12,
          itemStyle: {},
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        tooltip: {
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        grid,
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#b8f0fc'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#b8f0fc'
            },
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
            }
          }
        ],
        series: [
          {
            name: '用水',
            type: 'bar',
            // colorBy: '#00bfff',
            barWidth: '60%',
            data: [50, 88, 166, 240, 360, 300, 280]
          },
          {
            name: '趋势',
            type: 'line',
            // yAxisIndex: 1,
            data: [100, 138, 216, 290, 410, 350, 330],
            tooltip: {
              show: false
            },
            itemStyle: {
              color: 'rgba(0, 191, 255, .4)'
            }
          }
        ]
      }
      CreateChart(this.$refs.water, option)
    },
    elecChart() {
      const option = {
        color: 'rgba(0, 255, 191, .6)',
        backgroundColor: '',
        title: [
          {
            text: '单位：kWh',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '7日用电量',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {
          data: ['用电', '趋势'],
          itemWidth: 20,
          itemHeight: 12,
          itemStyle: {},
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        grid,
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: '#b8f0fc'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              color: '#b8f0fc'
            },
            axisLine: {
              show: true,
              lineStyle: {
                color
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color
              }
            }
          }
        ],
        series: [
          {
            name: '用电',
            type: 'bar',
            // colorBy: '#00bfff',
            barWidth: '60%',
            data: [240, 150, 200, 300, 360, 330, 220]
          },
          {
            name: '趋势',
            type: 'line',
            tooltip: {
              show: false
            },

            // yAxisIndex: 1,
            data: [290, 200, 250, 350, 410, 390, 270],
            itemStyle: {
              color: 'rgba(0, 255, 191, .4)'
            }
          }
        ]
      }
      CreateChart(this.$refs.elec, option)
    }
  }
}
</script>

<style lang="less" scoped>
.leftBody {
  /deep/.el-card__body {
    height: 94%;
  }
}
.clearfix {
  display: flex;
  justify-content: space-between;
}
.energy {
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
.el-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  .el-card__body {
    height: 100% !important;
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
.el-pagination {
  position: absolute;
  bottom: 15px;
}
.el-table {
  // overflow-y: auto;
  // overflow-x: hidden;
  // &::-webkit-scrollbar {
  //   display: none;
  // }
}
.box-card {
  /deep/.el-card__body {
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }
}
.temHun {
  /deep/.el-card__body {
    display: flex !important;
    flex-flow: row nowrap !important;
  }

  & > div {
    width: 50%;
  }
}
</style>
