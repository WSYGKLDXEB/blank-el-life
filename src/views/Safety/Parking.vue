<template>
  <div class="parking">
    <!-- 表格显示框按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">数据表格</el-button>
    <el-row :gutter="16">
      <!-- 左侧列表 -->
      <el-col :span="19" class="between column">
        <div class="flex_lt card" ref="income"></div>
        <!-- 出入记录 -->
        <div class="card flex_lb" ref="record"></div>
      </el-col>
      <!-- 右侧图表 -->
      <el-col :span="5" class="chartBox between column">
        <div class="box card">
          <div v-for="item in iconArr" :key="item.number">
            <img :src="item.url" alt="" srcset="" />
            <span>{{ item.title }}</span>
            <p class="text">{{ item.number }}</p>
          </div>
        </div>
        <div class="card" ref="payWay"></div>
        <div class="card" ref="model"></div>
      </el-col>
    </el-row>

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
      <el-card class="leftBox">
        <div slot="header" class="between">
          <div style="width: 50%">
            <el-select size="small" v-model="selValue" placeholder="请选择">
              <el-option label="全部" value="1"></el-option>
              <el-option label="车牌" value="2"></el-option>
              <el-option label="品牌" value="3"></el-option>
              <el-option label="车型" value="3"></el-option>
            </el-select>
            <el-input style="width: 200px; margin: 0 10px" size="small" placeholder="请输入内容" v-model="inputValue" class="input-with-select" @keyup.enter.native="search"> </el-input>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          </div>
          <el-button v-if="tableData.length !== 0" type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
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
    <!-- 操作弹出框 -->
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
import { CreateChart, color, grid, colorArr, textColor } from '@/assets/js/blank'
import tableData from '@/assets/js/tableData'
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
      // 表单项规则
      formRules: {
        date: [{ required: true, message: '请输入日期', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        address: [{ type: 'string', required: true, message: '请输入地址', trigger: 'blur' }]
      },
      inputValue: '',
      selValue: '1',
      // table表格数据
      tableData: [],
      // 分页
      currentPage: 1,
      // 弹出框弹出与否
      isDialog: false,
      // 数据表格弹出与否
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
    this.modelChart()
    this.incomeChart()
    this.recordChart()
    this.payWayChart()
  },

  methods: {
    // 查询
    search() {
      if (!this.selValue || !this.inputValue) {
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
    modelChart() {
      const option = {
        color: colorArr,
        backgroundColor: '',
        title: [
          {
            text: '单位：辆',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '今日车辆类型',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b}  <br/>{c}辆'
        },
        legend: {
          x: 'center',
          y: '20%',
          data: ['车型一', '车型二', '车型三', '车型四'],
          icon: 'circle',
          textStyle: {
            color: '#9ec6d7'
          }
        },
        calculable: true,
        series: [
          {
            name: '车型',
            type: 'pie',
            // 起始角度，支持范围[0, 360]
            startAngle: 0,
            // 饼图的半径，数组的第一项是内半径，第二项是外半径
            radius: [51, 80],
            // 支持设置成百分比，设置成百分比时第一项是相对于容器宽度，第二项是相对于容器高度
            center: ['50%', '40%'],
            // 是否展示成南丁格尔图，通过半径区分数据大小。可选择两种模式：
            // 'radius' 面积展现数据的百分比，半径展现数据的大小。
            //  'area' 所有扇区面积相同，仅通过半径展现数据大小
            roseType: 'area',
            // 是否启用防止标签重叠策略，默认开启，圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false。
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                formatter: '{c}辆'
              },
              shadowColor: 'pink',
              emphasis: {
                show: true
              }
            },
            labelLine: {
              normal: {
                show: true,
                length2: 1
              },
              emphasis: {
                show: true
              }
            },
            data: [
              {
                value: 600,
                name: '车型一',
                itemStyle: {
                  normal: {
                    // color: "#33b565",
                  }
                }
              },
              {
                value: 1100,
                name: '车型二',
                itemStyle: {
                  normal: {
                    // color: "#20cc98",
                  }
                }
              },
              {
                value: 1200,
                name: '车型三',
                itemStyle: {
                  normal: {
                    // color: "#2089cf",
                  }
                }
              },
              {
                value: 1300,
                name: '车型四',
                itemStyle: {
                  normal: {
                    // color: "#205bcf",
                  }
                }
              },

              {
                value: 0,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              {
                value: 0,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              {
                value: 0,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              {
                value: 0,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              },
              {
                value: 0,
                name: '',
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            ]
          }
        ]
      }
      CreateChart(this.$refs.model, option)
    },
    incomeChart() {
      const data = {
        chart: [
          {
            month: '周一',
            value: 10
          },

          {
            month: '周二',
            value: 8.7
          },

          {
            month: '周三',
            value: 6.8
          },

          {
            month: '周四',
            value: 5.9
          },

          {
            month: '周五',
            value: 5.2
          },
          {
            month: '周六',
            value: 7.8
          },
          {
            month: '周日',
            value: 6.8
          }
        ]
      }

      const xAxisMonth = []
      const barData = []
      const lineData = []
      for (let i = 0; i < data.chart.length; i++) {
        xAxisMonth.push(data.chart[i].month)
        barData.push({
          name: xAxisMonth[i],
          value: data.chart[i].value
        })
        lineData.push({
          name: xAxisMonth[i],
          value: data.chart[i].ratio
        })
      }
      const option = {
        // backgroundColor: "#020d22",
        title: [
          {
            text: '单位：K',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '7日收益',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        grid: {
          ...grid,
          bottom: '-5%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          formatter: function (params) {
            return params[0].data.name + '<br/>' + '总收益: ' + params[1].data.value + 'K'
          }
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLabel: {
              textStyle: {
                color: '#b8f0fc'
              }
            }
          },
          {
            type: 'category',
            position: 'bottom',
            data: xAxisMonth,
            boundaryGap: true,
            // offset: 40,

            splitLine: {
              show: false,
              lineStyle: {
                color
              }
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
            axisLabel: {
              textStyle: {
                color: '#b8f0fc'
              }
            }
          }
        ],
        yAxis: [
          {
            show: true,
            offset: 15,
            splitLine: {
              show: true,
              lineStyle: {
                color
              }
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
            axisLabel: {
              show: true,
              color: '#b8f0fc'
            }
          },
          {
            show: false,
            type: 'value',
            // name: "合格率(%)",
            nameTextStyle: {
              color: '#ccc'
            },
            axisLabel: {
              color: '#b8f0fc'
            },
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              color: 'rgba(255,255,255,0.2)'
            },
            axisTick: {
              show: true
            }
          }
        ],
        color: ['#e54035'],
        series: [
          {
            name: '训练人次',
            type: 'pictorialBar',
            xAxisIndex: 1,
            barCategoryGap: '-40%',
            // barCategoryGap: '-5%',
            symbol: 'path://d="M150 50 L130 130 L170 130  Z"',
            itemStyle: {
              normal: {
                color: function (params) {
                  const colorList = [
                    'rgba(13,177,205,0.8)',
                    'rgba(29,103,182,0.6)',
                    'rgba(13,177,205,0.8)',
                    'rgba(29,103,182,0.6)',
                    'rgba(13,177,205,0.8)',
                    'rgba(29,103,182,0.6)',
                    'rgba(13,177,205,0.8)'
                  ]
                  return colorList[params.dataIndex]
                }
              },
              emphasis: {
                opacity: 1
              }
            },
            data: barData
          },
          {
            symbol:
              'image://data:image/png;base64,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',
            symbolSize: 42,

            type: 'line',
            yAxisIndex: 1,
            data: lineData,
            itemStyle: {
              normal: {
                borderWidth: 5,
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: '#821eff'
                    },

                    {
                      offset: 1,
                      color: '#204fff'
                    }
                  ]
                }
              }
            }
          }
        ]
      }

      CreateChart(this.$refs.income, option)
    },
    recordChart() {
      // 出入记录
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
        },
        {
          name: '13',
          value1: 100,
          value2: 233
        },
        {
          name: '14',
          value1: 138,
          value2: 233
        },
        {
          name: '15',
          value1: 350,
          value2: 200
        },
        {
          name: '16',
          value1: 173,
          value2: 180
        },
        {
          name: '17',
          value1: 180,
          value2: 199
        },
        {
          name: '18',
          value1: 150,
          value2: 233
        },
        {
          name: '19',
          value1: 180,
          value2: 210
        },
        {
          name: '20',
          value1: 230,
          value2: 180
        },
        {
          name: '21',
          value1: 244,
          value2: 170
        },
        {
          name: '22',
          value1: 218,
          value2: 198
        },
        {
          name: '23',
          value1: 207,
          value2: 179
        },
        {
          name: '24',
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
            text: '单位：辆',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '出入记录',
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
                辆`
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
              formatter: '{value}时',
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
            name: '出',
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
            name: '入',
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

      CreateChart(this.$refs.record, option)
    },
    payWayChart() {
      // 支付方式
      const option = {
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
            text: '支付方式',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {
          top: '10%',
          left: 'center',
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        series: [
          {
            name: '缴费分析',
            type: 'pie',
            radius: ['48%', '72%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '15',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 30,
                name: '微信'
              },
              {
                value: 25,
                name: '支付宝'
              },
              {
                value: 22,
                name: '现金'
              },
              {
                value: 17,
                name: '银联'
              },
              {
                value: 7,
                name: '其他'
              }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      CreateChart(this.$refs.payWay, option)
    }
  }
}
</script>

<style lang="less" scoped>
.parking {
  position: relative;
  width: 100%;
  height: 100%;
}
.leftBox {
  /deep/.el-card__body {
    height: 93%;
  }
}
// 左侧图表
.flex_lt {
  width: 100%;
  height: 36%;
}
.flex_lb {
  height: 62%;
}
// 右侧图表
.chartBox {
  height: 100%;
  & > div {
    height: 30%;
  }
  & > div:nth-of-type(1) {
    height: 36% !important;
  }
}
// 右侧上
.box {
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  span {
    font-size: 0.18rem;
  }
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
    padding-bottom: 0.1rem;
  }
  div:nth-of-type(n + 2) {
    padding-top: 0.1rem;
  }
  div:nth-of-type(1) ::before {
    bottom: 0;
    right: -1px;
    height: 80%;
    width: 1px;
    background: linear-gradient(to top, var(--color-theme), transparent);
  }
  div:nth-of-type(2) ::before {
    bottom: 0;
    left: 0;
    height: 1px;
    width: 80%;
    background: linear-gradient(to right, var(--color-theme), transparent);
  }
  div:nth-of-type(3) ::before {
    top: -1px;
    right: 0;
    height: 1px;
    width: 80%;
    background: linear-gradient(to left, var(--color-theme), transparent);
  }
  div:nth-of-type(4) ::before {
    top: 0;
    left: 0;
    height: 80%;
    width: 1px;
    background: linear-gradient(to bottom, var(--color-theme), transparent);
  }
  img {
    // opacity: var(--opacity);
    opacity: 0.9;
  }
  span {
    margin: 8px 0;
    color: var(--color-theme);
  }
  p {
    margin: 4px 0;
    font-size: 30px;
    font-weight: 600;
    font-family: 'electronicFont';
    color: var(--theme);
  }
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
</style>
