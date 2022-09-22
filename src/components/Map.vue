<template>
  <!-- 定义地图显示容器 -->
  <div id="container" :style="mapStyle"></div>
</template>

<script>
// 引入加载TXMap的方法
import TMap from '@/utils/initMap'
export default {
  name: 'BlankElEcBimRealisticMap',
  props: {
    h: {
      type: Number,
      default: 242
    },
    // 黑夜模式
    darkNight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mapStyle: { height: '100%' }
    }
  },

  mounted() {
    this.init()
    // this.setMapH()
  },

  methods: {
    async init() {
      // console.log(
      //   '地图',
      //   TMap.then((res) => res)
      // )
      // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      // 自己设置地图中心点
      const myLatlng = new qq.maps.LatLng(28.690697, 115.855263)
      // 定义工厂模式函数
      const myOptions = {
        zoom: 18, // 设置地图缩放级别
        center: myLatlng // 设置中心点样式
        // mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
        // mapStyleId: 'style1'
      }
      if (this.darkNight) {
        myOptions.mapStyleId = 'style3'
      }
      // 获取dom元素添加地图信息
      const map = new qq.maps.Map(document.getElementById('container'), myOptions)
      // console.log(new qq.maps.MultiMarker())
    },
    setMapH() {
      // 获取窗口的高度，减去一个定值，你可以自己* 乘以一个小数

      if (this.h !== 242) {
        this.mapStyle.height = window.innerHeight * 0.76 + 'px'
      } else {
        this.mapStyle.height = window.innerHeight * 0.45 - 102 + 'px'
      }
      window.addEventListener('resize', () => {
        console.log(666)
        let mapH
        if (this.h !== 242) {
          mapH = window.innerHeight * 0.76
        } else {
          mapH = window.innerHeight * 0.45 - 102
        }

        // this.mapStyle.height = mapH + 'px'
        if (mapH < this.h + 5) {
          this.mapStyle.height = this.h + 'px'
        } else {
          this.mapStyle.height = mapH + 'px'
        }

        // console.log(window.getComputedStyle(this.$refs.content_row2).height)
        // console.log()
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 地图
#container {
  width: 100%;
  // height: 350px;
  // height: 100%;
  border-radius: 6px;
}
</style>
