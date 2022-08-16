<template>
  <div class="fire">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>安全中心</el-breadcrumb-item>
      <el-breadcrumb-item>火灾报警</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格显示框按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">数据表格</el-button>

    <!-- 图表 -->
    <div ref="chartBox" id="chartBox" class="chartBox">
      <el-row :gutter="16" class="row_1">
        <el-col :span="16">
          <!-- 统计 -->
          <el-card>
            <div class="chartItem" ref="statistics" style="height: 100%"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <!-- 报警控制 -->
          <el-card class="alarmControl">
            <h4>报警控制</h4>
            <div class="controlBox">
              <div class="controlItem">
                <el-select :disabled="!switchValue" size="" v-model="alarmRange" placeholder="请选择">
                  <el-option v-for="item in rangeOption" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
                <span>报警范围</span>
                <el-switch style="margin-top: 4px" class="startUp" :width="70" v-model="switchValue" active-color="rgba(19, 206, 102, .85)" inactive-color="rgba(126, 124, 125, 1)"> </el-switch>
              </div>
              <div class="controlItem">
                <el-time-select
                  :disabled="!switchValue"
                  v-model="intervals"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '12:00'
                  }"
                  placeholder="选择时间"
                >
                </el-time-select>
                <span>间隔时间</span>
                <el-switch style="margin-top: 4px" class="startUp" :width="70" v-model="switchValue" active-color="rgba(19, 206, 102, .85)" inactive-color="rgba(126, 124, 125, 1)"> </el-switch>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="row_1">
        <el-col :span="16">
          <!-- 统计 -->
          <el-card>
            <div class="chartItem" ref="scatter" style="height: 100%"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <!-- 分类 -->
          <el-card>
            <div class="chartItem" ref="num" style="height: 100%"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="16" class="row_1">
        <el-col :span="16">
          <!-- 统计 -->
          <el-card>
            <div class="chartItem" ref="everyDay" style="height: 100%"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <!-- 分类 -->
          <el-card>
            <div class="chartItem" ref="type" style="height: 100%"></div>
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
    <el-dialog center :title="isEditState ? '编辑' : '添加'" :visible.sync="isDialog" :show-close="false" width="40%">
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
import { CreateChart, color, grid, textColor, colorArr, hex2Rgba } from '@/assets/js/blank'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankElLifeFire',

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
      rangeOption: [
        [
          {
            value: '选项1',
            label: '黄金糕'
          },
          {
            value: '选项2',
            label: '双皮奶'
          },
          {
            value: '选项3',
            label: '蚵仔煎'
          },
          {
            value: '选项4',
            label: '龙须面'
          },
          {
            value: '选项5',
            label: '北京烤鸭'
          }
        ]
      ],
      // 报警范围
      alarmRange: '',
      // 间隔时间
      intervals: '',
      switchValue: false
    }
  },

  mounted() {
    this.staChart()
    this.typeChart()
    this.scatterChart()
    this.numChart()
    this.everyDayChart()
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
    // 统计
    staChart() {
      const bgColor = ''
      const color = ['#0090FF', '#36CE9E', '#FFC005', '#FF515A', '#8B5CFF', '#00CA69']
      const echartData = [
        {
          name: '1',
          value1: 100,
          value2: 233
        },
        {
          name: '2',
          value1: 138,
          value2: 233
        },
        {
          name: '3',
          value1: 350,
          value2: 200
        },
        {
          name: '4',
          value1: 173,
          value2: 180
        },
        {
          name: '5',
          value1: 180,
          value2: 199
        },
        {
          name: '6',
          value1: 150,
          value2: 233
        },
        {
          name: '7',
          value1: 180,
          value2: 210
        },
        {
          name: '8',
          value1: 230,
          value2: 180
        },
        {
          name: '9',
          value1: 244,
          value2: 170
        },
        {
          name: '10',
          value1: 218,
          value2: 198
        },
        {
          name: '11',
          value1: 207,
          value2: 179
        },
        {
          name: '12',
          value1: 267,
          value2: 221
        }
      ]

      const xAxisData = echartData.map((v) => v.name)
      // ["1", "2", "3", "4", "5", "6", "7", "8"]
      const yAxisData1 = echartData.map((v) => v.value1)
      // [100, 138, 350, 173, 180, 150, 180, 230]
      const yAxisData2 = echartData.map((v) => v.value2)
      // [233, 233, 200, 180, 199, 233, 210, 180]
      const hexToRgba = (hex, opacity) => {
        let rgbaColor = ''
        const reg = /^#[\da-f]{6}$/i
        if (reg.test(hex)) {
          rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
        }
        return rgbaColor
      }

      const option = {
        backgroundColor: bgColor,
        color: color,
        title: [
          {
            text: '单位：Kw',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '用电统计',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let html = ''
            params.forEach((v) => {
              // console.log(v)
              html += `<div style="color: #666;font-size: 14px;line-height: 24px;border-radius: 4px;">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color[v.componentIndex]};"></span>
                ${v.seriesName}.${v.name}
                <span style="color:${color[v.componentIndex]};font-weight:700;font-size: 18px">${v.value}</span>
                万元`
            })

            return html
          },
          extraCssText: 'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: '#ffffff',
              shadowColor: 'rgba(225,225,225,1)',
              shadowBlur: 5
            }
          }
        },
        grid,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              formatter: '{value}月',
              textStyle: {
                color: textColor
              }
            },
            axisLine: {
              lineStyle: {
                color
              }
            },
            axisTick: {
              show: false
            },
            data: xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              textStyle: {
                color: textColor
              }
            },
            nameTextStyle: {
              color: '#666',
              fontSize: 12,
              lineHeight: 40
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#E9E9E9'
              }
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '2021',
            type: 'line',
            smooth: true,
            showSymbol: false,
            zlevel: 3,
            lineStyle: {
              normal: {
                color: color[0],
                shadowBlur: 3,
                shadowColor: hexToRgba(color[0], 0.5),
                shadowOffsetY: 8
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: hexToRgba(color[0], 0.5)
                    },
                    {
                      offset: 1,
                      color: hexToRgba(color[0], 0.1)
                    }
                  ],
                  false
                ),
                shadowColor: hexToRgba(color[0], 0.1),
                shadowBlur: 10
              }
            },
            data: yAxisData1
          },
          {
            name: '2022',
            type: 'line',
            smooth: true,
            showSymbol: false,
            zlevel: 3,
            lineStyle: {
              normal: {
                color: color[1],
                shadowBlur: 3,
                shadowColor: hexToRgba(color[1], 0.5),
                shadowOffsetY: 8
              }
            },
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: hexToRgba(color[1], 0.5)
                    },
                    {
                      offset: 1,
                      color: hexToRgba(color[1], 0.1)
                    }
                  ],
                  false
                ),
                shadowColor: hexToRgba(color[1], 0.1),
                shadowBlur: 10
              }
            },
            data: yAxisData2
          }
        ]
      }

      CreateChart(this.$refs.statistics, option)
    },
    // 分类
    typeChart() {
      const seriesData = [
        { name: '正常', value: 30 },
        { name: '停机', value: 10 },
        { name: '保养', value: 15 },
        { name: '维修', value: 23 }
      ]
      const legend = ['正常', '停机', '保养', '维修']
      const color = ['#35c9cb', '#f56c6c', '#5db2ef', '#ffbd87']
      const option = {
        tooltip: {
          trigger: 'item'
        },
        color,
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
            text: '设备状态',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        grid,
        legend: {
          orient: 'vertical',
          top: 'center',
          right: 0,
          icon: 'circle',
          textStyle: {
            align: 'left',
            verticalAlign: 'middle',
            rich: {
              name: {
                color: '#9ec6d7',
                fontSize: 12
              },
              value: {
                color: '#9ec6d7',
                fontSize: 12
              },
              rate: {
                color: '#9ec6d7',
                fontSize: 12
              }
            }
          },
          data: legend,
          formatter: (name) => {
            if (seriesData.length) {
              const item = seriesData.filter((item) => item.name === name)[0]
              return `{name|${name}：}{value| ${item.value}} {rate| ${item.value}%}`
            }
          }
        },
        series: [
          {
            name: '设备状态',
            type: 'pie',
            center: ['20%', '50%'],
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            labelLine: {
              show: true
              // length: 10,
              // length2: 20,
              // lineStyle: {
              //   width: 2
              // }
            },
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold',
                color: (params) => {
                  return color[params.dataIndex]
                }
              }
            },
            data: seriesData
          }
        ]
      }

      CreateChart(this.$refs.type, option)
    },
    scatterChart() {
      const data = [
        [
          [28604, 77, 17096869, 'Australia', 1990],
          [31163, 77.4, 27662440, 'Canada', 1990],
          [1516, 68, 1154605773, 'China', 1990],
          [13670, 74.7, 10582082, 'Cuba', 1990],
          [28599, 75, 4986705, 'Finland', 1990],
          [29476, 77.1, 56943299, 'France', 1990],
          [31476, 75.4, 78958237, 'Germany', 1990],
          [28666, 78.1, 254830, 'Iceland', 1990],
          [1777, 57.7, 870601776, 'India', 1990],
          [29550, 79.1, 122249285, 'Japan', 1990],
          [2076, 67.9, 20194354, 'North Korea', 1990],
          [12087, 72, 42972254, 'South Korea', 1990],
          [24021, 75.4, 3397534, 'New Zealand', 1990],
          [43296, 76.8, 4240375, 'Norway', 1990],
          [10088, 70.8, 38195258, 'Poland', 1990],
          [19349, 69.6, 147568552, 'Russia', 1990],
          [10670, 67.3, 53994605, 'Turkey', 1990],
          [26424, 75.7, 57110117, 'United Kingdom', 1990],
          [37062, 75.4, 252847810, 'United States', 1990]
        ],
        [
          [44056, 81.8, 23968973, 'Australia', 2015],
          [43294, 81.7, 35939927, 'Canada', 2015],
          [13334, 76.9, 1376048943, 'China', 2015],
          [21291, 78.5, 11389562, 'Cuba', 2015],
          [38923, 80.8, 5503457, 'Finland', 2015],
          [37599, 81.9, 64395345, 'France', 2015],
          [44053, 81.1, 80688545, 'Germany', 2015],
          [42182, 82.8, 329425, 'Iceland', 2015],
          [5903, 66.8, 1311050527, 'India', 2015],
          [36162, 83.5, 126573481, 'Japan', 2015],
          [1390, 71.4, 25155317, 'North Korea', 2015],
          [34644, 80.7, 50293439, 'South Korea', 2015],
          [34186, 80.6, 4528526, 'New Zealand', 2015],
          [64304, 81.6, 5210967, 'Norway', 2015],
          [24787, 77.3, 38611794, 'Poland', 2015],
          [23038, 73.13, 143456918, 'Russia', 2015],
          [19360, 76.5, 78665830, 'Turkey', 2015],
          [38225, 81.4, 64715810, 'United Kingdom', 2015],
          [53354, 79.1, 321773631, 'United States', 2015]
        ]
      ]
      const option = {
        backgroundColor: '',
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
            text: '报警统计',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {},
        grid,
        xAxis: {
          // type: 'category',
          // boundaryGap: false,
          axisLabel: {
            // formatter: '{value}月',
            textStyle: {
              color: textColor
            }
          },
          axisLine: {
            show: false,
            lineStyle: {
              color
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: textColor
            }
          },
          nameTextStyle: {
            color: '#666',
            fontSize: 12,
            lineHeight: 40
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#E9E9E9'
            }
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          scale: true
        },
        series: [
          {
            name: '1990',
            data: data[0],
            type: 'scatter',
            symbolSize: function (data) {
              return Math.sqrt(data[2]) / 5e2
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                formatter: function (param) {
                  return param.data[3]
                },
                position: 'top'
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                },
                {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }
              ])
            }
          },
          {
            name: '2015',
            data: data[1],
            type: 'scatter',
            symbolSize: function (data) {
              return Math.sqrt(data[2]) / 5e2
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                formatter: function (param) {
                  return param.data[3]
                },
                position: 'top'
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(25, 100, 150, 0.5)',
              shadowOffsetY: 5,
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: 'rgb(129, 227, 238)'
                },
                {
                  offset: 1,
                  color: 'rgb(25, 183, 207)'
                }
              ])
            }
          }
        ]
      }

      CreateChart(this.$refs.scatter, option)
    },
    numChart() {
      // const colorArr = ['#35c9cb', '#f56c6c', '#5db2ef', '#ffbd87']
      const legend = ['正常', '停机', '保养', '维修']
      const option = {
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
            text: '设备状态',
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
          data: legend
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

      CreateChart(this.$refs.num, option)
    },
    everyDayChart() {
      const colorArr = ['#35c9cb', '#f56c6c', '#5db2ef', '#ffbd87']
      const option = {
        color: colorArr,
        tooltip: {
          position: 'top',
          formatter: function (params) {
            return option.yAxis.data[params.value[1]] + '<br />' + params.marker + option.xAxis.data[params.value[0]] + '年:' + params.value[2]
          }
        },
        grid,
        legend: {
          left: 'center'
        },
        title: [
          {
            text: '单位：次',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '设备使用情况',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        xAxis: {
          name: '公开年份',
          nameLocation: 'center',
          nameGap: 30,
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
          boundaryGap: false,
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: textColor
            }
          }
        },
        yAxis: {
          // name: "IPC分类号",
          nameLocation: 'center',
          nameGap: 50,
          type: 'category',
          data: ['正常', '停机', '保养', '维修'],
          axisLabel: {
            margin: 20,
            textStyle: {
              color: textColor
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '正常',
            type: 'scatter',
            symbolSize: function (val) {
              return val[2] % 40
            },
            data: [
              [0, 0, 52.7],
              [1, 0, 54.3],
              [2, 0, 103.6609073],
              [3, 0, 49.44177425],
              [4, 0, 85.36067451],
              [5, 0, 65.21634684],
              [6, 0, 70.8854895],
              [7, 0, 144.1782892],
              [8, 0, 86.55587461],
              [9, 0, 175.0591988],
              [10, 0, 137.365509],
              [11, 0, 152.1522859],
              [12, 0, 73.40271996],
              [13, 0, 113.8638821],
              [14, 0, 242.7411259],
              [15, 0, 165.2438771],
              [16, 0, 180.3957087],
              [17, 0, 144.8147144],
              [18, 0, 346.5970571],
              [19, 0, 134.2839845],
              [20, 0, 18.4879261],
              [21, 0, 74.88802983],
              [22, 0, 149.2529388],
              [23, 0, 50.49407848],
              [24, 0, 109.88688],
              [25, 0, 55.44359926],
              [26, 0, 48.63457596],
              [27, 0, 24.93681753],
              [28, 0, 40.53116549],
              [29, 0, 234.0532251]
            ],
            animationDelay: function (idx) {
              return idx * 5
            }
          },
          {
            name: '停机',
            type: 'scatter',
            symbolSize: function (val) {
              return val[2] % 40
            },
            data: [
              [0, 1, 392.1786493],
              [1, 1, 388.7314648],
              [2, 1, 921.2800999],
              [3, 1, 648.919632],
              [4, 1, 718.9274538],
              [5, 1, 497.239929],
              [6, 1, 395.3669522],
              [7, 1, 707.5748246],
              [8, 1, 525.6779595],
              [9, 1, 691.97786],
              [10, 1, 1045.084889],
              [11, 1, 707.264729],
              [12, 1, 323.6257305],
              [13, 1, 328.1628793],
              [14, 1, 1787.290769],
              [15, 1, 1321.787024],
              [16, 1, 1210.112322],
              [17, 1, 890.3458121],
              [18, 1, 1862.071566],
              [19, 1, 442.5346048],
              [20, 1, 183.9365599],
              [21, 1, 468.5321879],
              [22, 1, 679.0783481],
              [23, 1, 339.6884056],
              [24, 1, 687.2046487],
              [25, 1, 371.4889227],
              [26, 1, 289.9903558],
              [27, 1, 86.5853872],
              [28, 1, 118.9524556],
              [29, 1, 354.8211222]
            ],
            animationDelay: function (idx) {
              return idx * 5
            }
          },
          {
            name: '保养',
            type: 'scatter',
            symbolSize: function (val) {
              return val[2] % 40
            },
            data: [
              [0, 2, 765.172507],
              [1, 2, 673.2350584],
              [2, 2, 1214.166909],
              [3, 2, 926.421874],
              [4, 2, 3330.484544],
              [5, 2, 872.8083577],
              [6, 2, 1205.481453],
              [7, 2, 1893.100095],
              [8, 2, 1055.561147],
              [9, 2, 1238.412209],
              [10, 2, 1783.53776],
              [11, 2, 1715.397752],
              [12, 2, 902.7836735],
              [13, 2, 1216.242364],
              [14, 2, 2840.093451],
              [15, 2, 2040.059033],
              [16, 2, 2045.713473],
              [17, 2, 1533.73434],
              [18, 2, 3595.441708],
              [19, 2, 1404.352322],
              [20, 2, 221.0451535],
              [21, 2, 1297.894354],
              [22, 2, 3683.918502],
              [23, 2, 1105.750945],
              [24, 2, 2745.32716],
              [25, 2, 1100.772938],
              [26, 2, 86.4579147],
              [27, 2, 3814.697032],
              [28, 2, 284.7903147],
              [29, 2, 2311.373729]
            ],
            animationDelay: function (idx) {
              return idx * 5
            }
          },
          {
            name: '维修',
            type: 'scatter',
            symbolSize: function (val) {
              return val[2] % 40
            },
            data: [
              [0, 3, 178.2720978],
              [1, 3, 176.7408727],
              [2, 3, 458.2143211],
              [3, 3, 157.3541005],
              [4, 3, 275.4471887],
              [5, 3, 344.0511719],
              [6, 3, 343.2315163],
              [7, 3, 282.9383794],
              [8, 3, 232.5082511],
              [9, 3, 367.7003857],
              [10, 3, 366.7452107],
              [11, 3, 463.8688594],
              [12, 3, 205.9611084],
              [13, 3, 360.5455701],
              [14, 3, 1087.709496],
              [15, 3, 929.8818277],
              [16, 3, 682.2616724],
              [17, 3, 569.6208345],
              [18, 3, 897.1430416],
              [19, 3, 385.6639469],
              [20, 3, 54.5693401],
              [21, 3, 382.9388292],
              [22, 3, 918.7355411],
              [23, 3, 245.0711592],
              [24, 3, 569.8418153],
              [25, 3, 180.7667839],
              [26, 3, 136.7756494],
              [27, 3, 128.8889828],
              [28, 3, 56.6882725],
              [29, 3, 197.8460022]
            ],
            animationDelay: function (idx) {
              return idx * 5
            }
          }
        ]
      }

      CreateChart(this.$refs.everyDay, option)
    }
  }
}
</script>

<style lang="less" scoped>
.fire {
  width: 100%;
  height: 100%;
  position: relative;
}
.el-row,
.el-col {
  height: 100%;
}
// 图表第一行
.row_1 {
  height: 32%;

  // ------------------------
  .el-switch {
    // box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
    /deep/.el-switch__core {
      border-radius: 4px;
      &::after {
        width: 33px;
        border-radius: 2px;
        color: #fff;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
      }
    }
  }
  /deep/.el-switch.is-checked .el-switch__core::after {
    margin-left: -34px;
  }
  // 启动控制
  /deep/.el-switch.startUp {
    .el-switch__core::after {
      content: '禁止';
      background: rgba(255, 73, 73, 0.9);
    }
  }
  /deep/.el-switch.startUp.is-checked {
    .el-switch__core::after {
      content: '启动';
      color: #333;
      background: #fff;
    }
  }
}
// 报警控制
.alarmControl {
  h4 {
    margin-top: 0 !important;
    float: right;
    // font-size: 12px;
    color: #9ec6d7;
  }
  .controlBox {
    margin-top: 30px;
  }
  .controlItem {
    margin-bottom: 20px;
    position: relative;
    span {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .el-select {
    width: 220px;
  }
  .el-switch {
    margin-left: 50px;
  }
}
// 数据展示框
.tableBox {
  /deep/.el-dialog__body {
    padding-top: 10px !important;
    height: 90%;
  }
  .el-card {
    box-shadow: none !important;
  }
  /deep/.el-card__body {
    height: 95%;
    // padding-bottom: 0 !important;
  }
}
.el-card {
  height: 100%;
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
// 图表
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  height: 96%;
}
.chartItem {
  width: 100%;
  height: 100%;
}
</style>
