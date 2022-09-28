<template>
  <div class="exhibit">
    <!-- 头部 -->
    <div class="header">
      <!-- 时间日期 -->
      <div class="timeDate text">
        <h1>{{ time }}</h1>
        <div>
          <span>{{ week }}</span>
          <p>{{ years }}</p>
        </div>
      </div>
      <!-- 天气 -->
      <div class="weather">
        <img src="../assets/image/晴.png" alt="" srcset="" />
        <span>晴 30℃</span>
      </div>
      <span class="text">中国人寿智能化平台</span>
      <!-- 全屏 -->
      <i class="fullScreen el-icon-full-screen" @click="fullScreen"></i>
      <!-- 用户管理 -->
      <i class="el-icon-user-solid user" @click="$router.push('/user')"></i>
      <!-- 权限 -->
      <i v-show="false" class="permission iconfont icon-quanxian" @click="$router.push('/authorit')"></i>
      <!-- 退出登录 -->
      <i class="iconfont icon-tuichubianji quit" @click="quit"></i>
    </div>
    <div class="body between">
      <div class="left hidden">
        <div class="title">电梯运行时间</div>
        <div class="row_1 float" ref="elevator" @click="$router.push('/stairs')"></div>
        <div class="title">7日报警数量趋势</div>
        <div class="row_2 alarm float" ref="alarm" @click="$router.push('/alarm')"></div>
        <!-- 停车场 -->
        <div class="title">停车位监测</div>
        <div class="row_3 park float between column" @click="$router.push('/parking')">
          <div class="chart" ref="park" style=""></div>
          <div class="table" style="">
            <div class="table_h between">
              <span>车牌</span>
              <span>车型</span>
              <span>车位</span>
              <span>时长</span>
            </div>
            <div class="table_b hidden" ref="tableList">
              <div class="tableItem between" v-for="(item, i) in parkData" :key="i">
                <span>{{ item.id }}</span>
                <span>{{ item.name }}</span>
                <span>{{ item.location }}</span>
                <span>{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="center hidden">
        <!-- 自定义模块 -->
        <!-- 地图 -->
        <div class="title_c">地理位置</div>
        <div class="customize">
          <map-box darkNight v-show="true"></map-box>
        </div>
        <!-- 按钮组 -->
        <div class="butGroup between">
          <span v-for="(item, i) in butGroup" :key="i" @click="$router.push(item.path)"
            ><i class="text">{{ item.label }}</i></span
          >
        </div>
        <!-- 视频监控 -->
        <div class="title_c">视频监控</div>
        <div class="monitor float between" @click="$router.push('/video')">
          <!-- 左右切换按钮 -->
          <span class="el-icon-arrow-left arrow" @click.stop="previous"></span>
          <span class="el-icon-arrow-right arrow" @click.stop="next"></span>
          <div class="videoToggle">
            <div class="videoBox between hidden" ref="">
              <video v-for="i in 6" :key="i" @click="$router.push('/video')" ref="curMonitor" :src="monitorUrl" loop="loop" autoplay="autoplay" muted="muted"></video>
            </div>
          </div>

          <div class="control hidden between">
            <span v-for="i in 10" :key="i">监控-{{ i }}</span>
          </div>
        </div>
      </div>
      <div class="right hidden">
        <!-- 设备 -->
        <div class="title">设备状态</div>
        <div class="row_1 float" @click="$router.push('/equipment')">
          <div class="equipment">
            <span>总数<br /><i class="text">100</i></span>
            <div class="bubble_t">维修<br /><i class="text">6</i></div>
            <div class="bubble_l">运行<br /><i class="text">74</i></div>
            <div class="bubble_rt">故障<br /><i class="text">4</i></div>
            <div class="bubble_rb">保养<br /><i class="text">16</i></div>
          </div>
        </div>

        <div class="title">三相电压走势图</div>
        <div class="row_2 float" ref="voltage" @click="$router.push('/configEle')"></div>
        <div class="title">门禁监测</div>
        <div class="float row_3 between column" style="align-items: flex-start">
          <div class="access" ref="access"></div>
          <div class="timeline hidden between">
            <div class="timelineItem" v-for="(activity, index) in activities" :key="index">
              <div class="timelineTail">
                <span>{{ activity.timestamp }}</span>
              </div>
              <div class="hidden timelineBox">
                <p v-for="(item, i) in activity.content" :key="i">{{ item }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CurrentDate, CreateChart, grid, color, colorArr, textColor, hex2Rgba, PrefixInteger } from '@/assets/js/blank'
export default {
  name: 'BlankElLifeExhibit',

  data() {
    return {
      parkData: [],
      // 滚动条
      nowScroll: 0,
      monitorUrl: require('@/assets/video/cs.mp4'),
      activities: [
        {
          content: [],
          timestamp: '2022-04-15'
        },
        {
          content: [],
          timestamp: '2022-04-13'
        },
        {
          content: [],
          timestamp: '2022-04-11'
        }
      ],
      butGroup: [
        { label: '设备管理', path: '/equipment' },
        { label: '视频监控', path: '/video' },
        { label: '入侵报警', path: '/alarm' },
        { label: '火灾报警', path: '/fire' },
        { label: '高压配电', path: '/configEle' },
        { label: '停车管理', path: '/parking' },
        { label: '能源管理', path: '/energy' },
        { label: '门禁管理', path: '/door' },
        { label: '梯控管理', path: '/stairs' }
      ],
      time: '',
      week: '',
      years: ''
    }
  },

  mounted() {
    this.getParkData()
    this.getInfo()
    this.elevatorChart()
    this.parkChart()
    this.alarmChart()
    // this.waterChart()
    // this.elecChart()
    this.voltageChart()
    this.accessChart()
    this.timeInterVal = setInterval(() => {
      const obj = CurrentDate()
      // console.log(obj)
      this.week = obj.week
      this.years = obj.years
      this.time = obj.time
    }, 1000)
  },

  methods: {
    fullScreen() {
      // 网页全屏
      const el = document.documentElement
      ;(el.requestFullscreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen).call(el)
      // return this.$message.info('按‘Esc’或‘F11’键退出全屏！')
    },
    quit() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
      // 退出全屏
      // 兼容各个浏览器退出全屏方法
      ;(document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen).call(document)
    },
    // 上一个
    previous() {
      console.log('s')
    },
    // 下一个
    next() {
      console.log('sf')
    },
    // 自动滚动
    autoRoll(dom) {
      let nowScroll = dom.scrollTop
      console.log(dom.scrollTop, dom.clientHeight, dom.scrollHeight)
      let timer = setInterval(function () {
        nowScroll += 1 // 当前代表元素的滚动条位置的变量   开始减
        if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
          nowScroll = 0
        }
        dom.scrollTo(0, nowScroll)
        // console.log(dom.scrollTop, dom.clientHeight, dom.scrollHeight)
      }, 80)
      // 事件
      dom.onmouseover = () => {
        clearInterval(timer)
      }
      dom.onmouseout = () => {
        timer = setInterval(function () {
          nowScroll += 1 // 当前代表元素的滚动条位置的变量   开始减
          if (dom.scrollTop + dom.clientHeight >= dom.scrollHeight) {
            nowScroll = 0
          }
          dom.scrollTo(0, nowScroll)
          // console.log(dom.scrollTop, dom.clientHeight, dom.scrollHeight)
        }, 100)
      }
    },
    getParkData() {
      const types = ['车型一', '车型二', '车型三', '车型四', '车型五']
      for (let i = 0; i < 30; i++) {
        const obj = {
          id: '#XXXXXX',
          name: types[Math.floor(Math.random() * types.length)],
          time: Math.floor(Math.random() * 24),
          location: '停车位' + Math.floor(Math.random() * 24)
        }
        this.parkData.push(obj)
      }
      this.autoRoll(this.$refs.tableList)
    },
    getInfo() {
      const arr = ['进入', '出去']
      this.activities.forEach((item) => {
        for (let i = 0; i < 30; i++) {
          const str = `工号00${PrefixInteger(Math.floor(Math.random() * 100), 3)}0今日${PrefixInteger(Math.floor(Math.random() * 24), 2)}时${arr[Math.floor(Math.random() * 2)]}公司`
          item.content.push(str)
        }
      })
    },
    // 电梯
    elevatorChart() {
      const seriesData = [
        { name: '6#消防', value: PrefixInteger(Math.floor(Math.random() * 5) + 1, 2) },
        { name: '5#电梯', value: PrefixInteger(Math.floor(Math.random() * 6) + 1, 2) },
        { name: '4#电梯', value: PrefixInteger(Math.floor(Math.random() * 8) + 1, 2) },
        { name: '3#电梯', value: PrefixInteger(Math.floor(Math.random() * 4) + 1, 2) },
        { name: '2#电梯', value: PrefixInteger(Math.floor(Math.random() * 12) + 1, 2) },
        { name: '1#电梯', value: PrefixInteger(Math.floor(Math.random() * 14) + 1, 2) }
      ]
      const color = ['#5cc8d5', '#41b597', '#dce4e6', '#46bab1', '#d17f82', '#ba9733']
      const option = {
        tooltip: {
          trigger: 'item'
        },
        color,
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
              }
            }
          },
          // data: legend,
          formatter: (name) => {
            if (seriesData.length) {
              const item = seriesData.filter((item) => item.name === name)[0]
              return `{name|${name}：}{value| ${item.value}时}`
            }
          }
        },
        series: [
          {
            name: '电梯运行时间',
            type: 'pie',
            center: ['24%', '50%'],
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
              borderColor: '#03111e',
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

      CreateChart(this.$refs.elevator, option, 'highlight')
    },
    // 停车场
    parkChart() {
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
        grid: {
          ...grid,
          bottom: '-15%',
          left: '4%',
          right: '8%'
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
              show: false,
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
                color: 'rgba(255,255,255, .1)'
              }
            },

            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255, .1)'
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

      CreateChart(this.$refs.park, option, 'showTip')
    },
    // 报警
    alarmChart() {
      const bgColor = ''
      const color = ['#0090FF', '#36CE9E', '#FFC005', '#FF515A', '#8B5CFF', '#00CA69']
      const echartData = [
        {
          name: 'Mon',
          value1: 100,
          value2: 233
        },
        {
          name: 'Tue',
          value1: 138,
          value2: 233
        },
        {
          name: 'Wed',
          value1: 350,
          value2: 200
        },
        {
          name: 'Thu',
          value1: 173,
          value2: 180
        },
        {
          name: 'Fri',
          value1: 180,
          value2: 199
        },
        {
          name: 'Sat',
          value1: 150,
          value2: 233
        },
        {
          name: 'Sun',
          value1: 180,
          value2: 210
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
                次`
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
        grid: {
          ...grid,
          // bottom: '-15%',
          left: '0',
          right: '8%',
          top: '14%'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
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
                // type: 'dashed',
                color: 'rgba(255,255,255, .1)'
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
            name: '入侵',
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
            name: '火灾',
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

      CreateChart(this.$refs.alarm, option, 'showTip')
      // chartDynamicShow(this.$refs.alarm, option_err, 1000)
    },
    waterChart() {
      const option = {
        color: '#49afff',
        backgroundColor: '',
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
        grid: {
          ...grid,
          // bottom: '-15%',
          left: '0',
          right: '8%',
          top: '8%'
        },
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
                color: 'rgba(255,255,255, .1)'
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
                color: 'rgba(255,255,255, .1)'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255, .1)'
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
            data: [50, 88, 166, 240, 360, 300, 280],
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
                    color: '#49afff'
                  },
                  {
                    offset: 1,
                    color: hex2Rgba('#49afff', 0.1)
                  }
                ])
            }
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
              color: '#49afff'
            }
          }
        ]
      }
      CreateChart(this.$refs.water, option, 'showTip')
    },
    elecChart() {
      const option = {
        color: '#46bab1',
        backgroundColor: '',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#283b56'
            }
          }
        },
        grid: {
          ...grid,
          // bottom: '-15%',
          left: '0',
          right: '8%',
          top: '8%'
        },
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
                color: 'rgba(255,255,255, .1)'
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
                color: 'rgba(255,255,255, .1)'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'rgba(255,255,255, .1)'
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
            data: [240, 150, 200, 300, 360, 330, 220],
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
                    color: '#22c3aa'
                  },
                  {
                    offset: 1,
                    color: hex2Rgba('#22c3aa', 0.1)
                  }
                ])
            }
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
              color: '#22c3aa'
            }
          }
        ]
      }
      CreateChart(this.$refs.elec, option, 'showTip')
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
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'none',
          padding: 5,
          formatter: function (param) {
            let resultTooltip = ''
            resultTooltip =
              "<div style='background:rgba(255,255,255,1);border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;'>" +
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
        grid: {
          ...grid,
          // bottom: '-15%',
          left: '0',
          right: '8%',
          top: '14%'
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
                color: 'rgba(255,255,255, .1)'
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
                shadowColor: '#03111e',
                // shadowColor: '#0099ff',
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
                shadowColor: '#03111e',
                // shadowColor: '#66ff66',
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
                shadowColor: '#03111e',
                // shadowColor: '#fa676c',
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

      CreateChart(this.$refs.voltage, option, 'showTip')
    },
    // 门禁
    accessChart() {
      const option = {
        backgroundColor: '',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          ...grid,
          bottom: '0',
          left: '0',
          right: '8%'
        },
        xAxis: {
          type: 'category',
          data: ['0点到3点', '3点到6点', '6点到9点', '9点到12点', '12点到15', '15点到18点', '18点到21点', '21点到24点'],
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,.1)'
            }
            // textStyle: {
            //   color: '#b8f0fc'
            // }
          },
          axisLabel: {
            // interval: 0,
            // rotate: 40,
            textStyle: {
              color: '#b8f0fc'
            }
          }
        },

        yAxis: {
          type: 'value',
          max: '150',
          axisLine: {
            show: false,
            lineStyle: {
              color: 'white'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          axisLabel: {
            textStyle: {
              color: '#b8f0fc'
            }
          }
        },
        series: [
          {
            name: '外出人员',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#ff999a'
                  },
                  {
                    offset: 1,
                    color: hex2Rgba('#ff999a', 0.1)
                  }
                ]),
                barBorderRadius: 12
              }
            },
            data: [10, 30, 40, 120, 50, 90, 60, 40, 15]
          },
          {
            name: '进入人员',
            type: 'bar',
            barWidth: '15%',
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: '#22c3aa'
                  },
                  {
                    offset: 1,
                    color: hex2Rgba('#22c3aa', 0.1)
                  }
                ]),
                barBorderRadius: 11
              }
            },
            data: [5, 40, 60, 110, 40, 100, 70, 50, 20]
          }
        ]
      }

      CreateChart(this.$refs.access, option, 'showTip')
    }
  }
}
</script>

<style lang="less" scoped>
.exhibit {
  width: 100vw;
  height: calc(100vw * 9 / 16);
  background: url('../assets/image/bg1.png');
  background-size: 100% 100%;
  // font-size: calc(100vw / 19.2);
  // -----------------------------------
  // --fc-theme: rgba(136, 215, 237, 0.8);
  --fc-theme: #bde2f3;
}
// 悬浮效果
.float {
  cursor: pointer;
  &:hover {
    animation: breathe 3s infinite linear;
  }
}
.header {
  position: relative;
  // 点击穿透
  pointer-events: none;
  width: 100%;
  height: 1rem;
  background: url('../assets/image/header.png') 8px center;
  background-size: 100% 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fc-theme);

  & > span {
    margin-top: -20px;
    font-size: 0.32em;
    font-weight: 700;
    background-image: -webkit-linear-gradient(270deg, #fff, #01deff) !important;
    // background-image: -webkit-linear-gradient(270deg, #8deffa, #01deff) !important;
  }
  .timeDate {
    position: absolute;
    top: -0.05rem;
    left: 0.4rem;
    height: 100%;
    font-size: 0.16rem;
    display: flex;
    align-items: center;
    color: var(--fc-theme);
    & > div {
      // color: rgba(64, 158, 255, 0.8);
      margin-left: 6px;
      font-size: 12px;
    }
    h1 {
      // color: rgba(64, 158, 255, 0.6);
      transition: all 0.3s;
    }
    p {
      margin: 0;
    }
  }
  .weather {
    position: absolute;
    top: -0.05rem;
    left: 3rem;
    display: flex;
    align-items: center;
    height: 100%;

    img {
      height: 0.34rem;
    }
    span {
      margin-left: 0.16rem;
      opacity: 0.8;
      font-size: 0.16rem;
    }
  }
  i {
    pointer-events: auto;
    cursor: pointer;
    position: absolute;
    margin-top: -0.1rem;
    font-size: 0.16rem;
  }
  .fullScreen {
    right: 1.15rem;
  }
  .permission {
    right: 1.1rem;
  }
  .user {
    right: 0.8rem;
  }
  .quit {
    right: 0.4rem;
  }
}

.body {
  padding: 0 0.15rem;
  margin-top: 0.1rem;
  height: calc(100% - 1.3rem);
  width: 100%;
  box-sizing: border-box;
  color: var(--fc-theme);
  font-weight: 500;
  & > div {
    height: 100%;
    // border: 1px dashed salmon;
  }
  .left {
    & > div:not(.title) {
      box-sizing: border-box;
      padding-left: 0.2rem;
      width: 98%;
    }
    width: 20%;
    .park {
      // padding-left: 0.1rem;
      align-items: flex-start;
      .chart {
        width: 100%;
        height: 1.2rem;
        // height: 20%;
      }
      .table {
        height: calc(98% - 1.2rem);
        width: 94%;
        font-size: 0.14rem;
        & > div {
          box-sizing: border-box;
        }
      }
      span {
        width: 25%;
        text-align: center;
      }
      .table_h {
        // padding-left: 0.2rem;
        width: 100%;
        line-height: 0.28rem;
        background: rgba(255, 255, 255, 0.15);
        border-bottom: 2px solid #46bab1;
      }
      .table_b {
        height: calc(100% - 0.28rem);
        // height: calc(100vh - 7.9rem);
        // border: #01deff dashed 1px;
        transition: all 0.1s;
      }
      .tableItem {
        cursor: pointer;
        // padding-left: 0.2rem;
        line-height: 0.28rem;
        transition: all 0.3s;
        &:nth-of-type(2n) {
          background: rgba(255, 255, 255, 0.15);
        }
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
  .center {
    width: 55%;
    .customize {
      margin-top: 0.05rem;
      // height: 6.15rem;
      height: calc((100% - 0.8rem) * 0.78);
    }
    .butGroup {
      width: 100%;
      height: calc((100% - 0.8rem) * 0.08);
      font-size: 0.16rem;
      span {
        cursor: pointer;
        height: 0.3rem;
        line-height: 0.3rem;
        text-align: center;
        width: 1rem;
        background: url('../assets/image/butGroup.png');
        background-size: 1rem 0.3rem;
        // background-image: -webkit-linear-gradient(270deg, #fff, #01deff) !important;
      }
      i {
        font-style: normal;
      }
    }
    .monitor {
      position: relative;
      padding-left: 0.35rem;
      margin-top: 0.05rem;
      // height: calc(100vh - 6.2rem);
      height: calc((100% - 0.8rem) * 0.14);
      & > div {
        box-sizing: border-box;
        // border: 1px dashed salmon;
        height: 100%;
      }
      .arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        font-size: 0.2rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        width: 0.3rem;
        background-color: #04253c;
        overflow: auto !important;
      }
      .el-icon-arrow-left {
        left: 0rem;
        border-radius: 6px 0 0 6px;
        &:active {
          transform: translate(-1px, -50%);
        }
      }
      .el-icon-arrow-right {
        left: calc(80% + 0.15rem);
        border-radius: 0 6px 6px 0;
        &:active {
          transform: translate(1px, -50%);
        }
      }
      .videoToggle {
        width: 80%;
        position: relative;

        .videoBox {
          height: 100%;
        }
        video {
          // padding: 0.05rem;
          height: 1rem;
          // width: 76%;
          border-radius: 0.04rem;
          border: 2px solid transparent;
          position: relative;
          transition: all 0.3s;
          &::before {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            content: '';
            width: 105%;
            height: 105%;
            border: 1px solid #01deff;
          }
          &:hover {
            z-index: 1;
            transform: translateY(-1px) scale(1.01);
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
          }
        }
      }
      .control {
        height: 70%;
        width: 10%;
        // border-left: rgba(255, 255, 255, 0.1) 1px solid;
        box-sizing: border-box;
        flex-flow: column nowrap;
        span {
          cursor: pointer;
          width: 0.98rem;
          font-size: 0.14rem;
          line-height: 0.3rem;
          text-align: center;
          margin-bottom: 0.1rem;
          background: url('../assets/image/but.png');
          &:hover {
            background: url('../assets/image/but-active.png') !important;
          }
        }
      }
    }
  }
  .right {
    width: 20%;
    & > div:not(.title) {
      box-sizing: border-box;
      padding-left: 0.2rem;
      width: 98%;
    }
    .row_1 {
      cursor: pointer;
      // height: 2rem;
      font-size: 0.14rem;
      text-align: center;
      span {
        position: absolute;
        top: 53%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      i {
        text-align: center;
        font-style: normal;
        font-weight: 700;
        font-size: 0.18rem;
        // font-size: 0.26rem;
        // font-family: 'electronicFont';
        color: var(--fc-theme);
        background-image: -webkit-linear-gradient(270deg, #fff, #01deff) !important;
      }
      .equipment {
        background: url('../assets/image/bubble.png') no-repeat center 60%;
        background-size: 1.18rem 1.18rem;
        position: relative;
        width: 100%;
        height: 100%;
        &::before {
          width: 0.7rem;
          height: 0.7rem;
          content: '';
          position: absolute;
          top: 54%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: url('../assets/image/bubble2.png') no-repeat center center;
          background-size: 100% 100%;
        }
        & > div {
          box-sizing: border-box;
        }
        .bubble_t {
          position: absolute;
          top: 3%;
          left: 48%;
          width: 0.5rem;
          height: 0.5rem;
          padding-top: 0.08rem;
          background: url('../assets/image/bubble4.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .bubble_l {
          position: absolute;
          position: absolute;
          top: 50%;
          left: 12%;
          transform: translateY(-50%);
          width: 0.7rem;
          height: 0.7rem;
          // line-height: 0.7rem;
          padding-top: 0.16rem;

          background: url('../assets/image/bubble1.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .bubble_rt {
          position: absolute;
          position: absolute;
          top: 20%;
          right: 12%;
          width: 0.46rem;
          height: 0.46rem;
          padding-top: 0.05rem;
          background: url('../assets/image/bubble5.png') no-repeat center center;
          background-size: 100% 100%;
        }
        .bubble_rb {
          position: absolute;
          position: absolute;
          bottom: 0;
          right: 20%;
          width: 0.54rem;
          height: 0.54rem;
          padding-top: 0.08rem;
          background: url('../assets/image/bubble3.png') no-repeat center center;
          background-size: 100% 100%;
        }
      }
    }
    // 门禁
    .access {
      width: 100%;
      height: 1.2rem;
    }
    .timeline {
      box-sizing: border-box;
      flex-flow: column nowrap;
      padding: 0.05rem;
      // height: calc(100vh - 7.6rem);
      height: calc(96% - 1.2rem);
      font-size: 0.14rem;
      p {
        color: rgba(189, 226, 243, 0.8);
        // line-height: 0.16rem;
      }
    }
    .timelineItem {
      position: relative;
      height: 50%;
      width: 100%;
    }
    .timelineTail {
      padding-left: 0.1rem;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-left: 1px solid #066c85;
      &::before {
        content: '';
        width: 0.08rem;
        height: 0.08rem;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: -0.04rem;
        background: #70f3ff;
      }
      span {
        position: absolute;
        top: -0.04rem;
        left: 0.16rem;
      }
    }
    .timelineBox {
      padding-left: 0.4rem;
      height: 100%;
    }
  }
}
.title {
  width: 3.74rem;
  height: 0.35rem;
  line-height: 0.3rem;
  text-indent: 0.6rem;
  background: url('../assets/image/title.png') no-repeat;
  background-size: 3.74rem 0.35rem;
  font-size: 0.14rem;
}
.title_c {
  width: 10.36rem;
  height: 0.35rem;
  line-height: 0.3rem;
  text-indent: 0.6rem;
  background: url('../assets/image/title_c.png') no-repeat;
  background-size: 10.36rem 0.35rem;
  // font-size: ;
  font-size: 0.14rem;
}
.row_1 {
  margin-top: 0.05rem;
  cursor: pointer;
  width: 100%;
  // height: 1.65rem;
  height: calc((100% - 1.2rem) * 0.25);
  // transition: all 0.1s;
  box-sizing: border-box;
}
.row_2 {
  margin-top: 0.05rem;
  width: 100%;
  // height: 2.15rem;
  height: calc((100% - 1.2rem) * 0.3);
  box-sizing: border-box;
}
.row_3 {
  margin-top: 0.05rem;
  width: 100%;
  // height: 4.15rem;
  height: calc((100% - 1.2rem) * 0.45);
  box-sizing: border-box;
}
@keyframes breathe {
  0%,
  100% {
    box-shadow: 0 0 4px rgba(1, 222, 255, 0.6) inset;
  }
  50% {
    box-shadow: 0 0 10px rgba(1, 222, 255, 1) inset;
  }
}
</style>
