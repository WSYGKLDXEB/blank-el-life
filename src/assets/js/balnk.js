import * as echarts from 'echarts'
import 'echarts-liquidfill'
export const color = '#eff2f9'
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
