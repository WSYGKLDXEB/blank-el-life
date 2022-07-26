<template>
  <div class="video">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>楼宇智控</el-breadcrumb-item>
      <el-breadcrumb-item>视频监控</el-breadcrumb-item>
    </el-breadcrumb>
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
      <el-col :span="19">
        <el-card>
          <el-row :gutter="30">
            <!-- 当前观看视频 -->
            <el-col :span="19" class="watchWindow">
              <video data-v-12efe0b2="" :src="currentWatch" loop="loop" autoplay="autoplay" muted="muted"></video>
            </el-col>
            <el-col :span="5" class="operate">
              <div class="op_header">
                <el-button type="primary" size="mini" icon="el-icon-s-marketing">历史记录</el-button>
              </div>
              <div class="op_body">
                <el-tag>角度</el-tag>
                <div class="direction">
                  <span class="el-icon-caret-left"></span>
                  <span class="el-icon-caret-top"></span>
                  <span class="el-icon-caret-right"></span>
                  <span class="el-icon-caret-bottom"></span>
                </div>
                <el-tag>焦距</el-tag>
                <div class="focal">
                  <el-slider v-model="focalValue"> </el-slider>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="5">
        <tree-list title="设备列表"></tree-list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { CreateChart } from '@/assets/js/balnk'
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
      currentWatch: require('@/assets/video/cs.mp4'),
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
      focalValue: 0
    }
  },

  mounted() {
    this.monitorWidth = this.$refs.video[0].offsetWidth - 22
    console.log(this.$refs.video[0].offsetWidth)
    this.stateChart()
  },

  methods: {
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
      console.log(item)
      this.currentWatch = null
      this.currentWatch = item
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
  }
}

.monitorBox {
  margin-top: 1%;
  height: 72%;
  /deep/.el-card__body {
    height: 100%;
  }
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
    }
  }
  // 右侧操作
  .operate {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    .op_header {
      display: flex;
      justify-content: flex-end;
      padding-bottom: 15px;

      width: 100%;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .op_body {
      width: 100%;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      align-items: flex-end;
      .direction {
        position: relative;
        right: 50%;
        transform: translateX(50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.1);
        span {
          cursor: pointer;
          position: absolute;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #bbb;
          font-size: 20px;
        }
        span:nth-of-type(1) {
          left: 5px;
          top: 50%;
          transform: translateY(-50%);
          &:active {
            transform: translateY(-50%) translateX(-1px);
          }
        }
        span:nth-of-type(2) {
          left: 50%;
          top: 5px;
          transform: translateX(-50%);
          &:active {
            transform: translateX(-50%) translateY(-1px);
          }
        }
        span:nth-of-type(3) {
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          &:active {
            transform: translateY(-50%) translateX(1px);
          }
        }
        span:nth-of-type(4) {
          left: 50%;
          bottom: 5px;
          transform: translateX(-50%);
          &:active {
            transform: translateX(-50%) translateY(1px);
          }
        }
      }
      .focal {
        width: 100%;
      }
    }
  }
}
// 当前观看视频
.watchWindow {
  padding-left: 0 !important;
  height: 100%;
  video {
    height: 100%;
    border-radius: 6px;
  }
}
.el-tag {
  margin: 15px 0;
}
.el-col {
  height: 100%;
}

.el-card {
  width: 100%;
  height: 100%;
  .el-card__body {
    height: 100%;
  }
}
</style>
