<template>
  <div class="energy">
    <!-- 设备列表显示按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">数据列表</el-button>
    <el-row :gutter="16">
      <el-col :span="19" class="between column">
        <el-row :gutter="16" class="flex_t">
          <!-- 单位能耗 -->
          <el-col :span="12">
            <div class="card" ref="unit" style="height: 100%"></div>
          </el-col>
          <el-col :span="12">
            <div class="card" ref="new" style="height: 100%"></div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="flex_b">
          <el-col :span="12">
            <div class="card" ref="cost" style="height: 100%"></div>
          </el-col>
          <el-col :span="12">
            <div class="card" ref="floor" style="height: 100%"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="5" class="chartBox">
        <div class="temHun card between">
          <div ref="tem" style="width: 50%; height: 100%"></div>
          <div ref="hun" style="width: 50%; height: 100%"></div>
        </div>
        <div ref="water" class="card"></div>
        <div ref="elec" class="card"></div>
      </el-col>
    </el-row>

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
      <el-card>
        <div slot="header" class="between">
          <div style="width: auto">
            <!-- 下拉选择框 -->
            <el-select size="small" v-model="selValue" placeholder="请选择">
              <el-option v-for="item in selOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
              @keyup.enter.native="search"
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
import { CreateChart, color, grid, colorArr } from '@/assets/js/blank'
import chartUrl1 from '@/assets/image/custom-gauge-panel-1.png'
import chartUrl2 from '@/assets/image/custom-gauge-panel-2.png'
import tableData from '@/assets/js/tableData'
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
      // 选择器数据
      selOptions: [
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
      // 选择器
      selValue: '',
      // 分页
      currentPage: 1,
      // table表格数据
      tableData: [],
      // 弹出框弹出与否
      isDialog: false,
      // 表格框弹出与否
      isFormDialog: false,
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
    this.unitChart()
    this.costChart()
    this.floorChart()
    this.newChart()
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
    },
    // 单位能耗
    unitChart() {
      const highlight = '#c2d6f9'

      const demoData = [
        { name: '', value: Math.floor(Math.random() * 20) + 50, unit: 'kgce/m².a', pos: ['16.6%', '60%'], range: [0, 120] },
        { name: '', value: Math.floor(Math.random() * 30) + 50, unit: 'KWh/m².a', pos: ['49.8%', '60%'], range: [0, 120] },
        { name: '', value: Math.floor(Math.random() * 5) / 10 + 0.5, unit: '%', pos: ['83%', '60%'], range: [0.1, 1.0], splitNum: 9 }
      ]

      const option = {
        backgroundColor: '',
        title: [
          {
            text: '单位综合能耗',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '能源利用率',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        series: (function () {
          const result = []

          demoData.forEach(function (item) {
            result.push(
              // 外围刻度
              {
                type: 'gauge',
                center: item.pos,
                radius: '70%', // 1行3个
                splitNumber: item.splitNum || 10,
                min: item.range[0],
                max: item.range[1],
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 2,
                    shadowBlur: 0,
                    color: [[1, highlight]]
                  }
                },
                axisTick: {
                  show: true,
                  lineStyle: {
                    color: highlight,
                    width: 1
                  },
                  length: -5,
                  splitNumber: 10
                },
                splitLine: {
                  show: true,
                  length: -14,
                  lineStyle: {
                    color: highlight
                  }
                },
                axisLabel: {
                  distance: -20,
                  textStyle: {
                    color: highlight,
                    fontSize: '14',
                    fontWeight: 'bold'
                  }
                },
                pointer: {
                  show: 0
                },
                detail: {
                  show: 0
                }
              },

              // 内侧指针、数值显示
              {
                name: item.name,
                type: 'gauge',
                center: item.pos,
                radius: '50%',
                startAngle: 225,
                endAngle: -45,
                min: item.range[0],
                max: item.range[1],
                axisLine: {
                  show: true,
                  lineStyle: {
                    width: 16,
                    color: [
                      [item.value / item.range[1], 'rgba(39, 166, 237, .6)'],
                      [1, highlight]
                    ]
                  }
                },
                axisTick: {
                  show: 0
                },
                splitLine: {
                  show: 0
                },
                axisLabel: {
                  show: 0
                },
                pointer: {
                  show: true,
                  length: '105%'
                },
                detail: {
                  show: true,
                  offsetCenter: [0, '100%'],
                  textStyle: {
                    fontSize: 20,
                    color: '#fff'
                  },
                  formatter: ['{value}', '{unit|' + (item.unit || '') + '}'].join('\n'),
                  rich: {
                    unit: {
                      fontSize: 14,
                      lineHeight: 30,
                      color: '#ddd'
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: highlight
                  }
                },
                data: [
                  {
                    value: item.value
                  }
                ]
              }
            )
          })

          return result
        })()
      }
      CreateChart(this.$refs.unit, option)
    },
    // 能源费用
    costChart() {
      const testData = [
        {
          name: '本年',
          itemStyle: {
            color: new this.$echarts.graphic.RadialGradient(
              0.5,
              0.5,
              1,
              [
                {
                  offset: 0,
                  color: '#0C1622'
                },
                {
                  offset: 1,
                  color: '#06647D'
                }
              ],
              false
            )
          },
          value: 1000
        },
        {
          name: '上月',
          itemStyle: {
            color: new this.$echarts.graphic.RadialGradient(
              0.5,
              0.5,
              1,
              [
                {
                  offset: 0,
                  color: '#051B32' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#05508A' // 100% 处的颜色
                }
              ],
              false
            )
          },
          value: 88
        },
        {
          name: '本月',
          itemStyle: {
            color: new this.$echarts.graphic.RadialGradient(
              0.5,
              0.5,
              1,
              [
                {
                  offset: 0,
                  color: '#2C3E42' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#4E6170' // 100% 处的颜色
                }
              ],
              false
            )
          },
          value: 100
        },
        {
          name: '昨日',
          itemStyle: {
            color: new this.$echarts.graphic.RadialGradient(
              0.5,
              0.5,
              1,
              [
                {
                  offset: 0,
                  color: '#4A450E' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#625A12' // 100% 处的颜色
                }
              ],
              false
            )
          },
          value: 40
        },
        {
          name: '今日',
          itemStyle: {
            color: new this.$echarts.graphic.RadialGradient(
              0.5,
              0.5,
              1,
              [
                {
                  offset: 0,
                  color: '#294421' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#3F6B30' // 100% 处的颜色
                }
              ],
              false
            )
          },
          value: 30
        }
      ]
      const arr = ['本年', '上月', '本月']
      let sum = 0
      testData.forEach((item) => {
        if (arr.indexOf(item.name) !== -1) {
          sum = sum + item.value * 10
        } else {
          sum += item.value
        }
        console.log(item, sum, item.value)
      })

      const formatUtil = this.$echarts.format

      function getLevelOption() {
        return [
          {
            itemStyle: {
              normal: {
                borderWidth: 0,
                gapWidth: 5
              }
            }
          },
          {
            itemStyle: {
              normal: {
                gapWidth: 1
              }
            }
          },
          {
            colorSaturation: [0.3, 0.5],
            itemStyle: {
              normal: {
                gapWidth: 1,
                borderColorSaturation: 0.6
              }
            }
          }
        ]
      }
      const option = {
        backgroundColor: '',
        title: [
          {
            text: '能源费用',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          formatter: function (info) {
            //   console.log(info)
            let value
            value = info.value

            if (arr.indexOf(info.name) !== -1) {
              value = info.value * 10
            }

            const treePathInfo = info.treePathInfo
            const treePath = []

            for (let i = 1; i < treePathInfo.length; i++) {
              treePath.push(treePathInfo[i].name)
            }

            return [
              '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
              '金额: ' + formatUtil.addCommas(value.toFixed(2)) + ' 元<br>',
              '占比: ' + ((value / sum) * 100).toFixed(2) + ' %'
            ].join('')
          }
        },

        series: [
          {
            name: '能耗费用',
            type: 'treemap',
            roam: false,
            label: {
              show: true,
              formatter: function (info) {
                //   console.log(info)
                let value
                value = info.value

                if (arr.indexOf(info.name) !== -1) {
                  value = info.value * 10
                }

                const treePathInfo = info.treePathInfo
                const treePath = []

                for (let i = 1; i < treePathInfo.length; i++) {
                  treePath.push(treePathInfo[i].name)
                }

                return ['{name|' + info.name + '}', '{value|金额:' + formatUtil.addCommas(value.toFixed(2)) + '元}'].join('\n\n')
              },
              rich: {
                name: {
                  fontSize: 20,
                  color: '#fff',
                  verticalAlign: 'bottom',
                  align: 'center'
                  // padding: 50
                },
                value: {
                  fontSize: 16,
                  color: '#fff',
                  verticalAlign: 'bottom',
                  align: 'center'
                  // padding: 50
                }
              },
              fontSize: 17
            },

            itemStyle: {
              normal: {
                borderColor: '#1e3e4a'
              }
            },
            levels: getLevelOption(),

            data: testData
          }
        ]
      }
      setInterval(() => {
        if (testData[4].value > 80) {
          testData[0].value = 1000
          testData[2].value = 100
          testData[4].value = 20
        }
        const i = Math.floor(Math.random() * 5)
        // testData.forEach((item) => {
        //   if (item.name !== '昨日' || item.name !== '上月') {
        //     item.value += i
        //   }
        // })
        testData[0].value += i / 10
        testData[2].value += i / 10
        testData[4].value += Math.random() * 5
        CreateChart(this.$refs.cost, option)
      }, 1000)
      // CreateChart(this.$refs.cost, option)
    },
    // 楼层用水
    floorChart() {
      const option = {
        color: colorArr,
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
            text: '楼层用水',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}吨'
        },
        legend: {
          data: ['1F', '2F', '3F', '4F', '5F', '6F', '7F'],
          icon: 'circle',
          top: '5%',
          textStyle: {
            color: '#b8f0fc',
            borderWidth: 0
          },
          itemStyle: {
            borderWidth: 0
          }
        },
        grid: {
          // right: '30%'
        },
        series: [
          {
            name: '楼层用水',
            type: 'funnel',
            left: '10%',
            width: '75%',
            bottom: '5%',
            label: {
              formatter: '{b}',
              backgroundColor: 'transparent'
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              opacity: 0.7
              // borderColor: "#b8f0fc",
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: '{b}: {c}吨'
              }
            },
            data: [
              { value: 140, name: '1F' },
              { value: 100, name: '2F' },
              { value: 20, name: '3F' },
              { value: 60, name: '4F' },

              { value: 80, name: '5F' },

              { value: 120, name: '6F' },
              { value: 40, name: '7F' }
            ]
          },
          {
            name: '卫生用水',
            type: 'funnel',
            left: '10%',
            width: '75%',
            bottom: '5%',
            maxSize: '80%',
            label: {
              position: 'inside',
              // formatter: '{c}%',
              formatter: (name) => {
                // console.log(name);
                const a = option.series[0].data[name.dataIndex].value
                const b = ((name.value / a).toFixed(3) * 100).toFixed(1)
                // console.log(b);
                return `${b}%`
              },
              color: '#fff'
            },
            itemStyle: {
              opacity: 0.5,
              // borderColor: "#fff",
              borderWidth: 2
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: '{b}卫生用水: {c}%'
              }
            },
            data: [
              { value: 60, name: '1F' },
              { value: 30, name: '2F' },
              { value: 3, name: '3F' },
              { value: 15, name: '4F' },
              { value: 20, name: '5F' },
              { value: 45, name: '6F' },
              { value: 10, name: '7F' }
            ],
            // Ensure outer shape will not be over inner shape when hover.
            z: 100
          }
        ]
      }
      CreateChart(this.$refs.floor, option)
    },
    newChart() {
      const xData = ['今日', '昨日']
      const lastYearData = [3, 20]
      const thisYearData = [11, 38]

      const textColor = '#fff'
      const lineColor = 'rgba(255,255,255,0.2)'
      const colors = [
        {
          borderColor: 'rgba(0, 255, 191, .6)',
          start: 'rgba(0, 255, 191, .6)',
          end: 'rgba(0, 255, 191, .1)'
        },
        {
          borderColor: 'rgba(0, 191, 255, .6)',
          start: 'rgba(0, 191, 255, .1)',
          end: 'rgba(0, 191, 255, .6)'
        }
      ]
      let borderData = []
      const scale = 2
      borderData = xData.map((item) => {
        return scale
      })

      const option = {
        baseOption: {
          timeline: {
            show: false,
            top: 0,
            data: []
          },
          title: [
            {
              text: '单位：#',
              left: '6px',
              textStyle: {
                color: '#9ec6d7',
                fontSize: 10
              }
            },
            {
              text: '今日能源消耗',
              right: '6px',
              textStyle: {
                color: '#9ec6d7',
                fontSize: 10
              }
            }
          ],
          tooltip: {
            trigger: 'axis',
            // type:'shadow',
            axisPointer: {
              type: 'shadow'
            },
            backgroundColor: 'rgba(17,95,182,0.5)',
            textStyle: {
              color: '#fff'
            },
            formatter: '{a}<br/>{b} :\n\n{c} 吨'
          },
          legend: {
            top: '5%',
            right: 'center',
            itemWidth: 20,
            itemHeight: 5,
            itemGap: 30,
            icon: 'horizontal',
            textStyle: {
              color: '#ffffff',
              fontSize: 14
            }
          },
          grid: [
            // 左边
            {
              show: false,
              left: '2%',
              top: '15%',
              bottom: '21%',
              containLabel: true,
              width: '37%'
            },
            // 中间
            {
              show: false,
              left: '52%',
              top: '15%',
              bottom: '23%',
              width: '0%'
            },
            // 右边
            {
              show: false,
              right: '2%',
              top: '15%',
              bottom: '21%',
              containLabel: true,
              width: '37%'
            }
          ],
          xAxis: [
            {
              type: 'value',
              inverse: true,
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(45, 67, 119, 0.8)'
                }
              },
              axisTick: {
                show: false
              },
              position: 'bottom',
              axisLabel: {
                show: true,
                color: textColor
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#2D4377',
                  type: 'dashed'
                }
              }
            },
            {
              gridIndex: 1,
              show: false
            },
            {
              gridIndex: 2,
              axisLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(45, 67, 119, 0.8)'
                }
              },
              axisTick: {
                show: false
              },
              position: 'bottom',
              axisLabel: {
                show: true,
                color: textColor
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#2D4377',
                  type: 'dashed'
                }
              }
            }
          ],
          yAxis: [
            {
              type: 'category',
              inverse: true,
              position: 'right',
              axisLine: {
                show: true,
                lineStyle: {
                  color: lineColor
                }
              },

              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: xData
            },
            {
              gridIndex: 1,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                // padding:[10,0,0,0],
                textStyle: {
                  color: '#ffffff',
                  fontSize: 13
                },
                align: 'center'
              },
              data: xData.map(function (value) {
                return {
                  value: value,
                  textStyle: {
                    align: 'center'
                  }
                }
              })
            },
            {
              gridIndex: 2,
              type: 'category',
              inverse: true,
              position: 'left',
              axisLine: {
                show: true,
                lineStyle: {
                  color: lineColor
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              },
              data: xData
            }
          ],
          series: []
        },
        options: []
      }

      // option.baseOption.timeline.data.push(timeLineData[0])
      option.options.push({
        backgroundColor: '',
        series: [
          {
            name: '用电',
            type: 'bar',
            barWidth: 10,
            stack: '1',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colors[0].start
                  },
                  {
                    offset: 1,
                    color: colors[0].end
                  }
                ])
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: lastYearData,
            animationEasing: 'elasticOut'
          },
          {
            name: '用水',
            type: 'bar',
            stack: '2',
            barWidth: 10,
            xAxisIndex: 2,
            yAxisIndex: 2,
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: colors[1].start
                  },
                  {
                    offset: 1,
                    color: colors[1].end
                  }
                ])
              }
            },
            label: {
              normal: {
                show: false
              }
            },
            data: thisYearData,
            animationEasing: 'elasticOut'
          }
        ]
      })

      CreateChart(this.$refs.new, option)
    }
  }
}
</script>

<style lang="less" scoped>
.energy {
  position: relative;
  width: 100%;
  height: 100%;
}
.leftBox {
}
.flex_t {
  width: 100%;
  height: 26% !important;
}
.flex_b {
  width: 100%;
  height: 72% !important;
}
.el-row {
  height: 100%;
  .el-col {
    height: 100%;
  }
}
.el-card {
  width: 100%;
  height: 100%;
}
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  & > div {
    height: 35%;
  }
  & > div:first-of-type {
    height: 26%;
  }
}
</style>
