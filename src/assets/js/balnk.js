import * as echarts from 'echarts'
export const color = '#eff2f9'
export const textColor = '#b8f0fc'
export const colorArr = [
  '#2ec7c9',
  '#b6a2de',
  '#5ab1ef',
  '#ffb980',
  '#d87a80',
  '#8d98b3',
  '#e5cf0d',
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
export const grid = {
  top: '18%',
  left: '3%',
  right: '4%',
  bottom: '3%',
  containLabel: true
}
// 自定方法
export const CreateChart = (dom, option) => {
  const chart = echarts.init(dom)
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
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
