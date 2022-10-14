<template>
  <div class="configEle">
    <!-- 表格显示框按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">数据表格</el-button>
    <el-tabs class="nav">
      <el-tab-pane label="实时数据">
        <!-- 图表 -->
        <div id="chartBox" class="chartBox">
          <el-row :gutter="16" class="row_1">
            <el-col :span="8">
              <div class="chartItem card" ref="voltage" style="height: 100%"></div>
            </el-col>
            <!-- 变压器温度 -->
            <el-col :span="12">
              <el-card>
                <div class="chartItem tem" ref="tem_1" style="height: 100%"></div>
                <div class="chartItem tem" ref="tem_2" style="height: 100%"></div>
                <div class="chartItem tem" ref="tem_3" style="height: 100%"></div>
              </el-card>
            </el-col>
            <el-col :span="4">
              <div class="control card" v-show="true">
                <h4>阙值控制</h4>
                <div class="stateBox" style="float: left">
                  <p>启动控制</p>
                  <el-switch style="margin-top: 4px" class="startUp" :width="70" v-model="switchValue" active-color="rgba(19, 206, 102, .85)" inactive-color="rgba(126, 124, 125, 1)"> </el-switch>
                </div>
                <div class="butState">
                  <div class="stateBox">
                    <p>电压阙值</p>
                    <el-input size="mini" :disabled="!switchValue" v-model="inputValue" @keyup.enter.native="switchValue = false"></el-input>
                  </div>
                  <div class="stateBox">
                    <p>电流阙值</p>
                    <el-input size="mini" :disabled="!switchValue" v-model="inputValue" @keyup.enter.native="switchValue = false"></el-input>
                  </div>
                  <div class="stateBox">
                    <p>变压器阙值</p>
                    <el-input size="mini" :disabled="!switchValue" v-model="inputValue" @keyup.enter.native="switchValue = false"></el-input>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row :gutter="16" class="row_2">
            <!-- 电量使用情况 -->
            <el-col :span="8">
              <div class="chartItem card" ref="use" style="height: 100%"></div>
            </el-col>
            <el-col :span="16" class="row_right">
              <div class="chartItem card" ref="elect"></div>
              <div class="chartItem card" ref="abnormal"></div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置管理">
        <el-row :gutter="16">
          <!-- 左侧列表 -->
          <el-col :span="19">
            <el-tabs class="card" tab-position="left">
              <el-tab-pane label="基础配置" class="basics">
                <el-form :model="basicsForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="设备名称" prop="pass">
                    <el-input size="mini" v-model="basicsForm.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="设备编码" prop="checkPass">
                    <el-input size="mini" v-model="basicsForm.code" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="设备语言" prop="age">
                    <el-select v-model="basicsForm.language" placeholder="请选择" size="mini">
                      <el-option label="简体中文" value="zn"></el-option>
                      <el-option label="繁体中文" value="tc"></el-option>
                      <el-option label="英文" value="en"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="产品型号" prop="age">XXXX-XXX-XXX</el-form-item>
                  <el-form-item label="序列号" prop="age">XXXXXXXXXXXXXXX</el-form-item>
                  <el-form-item label="软件版本" prop="age">XXXXXXXXXXXXXXX</el-form-item>
                  <el-form-item label="运行时间" prop="age">XXXX:XX:XX</el-form-item>
                  <el-form-item>
                    <el-button type="primary">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="XX管理"></el-tab-pane>
              <el-tab-pane label="XX管理"></el-tab-pane>
              <el-tab-pane label="XX管理"></el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="5">
            <tree-list isFilter></tree-list>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
      <el-card>
        <div slot="header" class="between">
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
          <div v-if="tableData.length !== 0">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
            <el-button type="primary" size="mini" icon="el-icon-data-analysis" @click="exportToExcel('#table', '设备列表')">导出</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <template v-if="tableData.length !== 0">
          <el-table id="table" stripe max-height="655" :data="tableData" border style="width: 100%">
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
// eslint-disable-next-line camelcase
import { export_el_table_to_excel } from '@/plugins/Export2Excel'
import { CreateChart, color, grid, textColor } from '@/assets/js/blank'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankElLifeConfigEle',

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
      // 闸值
      inputValue: 10,
      switchValue: false,
      // 基础配置
      basicsForm: {
        name: 'XXXXXX',
        code: 'x',
        language: 'zn'
      }
    }
  },

  mounted() {
    this.temChart(this.$refs.tem_1, 1)
    this.temChart(this.$refs.tem_2, 2)
    this.temChart(this.$refs.tem_3, 3)
    this.useChart()
    this.electChart()
    this.abnChart()
    this.voltageChart()
  },

  methods: {
    exportToExcel(id, title) {
      // 提供一个简单的测试数据，测试时注意要把上面数据注释掉
      const header = ['姓名', '年龄']
      const data = [
        ['tom', 12],
        ['jerry', 13]
      ]
      // export_json_to_excel(header, data, '测试内容')
      // export_table_to_excel('#table')
      export_el_table_to_excel(id, title, true)
    },
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
    // 温度
    temChart(dom, id) {
      const dataValArray = 0.63
      let value = 40
      const max = 50
      const colorArr = ['#49afff', '#36ce9e', '#f56c6c']
      const option = {
        title: [
          {
            show: id === 1,
            text: '单位：℃',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            show: id === 3,
            text: '变压器温度',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: id + '#变压器',
            bottom: 0,
            left: 'center',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 14
            }
          }
        ],
        tooltip: {
          formatter: (params) => {
            console.log(params)
            // return '{a}: {c}℃'
            return `${params.seriesName}:${params.value * 10}℃`
          }
        },
        angleAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          min: 0,
          max: 6.666,
          // boundaryGap: ['0', '10'],
          startAngle: 225
        },
        radiusAxis: {
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
          data: ['a', 'b', 'c'],
          z: 10
        },
        polar: {
          radius: '85%'
        },
        series: [
          {
            type: 'bar',
            data: [0, 0, value / 10],
            z: 1,
            coordinateSystem: 'polar',
            barMaxWidth: 10,
            name: '当前温度',
            roundCap: true,
            // color: ["#49afff", "#68A54A", "#f56c6c"],
            barGap: '-100%'
            // 如果想要两个系列的柱子重叠，可以设置 barGap 为 '-100%'。这在用柱子做背景的时候有用。
          },

          {
            // 底圈
            type: 'bar',
            data: [0, 0, max / 10],
            z: 0,
            silent: true,
            coordinateSystem: 'polar',
            barMaxWidth: 45,
            name: '',
            roundCap: true,
            color,
            // barGap: '-100%',
            barCategoryGap: '0%'
          },

          {
            name: '温度',
            type: 'gauge',
            radius: '95%',
            center: ['50%', '50%'],
            max: 50,
            startAngle: 225,
            endAngle: -45,
            detail: {
              formatter: (value) => {
                if (value > 0 && value < 20) {
                  return ['{a|' + value + '℃}', '{d|当前温度}'].join('\n')
                } else if (value >= 20 && value < 30) {
                  return ['{b|' + value + '℃}', '{d|当前温度}'].join('\n')
                } else if (value >= 30 && value <= 50) {
                  return ['{c|' + value + '℃}', '{d|当前温度}'].join('\n')
                }
              },
              width: '100%',
              height: '30%',
              padding: [-100, 0, 0, 0],
              rich: {
                a: {
                  color: '#49afff',
                  fontSize: 40
                },
                b: {
                  color: '#68A54A',
                  fontSize: 40
                },
                c: {
                  color: '#f56c6c',
                  fontSize: 40
                },
                d: {
                  color: '#666',
                  fontSize: 14,
                  padding: [10, 0, 10, 0]
                }
              }
            },
            data: [
              {
                value: value
              }
            ],
            axisLine: {
              lineStyle: {
                color: [
                  // 数组第一个属性是颜色所占line百分比
                  [0.4, '#49afff'],
                  // [0.6, '#68A54A'],
                  [0.6, '#36ce9e'],
                  [1, '#f56c6c']
                ],
                width: 22
              }
            },
            splitLine: {
              length: 15,
              distance: -22,
              lineStyle: {
                width: 1,
                color: '#fff'
              }
            },
            splitNumber: 50,
            axisLabel: {
              distance: 0,
              show: true,
              formatter: (value) => {
                if (value === 0) {
                  return '{min|' + value + '℃}'
                }
                if (value === 50) {
                  return '{max|' + value + '℃}'
                }
                return ''
              },

              rich: {
                min: {
                  color: '#49afff',
                  fontSize: 20
                },
                max: {
                  color: '#f56c6c',
                  fontSize: 20
                }
              },
              //   padding: '8 0 0 0'
              lineHeight: -60,
              padding: [0, 20]
            },
            pointer: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ]
      }

      function initPolarColor(value) {
        // 此函数根据value的范围大小，为仪表盘参数设置不同的颜色、数字
        if (value > 0 && value < 20) {
          option.series[0].color = colorArr[0]
        } else if (value >= 20 && value < 30) {
          option.series[0].color = colorArr[1]
        } else if (value >= 30 && value <= 50) {
          option.series[0].color = colorArr[2]
        }
        // option.series[0].color = colorArr[0]
      }
      CreateChart(dom, option)
      const time = setInterval(() => {
        const num = (Math.random() * 40).toFixed(2) - 0
        value = num
        initPolarColor(value)
        // const num = value
        option.series[0].data[2] = num / 10
        // option.series[1].data[0].value = num
        // option.series[1].data[2].value = 67 - num
        CreateChart(dom, option)

        // clearInterval(time)
        console.log(num)
      }, 3000)
    },
    useChart() {
      const data = []
      const labelData = []
      for (let i = 0; i < 24; ++i) {
        data.push({
          value: Math.random() * 10 + 10 - Math.abs(i - 12),
          name: i + ':00'
        })
        labelData.push({
          value: 1,
          name: i + ':00'
        })
      }

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
            text: '24小时用电量分析',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          formatter: (params) => {
            console.log(params)
            // return '{a}: {c}℃'
            if (params.seriesIndex === 1) {
              return ''
            }
            return `${params.data.name}时使用 : ${params.data.value.toFixed(2)}Kw`
          }
        },
        color: ['#27D38A', '#FFCA1C', '#5DD1FA', '#F88E25', '#47A0FF', '#FD6565'],
        series: [
          {
            type: 'pie',
            data: data,
            roseType: 'area',
            itemStyle: {
              normal: {
                color: 'white',
                borderColor: '#22C3AA'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                show: false
              }
            }
          },
          {
            type: 'pie',
            data: labelData,
            radius: ['75%', '100%'],
            zlevel: -2,
            itemStyle: {
              color: '#22C3AA',
              borderColor: 'white'
            },
            label: {
              color,
              position: 'inside'
            }
          }
        ]
      }

      CreateChart(this.$refs.use, option)
    },
    electChart() {
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

      CreateChart(this.$refs.elect, option)
    },
    abnChart() {
      const gzData = [12.6, 25.9, 9.0, 62.4, 28.7, 70.7, 45.6, 82.2, 48.7, 18.8, 26.0, 22.3]
      const bjData = [13.9, 15.9, 11.1, 18.27, 48.3, 69.2, 31.6, 46.6, 55.4, 28.4, 20.23, 10.7]
      const XData = ['2022-1', '2022-2', '2022-3', '2022-4', '2022-5', '2022-6', '2022-7', '2022-8', '2022-9', '2022-10', '2022-11', '2022-12']
      const option = {
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
            text: '异常情况总览',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'white',
          textStyle: {
            color: '#000'
          },
          formatter: function (value) {
            const a0 = value[0] ? value[0].seriesName : ''
            const a1 = value[1] ? value[1].seriesName : ''
            const c0 = value[0] ? parseFloat(value[0].data) : ''
            const c1 = value[1] ? parseFloat(value[1].data) : ''
            let sum = c0 + c1
            if (c0 !== '' && c1 !== '') {
              sum = sum.toFixed(2) // 保留两位小数
            }
            const b = value[0] ? value[0].name : ''
            let atext = ''
            let btext = ''
            if (c0 !== '') {
              atext =
                '<span style="color: #BDBEC3">' +
                a0 +
                '&nbsp;&nbsp;&nbsp;</span><span style="font-size:20px;color: #0a080b"><strong>' +
                c0 +
                '</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: red">2.85%</span><span class="test1" >&#9650<style>\n' +
                '.test1{color:red }\n' +
                '</style></span></br>'
            }
            if (c1 !== '') {
              btext =
                '<span style="color: #BDBEC3">' +
                a1 +
                '&nbsp;&nbsp;&nbsp;</span><span style="font-size:20px;color: #0a080b"><strong>' +
                c1 +
                '</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: #00a854">2.85%</span><span class="test2" >&#9660<style>\n' +
                '.test2{color:green }\n' +
                '</style></span></br>'
            }
            return (
              '<span style="color: #0a080b">全部&nbsp;&nbsp;&nbsp;<span style="font-size:20px;color: #0a080b"><strong>' +
              sum +
              '</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: red">2.85%</span><span class="test" >&#9650<style>\n' +
              '.test{color:red }\n' +
              '</style></span></br>' +
              atext +
              ' ' +
              btext +
              '<span style="color: #0a080b">' +
              b +
              '</span>'
            )
          }
        },
        legend: {
          icon: 'roundRect',
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
          // left: 'c'
        },
        grid,
        xAxis: [
          {
            // name: '时间',
            type: 'category',
            axisPointer: {
              type: 'shadow',
              shadowStyle: {
                color: 'blue',
                opacity: 0.05
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
            axisLabel: {
              textStyle: {
                color: textColor
              }
            },
            boundaryGap: false,
            data: XData
          }
        ],
        yAxis: [
          {
            // name: '(次)',
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            },
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
            }
          }
        ],
        series: [
          {
            id: 'y0',
            name: '故障',
            type: 'line',
            smooth: true,
            // color: 'orange',
            color: '#ffcb1c',
            symbol: 'circle',
            areaStyle: {
              opacity: 0.3,
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'orange' // 0% 处的颜色
                    // color: '#f6b655' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'white' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            data: gzData
          },
          {
            id: 'y1',
            name: '报警',
            type: 'line',
            smooth: true,
            color: '#f56c6c',
            // color: 'red',
            // hoverAnimation:true,
            symbol: 'circle',
            areaStyle: {
              opacity: 0.3,
              color: {
                type: 'linear',
                x: 1,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    // color: 'red'
                    color: '#f56c6c'
                  },
                  {
                    offset: 1,
                    color: 'white'
                  }
                ],
                globalCoord: false
              }
            },
            data: bjData
          },
          {
            name: '报警',
            type: 'effectScatter',
            coordinateSystem: 'cartesian2d',
            data: bjData, // 2d坐标系
            symbol: 'circle',
            symbolSize: 10,
            showEffectOn: 'emphasis',
            rippleEffect: {
              brushType: 'stroke'
            },
            itemStyle: {
              normal: {
                color: 'red',
                borderColor: 'white'
              }
            },
            zlevel: 1,
            tooltip: {
              trigger: 'item',
              backgroundColor: 'white',
              textStyle: {
                color: '#000'
              },
              formatter:
                '<span style="font-size:20px;color: #0a080b"><strong>{c0}</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: green">2.85%</span><span class="test1" >&#9660<style>\n' +
                '.test1{color:green }\n' +
                '</style></span></br>' +
                '<span style="color: #0a080b">{b0}</span>'
            }
          },
          {
            name: '故障',
            type: 'effectScatter',
            coordinateSystem: 'cartesian2d',
            data: gzData, // 2d坐标系
            symbolSize: 10,
            showEffectOn: 'emphasis',
            rippleEffect: {
              brushType: 'stroke'
            },
            itemStyle: {
              normal: {
                color: 'orange',
                borderColor: 'white'
              }
            },
            tooltip: {
              trigger: 'item',
              backgroundColor: 'white',
              textStyle: {
                color: '#000'
              },
              formatter:
                '<span style="font-size:20px;color: #0a080b"><strong>{c0}</strong></span><span style="color: #0a080b">次&nbsp;&nbsp;&nbsp;</span><span style="color: red">2.85%</span><span class="test1" >&#9650<style>\n' +
                '.test1{color:red }\n' +
                '</style></span></br>' +
                '<span style="color: #0a080b">{b0}</span>'
            },
            zlevel: 1
          }
        ]
      }

      CreateChart(this.$refs.abnormal, option)
      // myChart.on('legendselectchanged', function (obj) {})

      // myChart.on('mousemove',{seriesName: '动画'}, function (params) {

      // });
    },
    voltageChart() {
      const xData = [
        '2021-01-01',
        '2021-01-02',
        '2021-01-03',
        '2021-01-04',
        '2021-01-05',
        '2021-01-06',
        '2021-01-07',
        '2021-01-08',
        '2021-01-09',
        '2021-01-10',
        '2021-01-11',
        '2021-01-12',
        '2021-01-13',
        '2021-01-14',
        '2021-01-15',
        '2021-01-16',
        '2021-01-17',
        '2021-01-18',
        '2021-01-19',
        '2021-01-20',
        '2021-01-21',
        '2021-01-22',
        '2021-01-23',
        '2021-01-24',
        '2021-01-25',
        '2021-01-26',
        '2021-01-27',
        '2021-01-28',
        '2021-01-29',
        '2021-01-30',
        '2021-01-31'
      ]
      const lines = [
        [
          '236.77',
          '238.61',
          '238.70',
          '239.16',
          '237.20',
          '236.30',
          '236.09',
          '236.45',
          '236.12',
          '236.19',
          '234.89',
          '234.38',
          '234.94',
          '236.69',
          '234.86',
          '235.52',
          '234.68',
          '235.36',
          '236.77',
          '237.04',
          '236.32',
          '236.02',
          '236.15',
          '236.16',
          '236.38',
          '236.51',
          '236.04',
          '236.66',
          '236.73',
          '236.68',
          '238.51'
        ],
        [
          '237.59',
          '238.49',
          '238.38',
          '238.12',
          '236.37',
          '237.61',
          '236.94',
          '236.57',
          '236.32',
          '237.04',
          '236.68',
          '234.44',
          '235.22',
          '236.45',
          '235.02',
          '235.01',
          '234.95',
          '236.48',
          '236.31',
          '237.53',
          '237.01',
          '236.63',
          '236.93',
          '236.04',
          '237.01',
          '236.81',
          '235.53',
          '237.24',
          '236.28',
          '238.05',
          '239.05'
        ],
        [
          '247.59',
          '248.49',
          '238.38',
          '238.12',
          '238.37',
          '238.61',
          '239.94',
          '230.57',
          '235.32',
          '233.04',
          '232.68',
          '234.44',
          '235.22',
          '236.45',
          '235.02',
          '235.01',
          '234.95',
          '236.48',
          '236.31',
          '237.53',
          '237.01',
          '236.63',
          '236.93',
          '236.04',
          '239.01',
          '235.81',
          '235.53',
          '237.24',
          '236.28',
          '238.05',
          '239.05'
        ]
      ]
      const attrs = [
        {
          name: 'A相电压',
          unit: ''
        },
        {
          name: 'B相电压',
          unit: ''
        },
        {
          name: 'C相电压',
          unit: ''
        }
      ]
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
            text: '三相电压走势图',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'none',
          padding: 5,
          formatter: function (param) {
            let resultTooltip = ''
            resultTooltip =
              "<div style='background:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;'>" +
              "<div style='text-align:center;'>" +
              param[0].name +
              '</div>' +
              "<div style='padding-top:5px;'>" +
              "<span style='display: inline-block; width: 4px; height:10px; border-radius: 5px;background-color: " +
              param[0].color +
              ";'></span>" +
              "<span style=''> " +
              param[0].seriesName +
              ': </span>' +
              "<span style='color:" +
              param[0].color +
              "'>" +
              param[0].value +
              '</span></span><span>' +
              attrs[0].unit +
              '</span>'
            for (let i = 1; i < param.length; i++) {
              resultTooltip +=
                "<div style='padding-top:2px;'>" +
                "<span style='display: inline-block; width: 4px; height:10px; border-radius: 5px;background-color: " +
                param[i].color +
                ";'></span>" +
                "<span style=''> " +
                param[i].seriesName +
                ': </span>' +
                "<span style='color:" +
                param[i].color +
                "'>" +
                param[i].value +
                '</span><span>' +
                attrs[i].unit +
                '</span>'
            }

            resultTooltip += '</div>' + '</div>'
            return resultTooltip
          }
        },
        grid,
        legend: {
          show: true,
          icon: 'roundRect',
          orient: 'horizontal',
          // top: '0.5%',
          // right: '8%',
          itemWidth: 18.5,
          itemHeight: 6,
          itemGap: 30,
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          }
        },
        xAxis: [
          {
            type: 'category',
            // data: ['2019-01-01', '2019-02-01', '2019-03-01', '2019-04-01', '2019-05-01', '2019-06-01', '2019-07-01', '2019-08-01', '2019-09-01', '2019-10-01', '2019-11-01', '2019-12-01', '2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01'],
            data: xData,
            axisLabel: {
              show: true,
              fontSize: 9,
              textStyle: {
                color: textColor // X轴文字颜色
              },
              formatter: function (value) {
                let str = ''
                str += value.substring(0, 4) + '\n'
                str += value.substring(5, 10)
                return str
              }
            },
            axisLine: {
              show: false // 不显示x轴
            },
            axisTick: {
              show: false // 不显示刻度
            },
            boundaryGap: false,
            splitLine: {
              show: true,
              width: 0.08,
              lineStyle: {
                type: 'solid',
                color
              }
            },
            axisPointer: {
              // 轴指示器
              type: 'shadow',
              z: 1,
              shadowStyle: {
                color
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            scale: true, // 坐标轴起点不限制0
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 9,
                color: textColor // X轴文字颜色
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false // 不显示刻度
            },
            axisLine: {
              show: false
            },
            nameTextStyle: {
              color: '#FFFFFF'
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: attrs[0].name,
            type: 'line',
            // data: [10, 18, 5, 23, 14, 40, 58, 50, 45, 56, 53, 47, 45, 65, 55, 50],
            data: lines[0],
            lineStyle: {
              normal: {
                width: 3.5,
                // color: '#3374EB',
                color: 'rgba(73, 175, 255)',
                shadowColor: '#0099ff',
                shadowBlur: 4,
                shadowOffsetY: 3
              }
            },
            symbol: 'emptyCircle',
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#0099ff',
                shadowColor: '#0099ff',
                shadowBlur: 2,
                borderWidth: 2,
                borderColor: '#F8F8FF'
              }
            },
            smooth: true
          },
          {
            name: attrs[1].name,
            type: 'line',
            // data: [23, 60, 20, 36, 23, 58, 81, 76, 68, 76, 73, 68, 65, 85, 75, 70],
            data: lines[1],
            lineStyle: {
              normal: {
                width: 3.5,
                // color: '#3374EB',
                color: 'rgba(54, 206, 158, .8)',
                shadowColor: '#66ff66',
                shadowBlur: 4,
                shadowOffsetY: 3
              }
            },
            symbol: 'emptyCircle',
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#66ff66',
                shadowColor: '#66ff66',
                shadowBlur: 2,
                borderWidth: 2,
                borderColor: '#F8F8FF'
              }
            },
            smooth: true
          },
          {
            name: attrs[2].name,
            type: 'line',
            // data: [23, 60, 20, 36, 23, 58, 81, 76, 68, 76, 73, 68, 65, 85, 75, 70],
            data: lines[2],
            lineStyle: {
              normal: {
                width: 3.5,
                // color: '#3374EB',
                color: 'rgba(245, 108, 108)',
                shadowColor: '#fa676c',
                shadowBlur: 4,
                shadowOffsetY: 3
              }
            },
            symbol: 'emptyCircle',
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#fa676c',
                shadowColor: '#fa676c',
                shadowBlur: 2,
                borderWidth: 2,
                borderColor: '#F8F8FF'
              }
            },
            smooth: true
          }
        ]
      }

      CreateChart(this.$refs.voltage, option)
    }
  }
}
</script>

<style lang="less" scoped>
.configEle {
  // position: relative;
  width: 100%;
  height: 100%;
}
// 配置管理
// 基础配置
.basics {
  box-sizing: border-box;
  padding: 10px 20px;
  color: aliceblue;
  /deep/.el-form-item__label {
    color: rgba(255, 255, 255, 0.6) !important;
  }
  /deep/.el-input {
    width: 200px;
  }
}
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;

  height: 100%;
}
.chartItem {
  width: 100%;
  height: 100%;
}
// 图表第一行
.row_1 {
  height: 32%;
  /deep/.el-card__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tem {
    width: 33%;
  }
}
// 阙值控制
.control {
  height: 100%;
  text-align: right;
  /deep/.el-card__body {
    display: block;
  }
  h4 {
    margin-top: 0;
    font-size: 0.2rem;
    color: #aaa;
  }
  p {
    margin: 0;
    margin-bottom: 6px;
    font-size: 12px;
    color: #aaa;
  }
  .butState {
    padding-top: 20px;
    width: 100%;
    // position: relative;
    display: flex;
    justify-content: space-between;
  }
  .stateBox {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    // justify-content: space-between;
  }
  .el-input {
    width: 60px;
  }
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
.row_2 {
  height: 66%;
  .row_right {
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .card {
      height: 48.5%;
    }
  }
}
.el-col {
  height: 100%;
}
.el-card {
  height: 100%;
}
</style>
