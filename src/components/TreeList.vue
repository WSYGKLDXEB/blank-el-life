<template>
  <div class="tree">
    <!-- <img :src="icon" alt="" /> -->
    <el-card class="box-card">
      <div slot="header" class="header">
        <span>{{ title }}</span>
      </div>
      <!-- 过滤器 -->
      <el-input v-if="isFilter" size="small" placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree ref="tree" @node-click="nodeClick" :filter-node-method="filterNode" icon-class="el-icon-folder" :data="treeData" :props="defaultProps"></el-tree>
    </el-card>
  </div>
</template>

<script>
import icon from '@/assets/image/32px.png'
export default {
  name: 'BlankElEcBimRealisticTreeList',
  props: {
    title: {
      type: String,
      default: '设备列表'
    },
    isFilter: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  value: '3',
                  label: '三级 1-1-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1'
                }
              ]
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1'
                }
              ]
            }
          ]
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1'
                }
              ]
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      x: -100,
      y: 0,
      x1: -100,
      y1: 0,
      dom2: [],
      dom3: [],
      icon,
      iconURl: require('@/assets/image/32px.png'),
      // 过滤器
      filterText: ''
    }
  },

  mounted() {
    // this.init()
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 过滤器
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点点击
    nodeClick(obj, node, com) {
      this.$emit('nodeClick', obj, node, com)
    },
    init() {
      document.querySelector('.el-tree').style.cssText += 'margin-left: 14px;'
      // 第一场
      const dom1 = document.querySelectorAll('.el-tree>div')
      // const dom2 = []
      // const dom3 = document.querySelectorAll('.el-tree-node__content')
      // 第一层icon
      const icons1 = document.querySelectorAll('.el-tree-node__expand-icon')

      icons1.forEach((item) => {
        item.style.cssText += 'position: relative;'

        const i = document.createElement('i')
        i.setAttribute('id', 'icon1')
        i.style.cssText += 'position: absolute;width:26px;height:26px;top:-5px;left:-22px;background-size:26px 26px;'
        i.style.background = ' url(' + this.iconURl + ') ' + this.x + 'px ' + this.y + 'px'
        item.appendChild(i)
        // console.log(item)
      })
      // 点击切换
      dom1.forEach((item, i) => {
        const icon1 = document.querySelectorAll('#icon1')
        item.addEventListener('click', () => {
          if (parseInt(icon1[i].style.background.slice(-9, -6)) === 100) {
            this.x = -132
          } else {
            this.x = -100
          }
          icon1[i].style.background = ' url(' + this.iconURl + ') ' + this.x + 'px ' + this.y + 'px'
          const node = item.querySelectorAll('.el-tree-node__content')
          // 第二层
          node.forEach((items, i1) => {
            if (i1 === 0) return
            if (this.dom2.length === 0) {
              this.dom2.push(items)
              this.setDom2(items)
            } else {
              const ifs = this.dom2.some((itemss) => {
                return items === itemss
              })
              if (!ifs) {
                this.dom2.push(items)
                this.setDom2(items)
              }
              console.log(ifs)
            }
          })
          // setTimeout(() => {
          // console.log(this.dom2)
          // }, 1000)
        })
      })
    },
    setDom2(item) {
      // this.dom2.forEach(item => {
      item.parentNode.parentNode.style.cssText += 'padding-left: 20px;margin-left: -20px;padding-top: 10px;margin-top: -10px;'
      item.parentNode.style.cssText += 'position: relative;'

      const i = document.createElement('i')
      const j = document.createElement('i')
      i.setAttribute('id', 'icon1')
      j.setAttribute('id', 'icon1')
      if (this.dom2.length === 5) {
        this.x1 = -100
        this.x = -64
        this.y = 0
        i.style.cssText += 'position: absolute;width:26px;height:40px;top:-3px;left:-26px;background-size:26px 40px;'
      } else {
        this.x1 = -100
        this.x = -280
        this.y = 0
        i.style.cssText += 'position: absolute;width:26px;height:40px;top:-8px;left:-34px;background-size:26px 40px;'
      }

      i.style.background = ' url(' + this.iconURl + ') ' + this.x + 'px ' + this.y + 'px'

      j.style.cssText += 'position: absolute;width:26px;height:26px;top:-5px;left:-2px;background-size:26px 26px;'
      j.style.background = ' url(' + this.iconURl + ') ' + this.x1 + 'px ' + this.y1 + 'px'
      item.parentNode.appendChild(i)
      item.parentNode.appendChild(j)

      item.parentNode.addEventListener('click', () => {
        // console.log(item.parentNode.children)
        if (parseInt(item.parentNode.children[3].style.background.slice(-9, -6)) === 100) {
          this.x1 = -132
        } else {
          this.x1 = -100
        }
        j.style.background = ' url(' + this.iconURl + ') ' + this.x1 + 'px ' + this.y1 + 'px'
        const node = item.parentNode.querySelectorAll('.el-tree-node__children')
        // console.log(node)
        // 第二层
        node.forEach((items, i1) => {
          // if (i1 === 0) return
          if (this.dom3.length === 0) {
            this.dom3.push(items)
            this.setDom3(items)
          } else {
            const ifs = this.dom3.some((itemss) => {
              return items === itemss
            })
            if (!ifs) {
              this.dom3.push(items)
              this.setDom3(items)
            }
            // console.log(ifs)
          }
        })
        // setTimeout(() => {
        // console.log(this.dom3)
        // }, 1000)
      })
      // })
    },
    setDom3(item) {
      console.log(item.querySelector('.el-tree-node__content'))
      const dom = item.querySelector('.el-tree-node__content')
      dom.style.cssText += 'position: relative;'
      item.style.cssText += 'padding-top: 10px;margin-top: -10px;'

      const i = document.createElement('i')
      const j = document.createElement('i')
      i.setAttribute('id', 'icon1')
      j.setAttribute('id', 'icon1')

      this.x1 = -100
      this.x = -64
      this.y = 0
      i.style.cssText += 'position: absolute;width:26px;height:26px;top:-6px;left:14px;background-size:26px 26px;'

      i.style.background = ' url(' + this.iconURl + ') ' + this.x + 'px ' + this.y + 'px'

      j.style.cssText += 'position: absolute;width:26px;height:26px;top:-5px;left:12px;background-size:26px 26px;'
      j.style.background = ' url(' + this.iconURl + ') ' + this.x1 + 'px ' + this.y1 + 'px'
      dom.appendChild(i)
      // if ()
      // dom.appendChild(j)
    }
  }
}
</script>

<style lang="less" scoped>
// 过滤器
.el-input {
  margin-bottom: 15px;
}
/deep/.el-card__header {
  display: flex;
  justify-content: center !important;
  padding: 10px 20px !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: '微软雅黑' !important;
}
.tree {
  width: 100%;
  // height: calc(100% - 5px);
  height: 100%;
}
.el-card {
  height: 100%;
}
// 图标
/deep/.el-tree-node__expand-icon {
  color: #ffa200 !important;
  // font-weight: normal;
}
// 点击后图标
/deep/.expanded {
  &::before {
    content: '\e784';
  }
  transform: rotate(0) !important;
  // background-image: ;
}
.el-icon-folder:before {
  position: absolute;
  top: 0;
  left: -20px;
}
// .el-tree {
//   margin-left: 14px;
// }
/deep/.el-tree-node__content {
  height: 22px !important;
}
// 溢出隐藏
// .el-tree-node>.el-tree-node__children{
//   overflow: auto !important;
// }
// .el-tree-node > .el-tree-node__children {
//   padding-left: 20px !important;
//   margin-left: -20px !important;
// }
</style>
