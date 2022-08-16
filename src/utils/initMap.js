export default () => {
  const KEY = 'P7SBZ-GSWKR-M7SW7-WEVPD-V7KIK-U5FSJ'
  const TMapURL = 'https://map.qq.com/api/gljs?v=1.exp&libraries=tools,service&key=' + KEY + '&callback=onMapCallback'
  return new Promise((resolve, reject) => {
    // 如果已加载直接返回
    if (typeof TMap !== 'undefined') {
      resolve(TMap)
      return true
    }
    // 地图异步加载回调处理
    window.onMapCallback = function () {
      resolve(TMap)
    }

    // 插入script脚本
    const scriptNode = document.createElement('script')
    scriptNode.setAttribute('type', 'text/javascript')
    scriptNode.setAttribute('src', TMapURL)
    document.body.appendChild(scriptNode)
  })
}
// TMap.init().then((TMap) => {
//   this.TXMap = TMap;
//   this.tMap = new TMap.Map("map", {
//     center: new TMap.LatLng(centerPoint.latitude, centerPoint.longitude), //设置地图中心点坐标
//     zoom: 15, //设置地图缩放级别
//     viewMode: "2D",
//   });
// });
