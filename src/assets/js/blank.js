import * as echarts from 'echarts'
export const color = '#eff2f9'
export const textColor = '#b8f0fc'
export const colorArr = [
  '#22c3aa',
  '#ff999a',
  '#49afff',
  '#ffa77f',
  '#f6b655',
  '#74caae',
  '#97b552',
  '#95706d',
  '#dc69aa',
  '#07a2a4',
  '#9a7fd1',
  '#588dd5',
  '#f5994e',
  '#c05050',
  '#59678c',
  '#c9ab00',
  '#7eb00a',
  '#6f5553',
  '#c14089'
]
// #region
// export const colorArr = [
//   '#2ec7c9',
//   '#b6a2de',
//   '#5ab1ef',
//   '#ffb980',
//   '#d87a80',
//   '#8d98b3',
//   '#e5cf0d',
//   '#97b552',
//   '#95706d',
//   '#dc69aa',
//   '#07a2a4',
//   '#9a7fd1',
//   '#588dd5',
//   '#f5994e',
//   '#c05050',
//   '#59678c',
//   '#c9ab00',
//   '#7eb00a',
//   '#6f5553',
//   '#c14089'
// ]
// #endregion
export const grid = {
  top: '18%',
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true
}
// 创建图表
export const CreateChart = (dom, option, type, time) => {
  const chart = echarts.init(dom)
  chart.setOption(option)
  // 为图表父节点添加监听， 用于监测父节点的大小变化
  const resizeObserver = new ResizeObserver((entries) => {
    // entries 是一个数组 里面有5个属性能用到的只有两个contentRect, target
    // contentRect 是dom的几何信息
    // target 和点击事件里面的target一样的 dom对象
    entries.forEach((item, index) => {
      // console.log(item.contentRect)
      chart.resize()
    })
  })
  resizeObserver.observe(dom.parentNode)
  // window.addEventListener('resize', () => {
  //   console.log('窗口变化')
  //   chart.resize()
  // })
  if (type) {
    chartDynamicShow(chart, option, type)
  }
  if (type && time) {
    chartDynamicShow(chart, option, type, time)
  }
}
// chart动态显示提示
export const chartDynamicShow = (obj, option, type = 'showTip', time = 1000) => {
  // 动态显示tootip
  let index = 0 // 播放所在下标
  setInterval(function () {
    if (type === 'highlight') {
      // 饼图
      option.series[0].data.forEach((item, i) => {
        console.log(465654)
        // 遍历饼图数据，取消所有图形的高亮效果
        obj.dispatchAction({
          type: 'downplay',
          seriesIndex: 0,
          dataIndex: i
        })
      })
    }
    // 使得tootip每隔三秒自动显示
    obj.dispatchAction({
      type, // 根据 tooltip 的配置项显示提示框。
      seriesIndex: 0,
      dataIndex: index
    })
    index++
    // faultRateOption.series[0].data.length 是已报名纵坐标数据的长度
    option.series.forEach((item) => {
      if (index >= item.data.length) {
        index = 0
      }
    })
  }, time)
}
// 数值补零 prefixInteger(需要补零的数字，输出数字位数)
export const PrefixInteger = (num, n) => (Array(n).join(0) + num).slice(-n)

// 获取时间
export const CurrentDate = () => {
  const date = new Date()
  const yy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()

  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()

  const day = date.getDay()
  let week = ''
  switch (day) {
    case 0:
      week = '星期日'
      break
    case 1:
      week = '星期一'
      break
    case 2:
      week = '星期二'
      break
    case 3:
      week = '星期三'
      break
    case 4:
      week = '星期四'
      break
    case 5:
      week = '星期五'
      break
    case 6:
      week = '星期六'
      break
  }
  return {
    time: `${h}:${PrefixInteger(m, 2)}:${PrefixInteger(s, 2)}`,
    years: `${yy}-${PrefixInteger(mm, 2)}-${PrefixInteger(dd, 2)}`,
    week,
    h,
    m
  }
}
// 颜色hex转rgba
export const hex2Rgba = (bgColor, alpha = 1) => {
  const color = bgColor.slice(1) // 去掉'#'号
  const rgba = [parseInt('0x' + color.slice(0, 2)), parseInt('0x' + color.slice(2, 4)), parseInt('0x' + color.slice(4, 6)), alpha]
  return 'rgba(' + rgba.toString() + ')'
}

/**
 * 滚动数字
 * @param {*DOM} DOM DOM对象
 * @param {*Number} initNum 滚动初始值  默认值为0
 * @param {*Number} targetNum 结束值    默认值为1000
 * @param {*Number} speed      速度     默认值为10
 */
export function numberRun(DOM, initNum = 0, targetNum = 1000, speed = 10) {
  let numText = initNum
  let global
  function numberGlobal() {
    numText += speed // 速度的计算可以为小数
    if (numText >= targetNum) {
      numText = targetNum
      cancelAnimationFrame(global)
    } else {
      global = requestAnimationFrame(numberGlobal)
    }
    DOM.innerHTML = numText
  }
  numberGlobal()
}

// 向子页面发送消息
export const sendSonInfo = (father, info) => father.contentWindow.postMessage(info, '*')

// 向父页面发送消息
export const sendFatherInfo = (name, url) => {
  window.parent.postMessage(
    {
      cmd: 'Model',
      res: {
        name,
        url
      }
    },
    '*'
  )
}

export const receiveFatherInfo = () => {
  // 接收父页面发来的消息
  window.addEventListener('message', (e) => {
    switch (e.data.cmd) {
      case 'Topology':
        break

      case 'ClerTopology':
        break
    }
  })
}

// 接收iframe子页面的信息
export const receiveSonInfo = () =>
  window.addEventListener('message', (e) => {
    // console.log(e)
    // return e
  })
