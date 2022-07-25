import * as echarts from 'echarts'
export const color = '#eff2f9'
export const colorArr = []
// 自定方法
export const CreateChart = (dom, option) => {
  const chart = echarts.init(dom)
  chart.setOption(option)
  window.addEventListener('resize', () => {
    chart.resize()
  })
}
