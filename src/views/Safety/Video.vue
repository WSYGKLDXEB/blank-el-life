<template>
  <div class="video">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇智控</el-breadcrumb-item>
      <el-breadcrumb-item>视频监控</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部轮播 -->
    <el-row class="header" :gutter="16">
      <el-col :span="19">
        <el-card>
          <div class="previewBox" ref="previewBox">
            <!-- 用于遮挡右侧溢出 -->
            <span v-show="isShow"></span>
            <span></span>
            <!-- 左右切换按钮 -->
            <span class="el-icon-arrow-left" @click="previous" v-show="isPrevious"></span>
            <span class="el-icon-arrow-right" @click="next" v-show="isNext"></span>

            <div ref="videoBox" :style="{ left: offsetLeft + 'px' }">
              <video ref="video" class="previewItem" v-for="(item, i) in videoArr" :key="i" data-v-12efe0b2="" :src="item" loop="loop" autoplay="autoplay" muted="muted" @click="enlarge(item)"></video>
            </div>
          </div>
        </el-card>
      </el-col>
      <!-- 图表 -->
      <el-col :span="5">
        <el-card class="state">
          <div ref="state" style="height: 100%"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="monitorBox" :gutter="16">
      <el-col :span="leftSpan">
        <el-card>
          <!-- 图标按钮 -->
          <div class="iconBut" style="width: auto" id="iconBut">
            <i class="el-icon-video-camera iconActive" title="表格"></i>
            <i class="el-icon-s-marketing" title="图表"></i>
          </div>
          <div id="box" class="box">
            <!-- 监控视频 -->
            <div>
              <el-row>
                <!-- 当前观看视频 -->
                <el-col :span="19" class="watchWindow">
                  <video ref="curMonitor" controls :src="curMonitorUrl" loop="loop" autoplay="autoplay" muted="muted"></video>
                </el-col>
                <el-col :span="5" class="operate">
                  <div class="op_time">
                    <div class="time_box">
                      <h1>{{ time }}</h1>
                      <div>
                        <span>{{ week }}</span>
                        <p>{{ years }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="op_header">
                    <div class="header_box">
                      <h4>设备：<span>电梯出入口</span></h4>
                      <p>摄像头信息，摄像头信息，摄像头信息</p>
                    </div>
                  </div>
                  <div class="op_body">
                    <div class="body_box">
                      <div class="direction">
                        <span class="el-icon-caret-left"></span>
                        <span class="el-icon-caret-top"></span>
                        <span class="el-icon-caret-right"></span>
                        <span class="el-icon-caret-bottom"></span>
                      </div>
                      <div class="focal">
                        <el-slider v-model="focalValue"> </el-slider>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 历史记录 -->
            <div>
              <div class="his_header">
                <div style="width: auto">
                  <el-cascader clearable v-model="cascaderValue1" size="small " :options="options" :props="{ expandTrigger: 'hover', checkStrictly: true }"></el-cascader>
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
              <div class="his_body">
                <!-- 表格 -->
                <template v-if="tableData.length !== 0">
                  <el-table stripe max-height="455" :data="tableData" border style="width: 100%">
                    <el-table-column type="index" label="#"> </el-table-column>
                    <el-table-column prop="date" label="日期" width="180"> </el-table-column>
                    <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
                    <el-table-column prop="address" label="地址"> </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="监控" placement="top">
                          <el-button type="success" size="mini" icon="el-icon-video-camera" @click="playMonitor(scope)"></el-button>
                        </el-tooltip>
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
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24 - leftSpan">
        <tree-list isFilter v-show="leftSpan === 19"></tree-list>
        <el-card class="hisMonitorBox" v-show="leftSpan !== 19">
          <video ref="hisMonitor" loop="loop" autoplay="autoplay" controls :src="hisMonitorUrl"></video>

          <div class="monitorInfo">
            <div>
              <h3>{{ formData.name }}</h3>
              <span>{{ formData.date }}</span>
            </div>
            <p>{{ formData.address }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

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
import { CreateChart, CurrentDate } from '@/assets/js/balnk'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankElEcBimRealisticVideo',

  data() {
    return {
      videoArr: [
        require('@/assets/video/cs.mp4'),
        require('@/assets/video/cs.mp4'),
        require('@/assets/video/cs.mp4'),
        require('@/assets/video/cs.mp4'),
        require('@/assets/video/cs.mp4'),
        require('@/assets/video/cs.mp4')
      ],
      // 历史记录监控播放地址
      hisMonitorUrl: null,
      // 监控初始视频
      curMonitorUrl: require('@/assets/video/cs.mp4'),
      // 预览窗口偏移
      offsetLeft: -30,
      // 预览小视频宽度
      monitorWidth: 0,
      // 控制按钮显示与否
      isPrevious: false,
      isNext: true,
      // 控制左侧遮罩层的显示
      isShow: false,
      // 点击次数 => 为解决左侧偏移量问题
      index: 0,
      // 焦距
      focalValue: 0,
      // 级联菜单数据项
      options: [
        {
          value: 'quanbu',
          label: '全部'
        },
        {
          value: 'yilou',
          label: '一楼',
          children: [
            {
              value: 'dating',
              label: '大厅'
            },
            {
              value: 'houtai',
              label: '后台'
            },
            {
              value: 'kufang',
              label: '库房'
            }
          ]
        },
        {
          value: 'erlou',
          label: '二楼',
          children: [
            {
              value: 'dating',
              label: '大厅'
            },
            {
              value: 'houtai',
              label: '后台'
            },
            {
              value: 'kufang',
              label: '库房'
            }
          ]
        },
        {
          value: 'sanlou',
          label: '三楼',
          children: [
            {
              value: 'dating',
              label: '大厅'
            },
            {
              value: 'houtai',
              label: '后台'
            },
            {
              value: 'kufang',
              label: '库房'
            }
          ]
        },
        {
          value: 'silou',
          label: '四楼',
          children: [
            {
              value: 'dating',
              label: '大厅'
            },
            {
              value: 'houtai',
              label: '后台'
            },
            {
              value: 'kufang',
              label: '库房'
            }
          ]
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
      // 级联菜单
      cascaderValue1: 'quanbu',
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
      // 布局所占大小
      leftSpan: 19,
      time: '',
      week: '',
      years: '',
      timeInterVal: null
    }
  },

  mounted() {
    this.init()
    this.monitorWidth = this.$refs.video[0].offsetWidth - 22
    console.log(this.$refs.video[0].offsetWidth)
    this.stateChart()

    this.timeInterVal = setInterval(() => {
      const obj = CurrentDate()
      // console.log(obj)
      this.week = obj.week
      this.years = obj.years
      this.time = obj.time
    }, 1000)
  },

  methods: {
    init() {
      const f = document.querySelectorAll('#iconBut>i')
      const s = document.querySelectorAll('#box>div')

      const f1 = this.$refs.previewBox.offsetWidth + 100
      const s1 = this.$refs.videoBox.offsetWidth
      console.log(f1, s1)
      if (f1 >= s1) {
        this.isNext = false
      }
      this.toggle(f, s)
    },
    // 图标按钮切换
    toggle(f, s, index) {
      if (index >= 0) {
        f.forEach((items) => {
          items.classList.remove('iconActive')
        })
        s.forEach((items) => {
          items.style.display = 'none'
        })
        f[index].classList.add('iconActive')
        s[index].style.display = 'block'
      }
      s[0].style.display = 'block'
      f.forEach((item, i) => {
        item.addEventListener('click', () => {
          if (i === 0) {
            this.leftSpan = 19
            this.hisMonitorUrl = ''
          } else {
            // 设置视频静音
            this.$refs.curMonitor.volume = 0
          }
          f.forEach((items) => {
            items.classList.remove('iconActive')
          })
          s.forEach((items) => {
            items.style.display = 'none'
          })
          item.classList.add('iconActive')
          s[i].style.display = 'block'
        })
      })
    },
    stateChart() {
      const placeHolderStyle = {
        normal: {
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          color: 'rgba(0,0,0,0)',
          borderWidth: 0
        },
        emphasis: {
          color: 'rgba(0,0,0,0)',
          borderWidth: 0
        }
      }
      const option = {
        backgroundColor: '',
        title: [
          {
            text: '设备状态',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '总数',
            left: '15%',
            top: '70%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: 'rgba(184, 240, 252,.8)',
              textAlign: 'center'
            }
          },
          {
            text: '在线',
            left: '50%',
            top: '70%',
            textAlign: 'center',
            textStyle: {
              color: 'rgba(31, 224, 18,.8)',
              fontWeight: 'normal',
              fontSize: '16',
              textAlign: 'center'
            }
          },
          {
            text: '离线',
            left: '85%',
            top: '70%',
            textAlign: 'center',
            textStyle: {
              color: 'rgba(229, 110, 98, .8)',
              fontWeight: 'normal',
              fontSize: '16',
              textAlign: 'center'
            }
          },
          {
            text: '100',
            left: '14%',
            top: '42%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '20',
              color: 'rgba(184, 240, 252,.8)',
              textAlign: 'center'
            }
          },
          {
            text: '88',
            left: '49%',
            top: '42%',
            textAlign: 'center',
            textStyle: {
              color: 'rgba(31, 224, 18,.8)',
              fontWeight: 'normal',
              fontSize: '20',
              textAlign: 'center'
            }
          },
          {
            text: '12',
            right: '6%',
            top: '42%',
            textAlign: 'center',
            textStyle: {
              color: 'rgba(229, 110, 98, .8)',
              fontWeight: 'normal',
              fontSize: '20',
              textAlign: 'center'
            }
          }
        ],
        // tooltip: {
        //   trigger: "item",
        //   formatter: '{a}'
        // },

        series: [
          // 第1个图表
          {
            type: 'pie',
            hoverAnimation: true, // 鼠标经过的特效
            radius: ['35%', '60%'],
            center: ['16%', '50%'],
            startAngle: 225,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                position: 'center'
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: 'rgba(200,200,200,0.15)'
                  }
                }
              },
              {
                value: 35,
                itemStyle: placeHolderStyle
              }
            ]
          },
          // 上层环形配置
          {
            type: 'pie',
            hoverAnimation: true, // 鼠标经过的特效
            radius: ['35%', '60%'],
            center: ['16%', '50%'],
            startAngle: 225,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              position: 'center',
              formatter: '{c}'
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'rgba(255,255,255,.1)' // 0% 处的颜色
                        },
                        {
                          offset: 0.7,
                          color: '#b8f0fc' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  }
                },
                label: {
                  formatter: '{c}',
                  position: 'center',
                  show: false,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'normal',
                    color: '#b8f0fc'
                  }
                }
              },
              {
                value: 35,
                itemStyle: placeHolderStyle
              }
            ]
          },

          // 第2个图表
          {
            type: 'pie',
            hoverAnimation: true,
            radius: ['35%', '60%'],
            center: ['50%', '50%'],
            startAngle: 225,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                position: 'center'
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: 'rgba(200,200,200,0.15)'
                  }
                }
              },
              {
                value: 35,
                itemStyle: placeHolderStyle
              }
            ]
          },

          // 上层环形配置
          {
            type: 'pie',
            hoverAnimation: true,
            radius: ['35%', '60%'],
            center: ['50%', '50%'],
            startAngle: 225,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                position: 'center'
              }
            },
            data: [
              {
                value: 88,
                itemStyle: {
                  normal: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0.4,
                      x2: 1,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'rgba(255,255,255,.1)' // 0% 处的颜色
                        },
                        {
                          offset: 0.8,
                          color: 'rgba(31, 224, 18, .8)' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  }
                },
                label: {
                  formatter: '{c}',
                  position: 'center',
                  show: false,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'normal',
                    color: 'rgba(31, 224, 18,.6)'
                  }
                }
              },
              {
                value: 55,
                itemStyle: placeHolderStyle
              }
            ]
          },
          // 第3个图表
          {
            type: 'pie',
            hoverAnimation: true, // 鼠标经过的特效
            radius: ['35%', '60%'],
            center: ['84%', '50%'],
            startAngle: 225,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              normal: {
                position: 'center'
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  normal: {
                    color: 'rgba(200,200,200,0.15)'
                  }
                }
              },
              {
                value: 35,
                itemStyle: placeHolderStyle
              }
            ]
          },
          // 上层环形配置
          {
            type: 'pie',
            hoverAnimation: true, // 鼠标经过的特效
            radius: ['35%', '60%'],
            center: ['84%', '50%'],
            startAngle: 225,
            labelLine: {
              normal: {
                show: false
              }
            },
            label: {
              show: true,
              position: 'center'
            },
            data: [
              {
                value: 12,
                itemStyle: {
                  normal: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 1,
                      x2: 0.2,
                      y2: 0,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'rgba(255,255,255,.1)' // 0% 处的颜色
                        },
                        {
                          offset: 0.6,
                          color: 'rgba(229, 110, 98, .8)' // 100% 处的颜色
                        }
                      ],
                      global: false // 缺省为 false
                    }
                  }
                },
                label: {
                  formatter: '{c}',
                  position: 'center',
                  show: false,
                  textStyle: {
                    fontSize: '20',
                    fontWeight: 'normal',
                    color: 'rgba(229, 110, 98, .8)'
                  }
                }
              },
              {
                value: 35,
                itemStyle: placeHolderStyle
              }
            ]
          }
        ]
      }
      CreateChart(this.$refs.state, option)
    },
    // 点击预览获取链接
    enlarge(item) {
      // 切换页面
      const f = document.querySelectorAll('#iconBut>i')
      const s = document.querySelectorAll('#box>div')
      this.toggle(f, s, 0)
      // 恢复初始布局
      this.leftSpan = 19
      this.hisMonitorUrl = ''
      // 链接赋值
      this.curMonitorUrl = null
      this.curMonitorUrl = item
    },
    // 上一个
    previous() {
      this.index = this.index - 1
      this.offsetLeft += this.monitorWidth
      this.isNext = true
      this.$nextTick(() => {
        const i = Number(this.$refs.videoBox.style.left.slice(0, -2))
        if (i === 0) {
          this.isPrevious = false
          this.isShow = false
          this.offsetLeft = -30
        }
        console.log(i)
      })
    },
    // 下一个
    next() {
      if (this.index === 0) {
        this.offsetLeft = this.offsetLeft - this.monitorWidth + 30 // 初始偏移量
      } else {
        this.offsetLeft = this.offsetLeft - this.monitorWidth
      }
      this.index = this.index + 1
      this.isPrevious = true
      this.isShow = true
      this.$nextTick(() => {
        const i = Number(this.$refs.videoBox.style.left.slice(0, -2))
        const j = -(this.$refs.videoBox.offsetWidth - this.$refs.previewBox.offsetWidth)
        console.log(i, j)
        if (i <= j) {
          this.isNext = false
        }
      })
    },
    // 查询
    search() {
      if (!this.datePickerValue || !this.cascaderValue1) {
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
    // 播放历史监控
    playMonitor(item) {
      this.formData = item.row
      this.leftSpan = 14
      this.hisMonitorUrl = require('@/assets/video/cs.mp4')
    }
  }
}
</script>

<style lang="less" scoped>
.video {
  width: 100%;
  height: 100%;
}
.header {
  height: 22%;
  /deep/.el-card__body {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
// 预览
.previewBox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  span {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 90%;
    width: 24px;
    color: #fff;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    &::before {
      position: relative;
      top: 46%;
      transform: translateY(-100%);
    }
    &:hover {
      background-color: #ccc;
    }
  }
  span:nth-of-type(1) {
    z-index: 98;
    width: 46px;
    left: 0;
    background-color: #fff;
  }
  span:nth-of-type(2) {
    z-index: 98;
    width: 46px;
    right: 0;
    background-color: #fff;
  }
  span:nth-of-type(3) {
    z-index: 99;
    left: 15px;
    border-radius: 10px 0 0 10px;
  }
  span:nth-of-type(4) {
    z-index: 99;
    right: 15px;
    border-radius: 0 10px 10px 0;
  }

  & > div {
    position: absolute;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 30px;
    transition: all 0.3s;
  }
  .previewItem {
    cursor: pointer;
    margin-left: 15px;
    height: 100%;
    border-radius: 6px;
    transition: all 0.3s;
    &:hover {
      transform: translate(-1px, -1px);
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    }
  }
}
// 历史监控视频
.hisMonitorBox {
  video {
    width: 100%;
    border-radius: 6px;
  }
  .monitorInfo {
    & > div {
      display: flex;
      align-items: center;
    }
    h3 {
      margin: 10px 0;
    }
    span {
      margin-left: 10px;
    }
  }
}
.monitorBox {
  margin-top: 1%;
  height: 72%;
  // 图标按钮
  .iconBut {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 99;
    i {
      cursor: pointer;
      font-size: 20px;
      color: #999;
      border: 1px solid #bbb;
      &:nth-of-type(1) {
        padding: 1px;
        font-size: 18px;
      }
      &:nth-of-type(2) {
        margin: 0 3px;
      }
    }
  }
  .iconActive {
    color: #9df3c4 !important;
    border-color: #9df3c4 !important;
  }
  // 历史记录
  .his_header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    margin: -5px 0 20px;
    border-bottom: 1px solid #ebeef5;
    .el-button {
      height: 28px;
      margin-right: 6em;
    }
  }
  .his_body {
    position: relative;
    height: 90%;
    // 分页定位
    .el-pagination {
      position: absolute;
      bottom: 0;
    }
    // 空状态定位
    .el-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .box {
    width: 100%;
    height: 100%;
    & > div {
      width: 100%;
      height: 100%;
      display: none;
    }
  }
  /deep/.el-card__body {
    height: 100%;
  }
  .el-row {
    width: 100%;
    height: 100%;
    .el-col {
      height: 100%;
      transition: all 0.6s;
    }
  }
  // 右侧操作
  .operate {
    padding-left: 40px;
    display: flex;
    flex-flow: column;
    justify-content: flex-end;
    .op_time {
      position: relative;
      width: 100%;
      height: 15%;
      margin-bottom: 20px;
      box-sizing: border-box;
      border: 1px dashed rgba(64, 158, 255, 0.8);
      background: rgba(64, 158, 255, 0.1);
      border-radius: 6px;
      transition: all 0.3s;
      .time_box {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 10px;
        left: 10px;
        transition: all 0.3s;

        background: rgba(185, 210, 240, 1);
        border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        & > div {
          color: rgba(64, 158, 255, 0.8);
          margin-left: 6px;
          font-size: 12px;
        }
        h1 {
          color: rgba(64, 158, 255, 0.6);
          transition: all 0.3s;
        }
        p {
          margin: 0;
        }
      }
    }
    .op_header {
      position: relative;
      display: flex;
      justify-content: flex-end;
      padding-bottom: 15px;

      width: 100%;
      height: 34%;
      margin-bottom: 20px;
      box-sizing: border-box;
      border: 1px dashed rgba(64, 158, 255, 0.8);
      background: rgba(64, 158, 255, 0.1);
      border-radius: 6px;
      transition: all 0.3s;
      .header_box {
        padding: 30px 10px 10px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 10px;
        left: 10px;
        transition: all 0.3s;
        background: rgba(185, 210, 240, 1);
        border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      }
    }
    .op_body {
      position: relative;
      width: 100%;
      height: 34%;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      align-items: flex-end;
      border: 1px dashed rgba(64, 158, 255, 0.8);
      background: rgba(64, 158, 255, 0.1);
      border-radius: 6px;
      transition: all 0.3s;
      // &:hover {
      //   border: 1px dashed rgba(64, 158, 255, 0.8);
      //   background: rgba(64, 158, 255, 0.1);
      //   .body_box {
      //     background: rgba(185, 210, 240, 1);
      //     border-radius: 6px;
      //     box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      //     transform: translate(10px, -10px);
      //   }
      //   .direction {
      //     background-color: rgba(150, 185, 220, 0.8);
      //     span {
      //       background-color: rgba(150, 185, 220, 1);
      //     }
      //   }
      //   .focal {
      //     background-color: rgba(150, 185, 220, 1);
      //   }
      // }
      .body_box {
        padding: 30px 10px 10px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        position: absolute;
        bottom: 10px;
        left: 10px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
        align-items: flex-end;
        transition: all 0.3s;
        background: rgba(185, 210, 240, 1);
        border-radius: 6px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
        p {
          width: 100%;
          text-align: left;
          // background-image: -webkit-linear-gradient(270deg, #fff, rgba(185, 210, 240, 1));
          // -webkit-background-clip: text;
          // -webkit-text-fill-color: transparent;
        }
      }
      .direction {
        position: relative;
        right: 50%;
        transform: translateX(50%);
        width: 86px;
        height: 86px;
        z-index: 98;
        border-radius: 50%;
        background-color: rgba(150, 185, 220, 0.8);
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
        // background-color: rgba(228, 231, 237, 1);
        // &::after {
        //   content: '';
        //   position: absolute;
        //   top: 50%;
        //   left: 50%;
        //   transform: translate(-50%, -50%);
        //   z-index: -1;
        //   width: 120%;
        //   height: 120%;
        //   border-radius: 50%;
        //   background: rgba(255, 255, 255, 0.25);
        //   box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3) !important;
        // }
        span {
          cursor: pointer;
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 99;
          line-height: 20px;
          text-align: center;
          color: #fff;
          font-size: 20px;
          box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
          background-color: rgba(150, 185, 220, 1);
          // background-color: rgba(0, 0, 0, 0.1);
        }
        span:nth-of-type(1) {
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          &:active {
            transform: translateY(-50%) translateX(-1px);
          }
        }
        span:nth-of-type(2) {
          left: 50%;
          top: 8px;
          transform: translateX(-50%);
          &:active {
            transform: translateX(-50%) translateY(-1px);
          }
        }
        span:nth-of-type(3) {
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          &:active {
            transform: translateY(-50%) translateX(1px);
          }
        }
        span:nth-of-type(4) {
          left: 50%;
          bottom: 8px;
          transform: translateX(-50%);
          &:active {
            transform: translateX(-50%) translateY(1px);
          }
        }
      }
      .focal {
        position: relative;
        padding-left: 15px;
        padding-right: 10px;
        width: 100%;
        height: 30px;
        border-radius: 6px;
        box-sizing: border-box;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
        background-color: rgba(150, 185, 220, 1);
        .el-slider {
          // position: absolute;
          // top: 50%;
          // left: 0;
          // transform: translateY(-50%);
        }
        /deep/.el-slider__runway {
          margin: 12px 0;
        }
        /deep/.el-slider__button {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
}
// 当前观看视频
.watchWindow {
  position: relative;
  padding-left: 0 !important;
  height: 100%;
  overflow: hidden;
  border-radius: 6px;
  video {
    position: absolute;
    left: 0x;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    border-radius: 6px;
  }
}
.el-tag {
  margin: 15px 0;
}
.el-col {
  height: 100%;
  transition: all 0.6s;
}

.el-card {
  width: 100%;
  height: 100%;
  .el-card__body {
    height: 100%;
  }
}
</style>
