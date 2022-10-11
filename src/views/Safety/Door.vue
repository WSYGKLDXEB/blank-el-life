<template>
  <div class="door">
    <!-- 表格显示框按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">通行记录</el-button>
    <!--导航 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="实时数据" name="timeData">
        <el-row :gutter="16">
          <!-- 左侧列表 -->
          <el-col :span="19">
            <div class="card" ref="inOut" style="height: 100%"></div>
          </el-col>
          <!-- 右侧图表 -->
          <el-col :span="5" class="chartBox">
            <el-card>
              <div ref="water" style="height: 100%"></div>
            </el-card>
            <el-card>
              <div ref="type" style="height: 100%"></div>
            </el-card>
            <el-card>
              <div ref="state" style="height: 100%"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="门禁管理" name="configure">
        <el-row :gutter="16">
          <!-- 左侧列表 -->
          <el-col :span="19"> </el-col>
          <el-col :span="5">
            <tree-list isFilter></tree-list>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

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

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
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
            <el-input style="width: 200px; margin: 0 10px" size="small" placeholder="请输入内容" v-model="searchValue" class="input-with-select" @keyup.enter.native="search"> </el-input>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          </div>
          <el-button v-if="tableData.length !== 0" type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
        </div>
        <!-- 表格 -->
        <template v-if="tableData.length !== 0">
          <el-table max-height="655" :data="tableData" style="width: 100%">
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
  </div>
</template>

<script>
import { CreateChart, grid, color, colorArr, textColor } from '@/assets/js/blank'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankElLifeDoor',

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
      isEditState: true,
      // 选择器
      searchValue: '',
      // 当前所处页面
      activeName: 'timeData'
    }
  },

  mounted() {
    this.waterChart()
    this.typeChart()
    this.stateChart()
    this.inOutChart()
  },

  methods: {
    // 查询
    search() {
      if (!this.datePickerValue && !this.searchValue) {
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
    waterChart() {
      const value = 0.53
      const data = [value, value, value]
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
            text: '报警处理百分比',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        grid,
        series: [
          {
            type: 'liquidFill',
            radius: '55%',
            z: 6,
            center: ['25%', '50%'],
            // color: ['#f8eeb0', '#fddc75', '#fbad17'],
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
                    color: 'rgba(255,255,255, 0)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(251, 173, 23, .2)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(251, 173, 23, .8)'
                  }
                ],
                globalCoord: false
              }
            ],
            data,
            backgroundStyle: {
              borderWidth: 1,
              color: 'rgba(255,255,255, 0)' // 球体本景色
              // color: 'transparent'
            },
            amplitude: '6  %', // 波浪的振幅
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
                  fontSize: '26',
                  // fontWeight: '300',
                  color: '#a06a0a',
                  textAlign: 'center',
                  textBorderColor: 'rgba(0, 0, 0, 0)',
                  textShadowColor: '#fff',
                  textShadowBlur: '0',
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 1
                }
              }
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0
              },
              borderDistance: 0
            }
          },
          {
            name: '5',
            type: 'pie',
            z: 5,
            radius: ['55%', '0%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 20
                }
              }
            ]
          },
          {
            name: '4',
            type: 'pie',
            z: 4,
            radius: ['54.5%', '0%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 4,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              }
            ]
          },
          {
            name: '3',
            type: 'pie',
            z: 3,
            radius: ['0%', '60%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '2',
            type: 'pie',
            z: 2,
            radius: ['0%', '56.5%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ]),
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '1',
            type: 'pie',
            z: 1,
            radius: ['0%', '68%'],
            center: ['25%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#f3f3f5'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '0',
            type: 'pie',
            z: 0,
            radius: ['0%', '68.5%'],
            center: ['25%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fff'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ]),
                  shadowBlur: 3,
                  shadowColor: 'rgba(140, 149, 166, .6)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            // value: 50, //  内容 配合formatter
            type: 'liquidFill',
            radius: '55%', // 控制中间圆球的尺寸（此处可以理解为距离外圈圆的距离控制）
            center: ['75%', '50%'],
            z: 6,
            data: [value + 0.1, { value, direction: 'left' }, value - 0.1, value - 0.2], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: 'transparent'
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
                    color: 'rgba(255,255,255, 0)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(0, 155, 219, .2)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(0, 155, 219, .8)'
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
                  fontSize: '26',
                  // fontWeight: '300',
                  color: '#02456d',
                  textAlign: 'center',
                  textBorderColor: 'rgba(0, 0, 0, 0)',
                  textShadowColor: '#fff',
                  textShadowBlur: '0',
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 1
                }
              }
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0
              },
              borderDistance: 0
            }
          },
          {
            name: '5',
            type: 'pie',
            z: 5,
            radius: ['55%', '0%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 20
                }
              }
            ]
          },
          {
            name: '4',
            type: 'pie',
            z: 4,
            radius: ['54.5%', '0%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 4,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              }
            ]
          },
          {
            name: '3',
            type: 'pie',
            z: 3,
            radius: ['0%', '60%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '2',
            type: 'pie',
            z: 2,
            radius: ['0%', '56.5%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ]),
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '1',
            type: 'pie',
            z: 1,
            radius: ['0%', '68%'],
            center: ['75%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#f3f3f5'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '0',
            type: 'pie',
            z: 0,
            radius: ['0%', '68.5%'],
            center: ['75%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fff'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ]),
                  shadowBlur: 3,
                  shadowColor: 'rgba(140, 149, 166, .6)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          }
        ]
      }

      CreateChart(this.$refs.water, option)
    },
    typeChart() {
      // Schema:
      // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
      const dataBJ = [
        [55, 9, 56, 0.46, 18, 6, 1],
        [25, 11, 21, 0.65, 34, 9, 2],
        [56, 7, 63, 0.3, 14, 5, 3],
        [33, 7, 29, 0.33, 16, 6, 4],
        [42, 24, 44, 0.76, 40, 16, 5],
        [82, 58, 90, 1.77, 68, 33, 6],
        [74, 49, 77, 1.46, 48, 27, 7],
        [78, 55, 80, 1.29, 59, 29, 8],
        [267, 216, 280, 4.8, 108, 64, 9],
        [185, 127, 216, 2.52, 61, 27, 10],
        [39, 19, 38, 0.57, 31, 15, 11],
        [41, 11, 40, 0.43, 21, 7, 12],
        [64, 38, 74, 1.04, 46, 22, 13],
        [108, 79, 120, 1.7, 75, 41, 14],
        [108, 63, 116, 1.48, 44, 26, 15],
        [33, 6, 29, 0.34, 13, 5, 16],
        [94, 66, 110, 1.54, 62, 31, 17],
        [186, 142, 192, 3.88, 93, 79, 18],
        [57, 31, 54, 0.96, 32, 14, 19],
        [22, 8, 17, 0.48, 23, 10, 20],
        [39, 15, 36, 0.61, 29, 13, 21],
        [94, 69, 114, 2.08, 73, 39, 22],
        [99, 73, 110, 2.43, 76, 48, 23],
        [31, 12, 30, 0.5, 32, 16, 24],
        [42, 27, 43, 1, 53, 22, 25],
        [154, 117, 157, 3.05, 92, 58, 26],
        [234, 185, 230, 4.09, 123, 69, 27],
        [160, 120, 186, 2.77, 91, 50, 28],
        [134, 96, 165, 2.76, 83, 41, 29],
        [52, 24, 60, 1.03, 50, 21, 30],
        [46, 5, 49, 0.28, 10, 6, 31]
      ]
      const dataGZ = [
        [26, 37, 27, 1.163, 27, 13, 1],
        [85, 62, 71, 1.195, 60, 8, 2],
        [78, 38, 74, 1.363, 37, 7, 3],
        [21, 21, 36, 0.634, 40, 9, 4],
        [41, 42, 46, 0.915, 81, 13, 5],
        [56, 52, 69, 1.067, 92, 16, 6],
        [64, 30, 28, 0.924, 51, 2, 7],
        [55, 48, 74, 1.236, 75, 26, 8],
        [76, 85, 113, 1.237, 114, 27, 9],
        [91, 81, 104, 1.041, 56, 40, 10],
        [84, 39, 60, 0.964, 25, 11, 11],
        [64, 51, 101, 0.862, 58, 23, 12],
        [70, 69, 120, 1.198, 65, 36, 13],
        [77, 105, 178, 2.549, 64, 16, 14],
        [109, 68, 87, 0.996, 74, 29, 15],
        [73, 68, 97, 0.905, 51, 34, 16],
        [54, 27, 47, 0.592, 53, 12, 17],
        [51, 61, 97, 0.811, 65, 19, 18],
        [91, 71, 121, 1.374, 43, 18, 19],
        [73, 102, 182, 2.787, 44, 19, 20],
        [73, 50, 76, 0.717, 31, 20, 21],
        [84, 94, 140, 2.238, 68, 18, 22],
        [93, 77, 104, 1.165, 53, 7, 23],
        [99, 130, 227, 3.97, 55, 15, 24],
        [146, 84, 139, 1.094, 40, 17, 25],
        [113, 108, 137, 1.481, 48, 15, 26],
        [81, 48, 62, 1.619, 26, 3, 27],
        [56, 48, 68, 1.336, 37, 9, 28],
        [82, 92, 174, 3.29, 0, 13, 29],
        [106, 116, 188, 3.628, 101, 16, 30],
        [118, 50, 0, 1.383, 76, 11, 31]
      ]
      const dataSH = [
        [91, 45, 125, 0.82, 34, 23, 1],
        [65, 27, 78, 0.86, 45, 29, 2],
        [83, 60, 84, 1.09, 73, 27, 3],
        [109, 81, 121, 1.28, 68, 51, 4],
        [106, 77, 114, 1.07, 55, 51, 5],
        [109, 81, 121, 1.28, 68, 51, 6],
        [106, 77, 114, 1.07, 55, 51, 7],
        [89, 65, 78, 0.86, 51, 26, 8],
        [53, 33, 47, 0.64, 50, 17, 9],
        [80, 55, 80, 1.01, 75, 24, 10],
        [117, 81, 124, 1.03, 45, 24, 11],
        [99, 71, 142, 1.1, 62, 42, 12],
        [95, 69, 130, 1.28, 74, 50, 13],
        [116, 87, 131, 1.47, 84, 40, 14],
        [108, 80, 121, 1.3, 85, 37, 15],
        [134, 83, 167, 1.16, 57, 43, 16],
        [79, 43, 107, 1.05, 59, 37, 17],
        [71, 46, 89, 0.86, 64, 25, 18],
        [97, 71, 113, 1.17, 88, 31, 19],
        [84, 57, 91, 0.85, 55, 31, 20],
        [87, 63, 101, 0.9, 56, 41, 21],
        [104, 77, 119, 1.09, 73, 48, 22],
        [87, 62, 100, 1, 72, 28, 23],
        [168, 128, 172, 1.49, 97, 56, 24],
        [65, 45, 51, 0.74, 39, 17, 25],
        [39, 24, 38, 0.61, 47, 17, 26],
        [39, 24, 39, 0.59, 50, 19, 27],
        [93, 68, 96, 1.05, 79, 29, 28],
        [188, 143, 197, 1.66, 99, 51, 29],
        [174, 131, 174, 1.55, 108, 50, 30],
        [187, 143, 201, 1.39, 89, 53, 31]
      ]
      const lineStyle = {
        width: 1,
        opacity: 0.5
      }
      const option = {
        backgroundColor: '',
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
            text: '门禁类型',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {
          bottom: 0,
          data: ['Beijing', 'Shanghai', 'Guangzhou'],
          itemGap: 20,
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          },
          selectedMode: 'single'
        },
        grid: {
          ...grid,
          bottom: '5%'
        },
        radar: {
          indicator: [
            { name: 'AQI', max: 300 },
            { name: 'PM2.5', max: 250 },
            { name: 'PM10', max: 300 },
            { name: 'CO', max: 5 },
            { name: 'NO2', max: 200 },
            { name: 'SO2', max: 100 }
          ],
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: 'rgb(238, 197, 102)'
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)', 'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)', 'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'].reverse()
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102, 0.5)'
            }
          }
        },
        series: [
          {
            name: 'Beijing',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            symbol: 'none',
            itemStyle: {
              color: '#F9713C'
            },
            areaStyle: {
              opacity: 0.1
            }
          },
          {
            name: 'Shanghai',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataSH,
            symbol: 'none',
            itemStyle: {
              color: '#B3E4A1'
            },
            areaStyle: {
              opacity: 0.05
            }
          },
          {
            name: 'Guangzhou',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataGZ,
            symbol: 'none',
            itemStyle: {
              color: 'rgb(238, 197, 102)'
            },
            areaStyle: {
              opacity: 0.05
            }
          }
        ]
      }

      CreateChart(this.$refs.type, option)
    },
    stateChart() {
      const data = []
      const dataCount = 10
      const startTime = +new Date()
      const categories = ['A', 'B', 'C']
      const types = [
        { name: 'JS Heap', color: '#7b9ce1' },
        { name: 'Documents', color: '#bd6d6c' },
        { name: 'Nodes', color: '#75d874' },
        { name: 'Listeners', color: '#e0bc78' },
        { name: 'GPU Memory', color: '#dc77dc' },
        { name: 'GPU', color: '#72b362' }
      ]
      // Generate mock data
      categories.forEach((category, index) => {
        let baseTime = startTime
        for (let i = 0; i < dataCount; i++) {
          const typeItem = types[Math.round(Math.random() * (types.length - 1))]
          const duration = Math.round(Math.random() * 10000)
          data.push({
            name: typeItem.name,
            value: [index, baseTime, (baseTime += duration), duration],
            itemStyle: {
              color: typeItem.color
            }
          })
          baseTime += Math.round(Math.random() * 2000)
        }
      })
      const renderItem = (params, api) => {
        const categoryIndex = api.value(0)
        const start = api.coord([api.value(1), categoryIndex])
        const end = api.coord([api.value(2), categoryIndex])
        const height = api.size([0, 1])[1] * 0.6
        const rectShape = this.$echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          }
        )
        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style()
          }
        )
      }
      const option = {
        backgroundColor: '',
        color: colorArr,
        tooltip: {
          formatter: function (params) {
            return params.marker + params.name + ': ' + params.value[3] + ' ms'
          }
        },
        title: [
          {
            text: '单位：MS',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '设备运行状态',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            top: 400,
            labelFormatter: ''
          },
          {
            type: 'inside',
            filterMode: 'weakFilter'
          }
        ],
        grid: {
          ...grid,
          left: 0,
          bottom: 0
        },
        xAxis: {
          min: startTime,
          scale: true,
          axisLabel: {
            formatter: (val) => {
              return Math.max(0, val - startTime) + ' ms'
            },
            color: textColor
          },
          axisLine: {
            lineStyle: {
              color
            }
          }
        },
        yAxis: {
          data: categories,
          axisLine: {
            lineStyle: {
              color
            }
          },
          splitLine: {
            lineStyle: {
              color
            }
          },
          axisLabel: {
            color: textColor
          }
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: data
          }
        ]
      }

      CreateChart(this.$refs.state, option)
    },
    inOutChart() {
      const icon =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABDCAMAAABjnP3jAAAAilBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAADT09MAAAAAAAAAAAAAAAD////8/Pz5+fnr6+v8/Pzr6+vZ2dn09PTFxcX+/v719fX6+vrf39+5ubnDw8MSEhIrKytRUVF2dnZAQEDi4uLi4uLk5OTk5OT///+tdFIzAAAALXRSTlMABQgNFBwDNS4mCxEYIyAamisoMS364t9b57qWj3b0s6mec28rJhMNDKemZ2YvJtR9AAACMUlEQVRo3u2ZaW/iMBBAaTDdxI7tOCeF0vvaY/7/39sZJ2BgKyUrxNBKfh+RyHtMJkhJZl+Ja+LqzHjJ53rvTs5OX/Gp/n350DZwZu66h+X7vwmoT5YtMNEuE0w48n/cAiO3H0NB+P2cfioYZhDmD8yEs0ABydsNMHPzllDA4Jd/gJ3fEguGADm/B3bu5xIDhgGoFthpFY2gD5iLBthpxHwbIFUOFyBX8osE4ApYuAAWl4ACaAUuE0BLMAQs4AIsYkAMiAExIAbEgBgQA2JADIgB+wF3wE5zENABO+1+gF0BOytLAdt7ww2ws6F7w93d8Sv/M6LXg9tz8wzMPJsQQFuoH4GVR007uA2gEbz8AkZ+vtAAKMAXSBpB+dQBE91TSQOQ5N+NAAvSzapr4Mw03WqToj8MoN8CX+DSqvoxjQKOKCZ+sapS5/20AeFZsaQCozPn6jodpcLO4tiPH6aj1LVzmTbkl1d9QCgQmGC0zsYpHc6qOPDj73JlNo7WBvVi5w8FiU/IrV2MY2hWabHnT11GRx7H2tzrk+APBZiglJhATqerTIvgL2msuZiAUqgP/lBACYnEiAlgJu1sXQz+mrZK4JEnINFO+utT3prJfmczKiB/1m+V/I+3Zie+N8QGJazJ3Bpg7TJjhUL7ae8Np+Mr+wJdrtel7v3+2DMWqIGuGkG7SNsnaKtZ7McFIrc2F+z+UKAUXVfM/lDg/zr8Rc3tDwUefn9I8PDrQ4Jn9q35C4Ev35B0ZZBdAAAAAElFTkSuQmCC'

      const wanchengData = [180, 119, 155, 101, 65]
      const mubiaoData = [250, 250, 250, 250, 250]

      const colors = [
        ['#389af4', '#dfeaff'],
        ['#ff8c37', '#ffdcc3'],
        ['#ffc257', '#ffedcc'],
        ['#fd6f97', '#fed4e0'],
        ['#a181fc', '#e3d9fe']
      ]
      const option = {
        backgroundColor: '',
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
            text: '门禁出入情况',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: 'a',
            left: '13.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#389af4',
              textAlign: 'center'
            }
          },
          {
            text: 'b',
            left: '31.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#ff8c37',
              textAlign: 'center'
            }
          },
          {
            text: 'c',
            left: '49.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#ffc257',
              textAlign: 'center'
            }
          },
          {
            text: 'd',
            left: '67.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#fd6f97',
              textAlign: 'center'
            }
          },
          {
            text: 'e',
            left: '85.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#a181fc',
              textAlign: 'center'
            }
          }
        ],
        grid: [
          {
            left: '5%',
            top: '5%',
            bottom: '30%',
            right: '5%'
          },
          {
            left: '5%',
            top: '15%',
            bottom: '30%',
            right: '5%'
          }
        ],
        legend: {
          show: false,
          data: ['完成', '目标'],
          align: 'left',
          right: 0,
          textStyle: {
            color: '#434e79',
            fontSize: 14,
            fontWeight: 400
          },
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 35
        },
        tooltip: {
          show: false,
          trigger: 'axis',
          padding: [8, 10],
          textStyle: {
            color: '#fff'
          },
          backgroundColor: 'rgba(0,0,0,0.5)',
          axisPointer: {
            type: 'none'
          }
        },
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: ['A', 'B', 'C', 'D', 'E'],
            axisLine: {
              lineStyle: {
                color: '#E0E2E5'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#434e79',
                fontSize: 16,
                fontWeight: 400
              }
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: ['a', 'b', 'c', 'd', 'e'],
            axisLine: {
              lineStyle: {
                color: '#E0E2E5'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#434e79',
                fontSize: 16,
                fontWeight: 400
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            position: [-20, 0, 0, 0],
            show: true,
            interval: 50,
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E0E2E5'
              }
            }
          },
          {
            type: 'value',
            gridIndex: 1,
            position: [20, 0, 0, 0],
            offset: [-50],
            show: true,
            max: 200,
            interval: 50,
            axisLine: {
              show: false
            },
            axisLabel: {
              padding: [20, 0, 0, 0],
              verticalAlign: 'top',
              // backgroundColor:'red',
              formatter: function (value, index) {
                if (value === 0) {
                  value = ''
                  return value
                } else {
                  return value
                }
              }
            },
            splitLine: {
              lineStyle: {
                color: '#E0E2E5'
              }
            }
          }
        ],
        series: [
          {
            name: '目标',
            type: 'bar',
            max: 250,
            silent: true,
            barMaxWidth: 20,
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol: 'none',
            z: 0,
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,0)'
              }
            },
            data: mubiaoData,
            markLine: {
              symbol: ['none', 'none'],
              symbolSize: 15,
              lineStyle: {
                color: '#E0E2E5'
              },
              label: {
                show: false
              },
              data: [
                {
                  xAxis: 'A'
                },
                {
                  xAxis: 'B'
                },
                {
                  xAxis: 'C'
                },
                {
                  xAxis: 'D'
                },
                {
                  xAxis: 'E'
                }
              ]
            },
            markPoint: {
              symbol: 'circle',
              symbolSize: 15,
              label: {
                show: false
              },
              data: [
                {
                  yAxis: 250,
                  xAxis: 'A',
                  itemStyle: {
                    normal: {
                      color: '#389af4'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'B',
                  itemStyle: {
                    normal: {
                      color: '#ff8c37'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'C',
                  itemStyle: {
                    normal: {
                      color: '#ffc257'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'D',
                  itemStyle: {
                    normal: {
                      color: '#fd6f97'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'E',
                  itemStyle: {
                    normal: {
                      color: '#a181fc'
                    }
                  }
                }
              ]
            }
          },
          {
            name: '完成',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            silent: false,
            barMaxWidth: 20,
            z: 1,
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: (params) => {
                  const colors = ['#dfeaff', '#ffdcc3', '#ffedcc', '#fed4e0', '#e3d9fe']
                  return colors[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'top',
                  distance: 0,
                  color: '#000',
                  fontSize: 16,
                  backgroundColor: {
                    image: icon
                  },
                  padding: [10, 15, 20, 15]
                }
              }
            },
            data: wanchengData,
            emphasis: {
              itemStyle: {
                color: '#389af4'
              }
            }
          },
          {
            // 折线
            data: [120, 75, 100, 80, 45],
            type: 'line',
            smooth: true,

            name: '折线图',
            symbol: 'none',
            lineStyle: {
              color: '#3275FB',
              width: 4,
              shadowColor: 'rgba(0, 0, 0, 0.3)', // 设置折线阴影
              shadowBlur: 5,
              shadowOffsetY: 20
            },
            areaStyle: {
              // 区域填充样式
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(25,163,223,.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(25,163,223, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(25,163,223, 0.5)', // 阴影颜色
                shadowBlur: 20 // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            }
          },
          {
            // piek
            name: 'a',
            type: 'pie',
            xAxisIndex: 2,
            yAxisIndex: 2,
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#82C0F9',
                shadowColor: '#389af4',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: true,
            center: ['14%', '85%'],
            data: [
              {
                value: 54,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#389af4'
                    }
                  }
                }
              },
              {
                value: 46,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#dfeaff'
                  },
                  emphasis: {
                    color: '#dfeaff'
                  }
                }
              }
            ]
          },
          {
            name: 'b',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#FFB379',
                shadowColor: '#ff8c37',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['32%', '85%'],
            data: [
              {
                value: 44,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#ff8c37'
                    }
                  }
                }
              },
              {
                value: 56,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#ffdcc3'
                  },
                  emphasis: {
                    color: '#ffdcc3'
                  }
                }
              }
            ]
          },
          {
            name: 'c',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#FFD184',
                shadowColor: '#ffc257',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['50%', '85%'],
            data: [
              {
                value: 35,
                name: 'c',
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#ffc257'
                    }
                  }
                }
              },
              {
                value: 65,
                name: 'invisible',
                itemStyle: {
                  borderRadius: 7,
                  normal: {
                    color: '#ffedcc'
                  },
                  emphasis: {
                    color: '#ffedcc'
                  }
                }
              }
            ]
          },
          {
            name: 'd',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#FD84A5',
                shadowColor: '#fd6f97',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['68%', '85%'],
            data: [
              {
                value: 30,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },

                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#fd6f97'
                    }
                  }
                }
              },
              {
                value: 70,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#fed4e0'
                  },
                  emphasis: {
                    color: '#fed4e0'
                  }
                }
              }
            ]
          },
          {
            name: 'e',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#C0ACFD',
                shadowColor: '#a181fc',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['86%', '85%'],
            data: [
              {
                value: 20,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#a181fc'
                    }
                  }
                }
              },
              {
                value: 80,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#e3d9fe'
                  },
                  emphasis: {
                    color: '#e3d9fe'
                  }
                }
              }
            ]
          }
        ]
      }
      const chart = this.$echarts.init(this.$refs.inOut)
      chart.setOption(option)
      chart.on('mouseover', (params) => {
        if (params.componentSubType === 'bar' && params.seriesName !== '目标') {
          console.log(option, params.dataIndex)
          const colors = ['#389af4', '#ff8c37', '#ffc257', '#fd6f97', '#a181fc']
          const color = colors[params.dataIndex]
          option.series[1].emphasis.itemStyle.color = color
          const PIEindex = params.dataIndex + 3
          option.series[PIEindex].radius = [60, 70]
          option.series[PIEindex].itemStyle.normal.color = colors[params.dataIndex]
          chart.setOption(option)
        }
      })

      chart.on('mouseout', (params) => {
        if (params.componentSubType === 'bar' && params.seriesName !== '目标') {
          //  console.log(params);
          const colors = ['#82C0F9', '#FFB379', '#FFD184', '#FD84A5', '#C0ACFD']
          option.series[1].itemStyle.normal.label.show = false
          const PIEindex = params.dataIndex + 3
          option.series[PIEindex].radius = [55, 65]
          option.series[PIEindex].itemStyle.normal.color = colors[params.dataIndex]
          chart.setOption(option)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.door {
  // position: relative;
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
    height: 34%;
    &:nth-of-type(1) {
      height: 28%;
    }
    & > div {
      width: 100%;
      height: 100%;
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
  height: 100%;
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
