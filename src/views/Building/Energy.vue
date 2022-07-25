<template>
  <div class="energy">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇智控</el-breadcrumb-item>
      <el-breadcrumb-item>能源管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="16">
      <el-col :span="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
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
            <el-button type="primary" size="mini" icon="el-icon-search">查询</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
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
  </div>
</template>

<script>
import { CreateChart, color } from '@/assets/js/balnk'
import chartUrl1 from '@/assets/image/custom-gauge-panel-1.png'
import chartUrl2 from '@/assets/image/custom-gauge-panel-2.png'
export default {
  name: 'BlankElLifeEnergy',

  data() {
    return {
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
      datePickerValue: '',
      cascaderValue: ''
    }
  },

  mounted() {
    // this.$nextTick(function () {
    this.waterChart()
    this.elecChart()
    this.temHunChart(this.$refs.tem, 26, 1, chartUrl1)
    this.temHunChart(this.$refs.hun, 88, 2, chartUrl2)
    // })
  },

  methods: {
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
            console.log(name)

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
        grid: {
          top: '18%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
        grid: {
          top: '18%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
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
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
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
