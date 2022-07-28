<template>
  <div class="rights">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="16">
      <el-col :span="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-page-header @back="$router.push('/authorit')"> </el-page-header>
          </div>

          <!-- 表格 -->
          <el-table :default-sort="{ prop: 'level', order: 'ascending' }" stripe max-height="675" :data="rightsList" border style="width: 100%">
            <!-- 展开项 -->
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="authName" label="权限名称"> </el-table-column>
            <el-table-column prop="path" label="路径"> </el-table-column>
            <el-table-column sortable prop="level" label="权限等级">
              <template slot-scope="scope">
                <el-tag v-if="Number(scope.row.level) === 0">一级</el-tag>
                <el-tag type="success" v-else-if="Number(scope.row.level) === 1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination background :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="5" class="chartBox">
        <el-card>
          <div ref="percen" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="relation" style="height: 100%"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { CreateChart, textColor, grid } from '@/assets/js/balnk'
import rightsList from '@/assets/js/permList'
export default {
  name: 'BlankElLifeRights',

  data() {
    return {
      rightsList
    }
  },

  mounted() {
    this.percenChart()
    this.relationChart()
  },

  methods: {
    percenChart() {
      // 声明颜色数组
      const myColor = ['rgba(64, 158, 255,.8)', 'rgba(103, 194, 58,.8)', 'rgba(230, 162, 60,.8)']
      const option = {
        title: [
          {
            text: '单位：%',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '百分比',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        grid,
        xAxis: {
          show: false
        },
        yAxis: [
          {
            type: 'category',
            data: ['一级', '二级', '三级'],
            inverse: true,
            // 不显示y轴线条
            axisLine: {
              show: false
            },
            // 不显示刻度
            axisTick: {
              show: false
            },
            axisLabel: {
              color: textColor
            }
          },
          {
            show: true,
            data: [5, 8, 35],
            inverse: true,
            // 不显示y轴的线
            axisLine: {
              show: false
            },
            // 不显示刻度
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: textColor
              }
            }
          }
        ],
        series: [
          {
            name: '条',
            type: 'bar',
            data: [10, 17, 73],
            // 柱子之间的距离
            barCategoryGap: 50,
            // 柱子的宽度
            barWidth: 8,
            yAxisIndex: 0,

            // 图形上的文本标签
            label: {
              // normal: {
              show: true,
              // 图形内显示
              position: 'inside',
              // 文字的显示格式
              formatter: '{c}%',
              fontSize: '10'
              // }
            },
            // 柱子设为圆角
            itemStyle: {
              // normal: {
              barBorderRadius: 20,
              color: function (params) {
                const num = myColor.length
                return myColor[params.dataIndex]
              }
              // params 传进来的是柱子对象
              // console.log(params)
              // dataIndex 是当前柱子的索引号
              // return myColor[params.dataIndex]
              // }
            }
          },
          {
            name: '框',
            type: 'bar',
            barCategoryGap: 50,
            barWidth: 13,
            yAxisIndex: 1,
            itemStyle: {
              color: 'none',
              borderColor: '#00c1de',
              borderWidth: 3,
              barBorderRadius: 15
            },
            data: [100, 100, 100]
          }
        ]
      }

      CreateChart(this.$refs.percen, option)
    },
    relationChart() {
      const arr = rightsList.map((item) => item.authName)
      const data = []
      arr.forEach((item) => {
        const i = {
          name: item
        }
        data.push(i)
      })
      const links = [
        // 商品管理
        { source: '商品管理', target: '商品列表', value: 1 },

        { source: '商品列表', target: '添加商品', value: 1 },
        { source: '商品列表', target: '获取商品详情', value: 1 },
        { source: '商品列表', target: '更新商品状态', value: 1 },
        { source: '商品列表', target: '更新商品属性', value: 1 },
        { source: '商品列表', target: '更新商品图片', value: 1 },
        { source: '商品列表', target: '商品删除', value: 1 },
        { source: '商品列表', target: '商品修改', value: 1 },

        { source: '商品管理', target: '分类参数', value: 1 },

        { source: '分类参数', target: '删除商品参数', value: 1 },
        { source: '分类参数', target: '创建商品参数', value: 1 },
        { source: '分类参数', target: '获取参数列表', value: 1 },

        { source: '商品管理', target: '商品分类', value: 1 },

        { source: '商品分类', target: '获取分类详情', value: 1 },
        { source: '商品分类', target: '删除分类', value: 1 },
        { source: '商品分类', target: '添加分类', value: 1 },
        // 订单管理
        { source: '订单管理', target: '订单列表', value: 1 },
        { source: '订单列表', target: '获取订单详情', value: 1 },
        { source: '订单列表', target: '订单更新', value: 1 },
        { source: '订单列表', target: '添加订单', value: 1 },
        // 权限管理
        { source: '权限管理', target: '角色列表', value: 1 },
        { source: '权限列表', target: '更新角色权限', value: 1 },
        { source: '权限列表', target: '更新角色信息', value: 1 },
        { source: '权限列表', target: '获取角色详情', value: 1 },
        { source: '权限列表', target: '获取角色列表', value: 1 },
        { source: '权限列表', target: '取消角色授权', value: 1 },
        { source: '权限列表', target: '角色授权', value: 1 },
        { source: '权限列表', target: '删除角色', value: 1 },
        { source: '权限列表', target: '添加角色', value: 1 },

        { source: '权限管理', target: '权限列表', value: 1 },
        { source: '权限列表', target: '查看权限', value: 1 },
        // 用户管理
        { source: '用户管理', target: '用户列表', value: 1 },
        { source: '用户列表', target: '设置管理状态', value: 1 },
        { source: '用户列表', target: '分配用户角色', value: 1 },
        { source: '用户列表', target: '获取用户详情', value: 1 },
        { source: '用户列表', target: '更新用户', value: 1 },
        { source: '用户列表', target: '删除用户', value: 1 },
        { source: '用户列表', target: '添加用户', value: 1 },
        // 数据统计
        { source: '数据统计', target: '数据报表', value: 1 },
        { source: '数据报表', target: '查看数据', value: 1 }
      ]
      const option = {
        title: [
          {
            text: '单位：#',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '级别关系',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        color: ['#29CB97', '#4072EE', '#FDAC41'],
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        animation: false,
        series: [
          {
            type: 'sankey',
            bottom: '3%',
            right: '5%',
            left: 0,
            nodeWidth: 25,
            nodeGap: 20,
            draggable: false,
            emphasis: {
              focus: 'adjacency'
            },
            data: [
              { name: 'ship' },
              { name: 'weather' },
              { name: 'dp_101' },
              { name: 'dp_101_1min_avg' },
              { name: 'dp_101_1min_sample' },
              { name: 'dp_101_10min_avg' },
              { name: 'dp_102' },
              { name: 'dp_102_1min_avg' },
              { name: 'dp_102_1min_sample' },
              { name: 'dp_102_10min_avg' },
              { name: 'machine_weather' },
              { name: 'cleaned_data' }
            ],
            links: [
              { source: 'ship', target: 'dp_101', value: 1 },
              { source: 'ship', target: 'dp_102', value: 1 },
              { source: 'dp_101', target: 'dp_101_1min_avg', value: 1 },
              { source: 'dp_101', target: 'dp_101_1min_sample', value: 1 },
              { source: 'dp_101', target: 'dp_101_10min_avg', value: 1 },
              { source: 'dp_102', target: 'dp_102_1min_avg', value: 1 },
              { source: 'dp_102', target: 'dp_102_1min_sample', value: 1 },
              { source: 'dp_102', target: 'dp_102_10min_avg', value: 1 },
              { source: 'dp_102_1min_sample', target: 'machine_weather', value: 1 },
              { source: 'weather', target: 'machine_weather', value: 1 },
              { source: 'dp_101_1min_avg', target: 'cleaned_data', value: 1 },
              { source: 'dp_102_1min_avg', target: 'cleaned_data', value: 1 }
            ],
            focusNodeAdjacency: 'allEdges',
            itemStyle: {
              borderWidth: 0
            },
            label: {
              position: 'bottom',
              color: '#748AA1'
            },
            lineStyle: {
              color: 'source',
              curveness: 0.5
            }
          }
        ]
      }
      CreateChart(this.$refs.relation, option)
    }
  }
}
</script>

<style lang="less" scoped>
.rights {
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
  position: relative;
  width: 100%;
  height: 100%;
}
/deep/.el-card__body {
  height: 94%;
}
// 分页定位
.el-pagination {
  position: absolute;
  bottom: 15px;
}
// 右侧图表
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  /deep/.el-card__body {
    height: 100%;
  }
  .el-card {
    height: 72%;
    &:nth-of-type(1) {
      height: 26%;
    }
    & > div {
      width: 100%;
      height: 30%;
    }
  }
}
</style>
