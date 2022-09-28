<template>
  <div class="authorit">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="16">
      <el-col :span="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix between">
            <div>
              <el-input clearable size="small" placeholder="请输入用户名" v-model="searchValue" class="input-with-select" @keyup.enter.native="search" @clear="inputClear">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
            <div>
              <el-button style="vertical-align: super" type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
              <el-button style="vertical-align: super" type="primary" size="mini" icon="el-icon-s-grid" @click="isFormDialog = true">权限列表</el-button>
            </div>
          </div>
          <!-- 表格 -->
          <el-table stripe max-height="675" :data="tableData" border style="width: 100%">
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- <pre>{{ scope.row }}</pre> -->
                <el-row :class="['vcenter level_layout', l1 === scope.row.children.length - 1 ? '' : 'level1_bottom']" v-for="(level1, l1) in scope.row.children" :key="level1.id">
                  <!-- 一级权限 -->
                  <el-col :span="5">
                    <el-tag :closable="isEditState && scope.$index === tableId" @close="tagDel(l1)">{{ level1.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-row :class="['vcenter level1_layout', l2 === level1.children.length - 1 ? '' : 'level1_bottom']" v-for="(level2, l2) in level1.children" :key="level2.id">
                      <!-- 二级权限 -->
                      <el-col :span="6">
                        <el-tag type="success" :closable="isEditState && scope.$index === tableId" size="medium" @close="tagDel(l1, l2)">{{ level2.authName }}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 三级权限 -->
                      <el-col :span="18">
                        <el-tag
                          class="level2_layout"
                          type="warning"
                          :closable="isEditState && scope.$index === tableId"
                          size="small"
                          v-for="(level3, l3) in level2.children"
                          :key="level3.id"
                          @close="tagDel(l1, l2, l3)"
                          >{{ level3.authName }}</el-tag
                        >
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="180"> </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="180"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="setEditState(scope)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="del(scope)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="权限分配" placement="top">
                  <el-button type="warning" size="mini" icon="el-icon-s-tools" @click="showAssignDialog(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination background :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"> </el-pagination>
        </el-card>
      </el-col>
      <el-col :span="5" class="chartBox">
        <el-card>
          <div ref="number" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="grade" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="type" style="height: 100%"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
      <el-card>
        <!-- 表格 -->
        <el-table :default-sort="{ prop: 'level', order: 'ascending' }" stripe max-height="740" :data="rightsList" border style="width: 100%">
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
        <el-pagination
          v-if="tableData.length !== 0"
          background
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
        <!-- 空状态 -->
        <el-empty v-else description="选择条件查询！"></el-empty>
      </el-card>
    </el-dialog>
    <!-- 操作弹出框 -->
    <el-dialog center title="添加角色" :visible.sync="isDialog" :show-close="false" width="40%" @close="close">
      <el-form ref="formRef" label-position="right" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" clearable></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="formData.roleDesc" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限弹出框 -->
    <el-dialog show-close center title="权限分配" :visible.sync="isAssignDialog" width="40%">
      <el-tree ref="treeRef" check-on-click-node default-expand-all show-checkbox node-key="id" :default-checked-keys="defKeys" :data="autTreeList" :props="props"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAssignDialog = false">取 消</el-button>
        <el-button type="primary" @click="distribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userPerm from '@/assets/js/userPerm'
import autTreeList from '@/assets/js/autTreeLIst'
import { CreateChart, grid, color, textColor, colorArr } from '@/assets/js/blank'
import giftImageUrl from '@/assets/image/chartImg.png'
import rightsList from '@/assets/js/permList'
export default {
  name: 'BlankElEcBimRealisticAuthorit',

  data() {
    return {
      rightsList,
      searchValue: '',
      autTreeList,
      // 默认选中的节点id数值集合
      defKeys: [],
      tableData: userPerm,
      currentPage: 1,
      // 弹出框弹出与否
      isDialog: false,
      // 分配权限弹出框
      isAssignDialog: false,
      formData: {
        roleName: '',
        roleDesc: ''
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      },
      // 树形菜单配置项
      props: {
        children: 'children',
        label: 'authName'
      },
      // 当前选中项ID,
      tableId: 0,
      // 是否为编辑状态
      isEditState: false,
      selValue: '',
      // 控制表格展示框的显示与否
      isFormDialog: false
    }
  },

  mounted() {
    this.numberChart()
    this.typeChart()
    this.gradeChart()
  },

  methods: {
    // 搜索框清理
    inputClear() {
      this.userList = userData
    },
    // 查询
    search() {
      if (!this.searchValue) {
        this.userList = userData
        return this.$message.warning('输入框不能为空！')
      }
      this.userList = userData.filter((item) => item.username.indexOf(this.searchValue) !== -1)
    },
    // 设置为编辑状态
    setEditState(item) {
      console.log(item)
      this.isEditState = true
      // this.tableId = item.row.id
      this.tableId = item.$index
      // this.isEditState = true

      // this.isDialog = true
      // this.formData = item.row
      // this.$refs.formRef.resetFields()
    },
    showAddDialog() {
      this.isEditState = false
      this.formData = {
        roleName: '',
        roleDesc: ''
      }
      this.isDialog = true
      // this.$refs.formRef.resetFields()
    },
    showAssignDialog(item) {
      this.defKeys = []
      this.tableId = item.$index
      this.isAssignDialog = true
      this.getCheckedKeys(item, this.defKeys)
      console.log(this.defKeys)
    },
    add() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        const from = {
          roleName: this.formData.roleName,
          roleDesc: this.formData.roleDesc,
          id: Math.floor(Math.random() * 50) + 50
        }
        this.tableData.push(from)
        this.isDialog = false
        this.$message.success('添加成功！')
      })
    },
    // 删除
    async tagDel(l1, l2, l3) {
      const isDel = await this.$confirm('此操作将永久删除该权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (isDel === 'confirm') {
        console.log(l1, l2, l3)
        console.log(l2)
        if (l3 !== undefined) {
          this.tableData[this.tableId].children[l1].children[l2].children.splice(l3, 1)
          // console.log(this.tableData[l].children[l1].children[l2].children[l3])
        } else if (l2 !== undefined) {
          this.tableData[this.tableId].children[l1].children.splice(l2, 1)
          // console.log(this.tableData[l].children[l1].children[l2])
        } else {
          this.tableData[this.tableId].children.splice(l1, 1)
          // console.log(this.tableData[l].children[l1])
        }
        return this.$message.success('删除权限成功！')
      }
    },
    async del(item) {
      const isDel = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // console.log(isDel)
      // console.log(item)
      if (isDel === 'confirm') {
        this.tableData.splice(item.$index, 1)
        return this.$message.success('删除成功！')
      }
    },
    // 分配权限
    distribute() {
      const nodes = [...this.$refs.treeRef.getCheckedNodes(true)]
      const nodeArr = []
      console.log(nodes)
      // autTreeList.forEach((item) => {
      //   let i
      //   nodes.forEach((key) => {
      //     i = key.pid.split(',')
      //     console.log(i)
      //     if (item.id === Number(i[1]) && nodeArr.indexOf(item) === -1) {
      //       const s = item.children.filter((item) => item.id === Number(i[0]))
      //       nodeArr.push(item)
      //       console.log('s', s)
      //     }
      //   })
      // })

      // let i
      // nodes.forEach((key) => {
      //   i = key.pid.split(',')
      //   console.log(i)
      //   const f = autTreeList.filter((item) => item.id === Number(i[0]))
      //   f.children = []
      //   const s = item.children.filter((item) => item.id === Number(i[0]))
      //   if (s && f.indexOf(s) === -1) {
      //     f.children.push(s)
      //   }
      //   if (nodeArr.indexOf(item) === -1) {
      //     nodeArr.push(item)
      //   }
      // })

      console.log(nodeArr)
      // this.$message.success('分配权限成功！')
    },
    close() {
      // this.$refs.formRef.resetFields()
    },
    // 获取选中的节点
    getCheckedKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => this.getCheckedKeys(item, arr))
    },
    numberChart() {
      const data = [
        [
          [28604, 77, 17096869, 'Australia', 1990],
          [31163, 77.4, 27662440, 'Canada', 1990],
          [1516, 68, 1154605773, 'China', 1990],
          [13670, 74.7, 10582082, 'Cuba', 1990],
          [28599, 75, 4986705, 'Finland', 1990],
          [29476, 77.1, 56943299, 'France', 1990],
          [31476, 75.4, 78958237, 'Germany', 1990],
          [28666, 78.1, 254830, 'Iceland', 1990],
          [1777, 57.7, 870601776, 'India', 1990],
          [29550, 79.1, 122249285, 'Japan', 1990],
          [2076, 67.9, 20194354, 'North Korea', 1990],
          [12087, 72, 42972254, 'South Korea', 1990],
          [24021, 75.4, 3397534, 'New Zealand', 1990],
          [43296, 76.8, 4240375, 'Norway', 1990],
          [10088, 70.8, 38195258, 'Poland', 1990],
          [19349, 69.6, 147568552, 'Russia', 1990],
          [10670, 67.3, 53994605, 'Turkey', 1990],
          [26424, 75.7, 57110117, 'United Kingdom', 1990],
          [37062, 75.4, 252847810, 'United States', 1990]
        ],
        [
          [44056, 81.8, 23968973, 'Australia', 2015],
          [43294, 81.7, 35939927, 'Canada', 2015],
          [13334, 76.9, 1376048943, 'China', 2015],
          [21291, 78.5, 11389562, 'Cuba', 2015],
          [38923, 80.8, 5503457, 'Finland', 2015],
          [37599, 81.9, 64395345, 'France', 2015],
          [44053, 81.1, 80688545, 'Germany', 2015],
          [42182, 82.8, 329425, 'Iceland', 2015],
          [5903, 66.8, 1311050527, 'India', 2015],
          [36162, 83.5, 126573481, 'Japan', 2015],
          [1390, 71.4, 25155317, 'North Korea', 2015],
          [34644, 80.7, 50293439, 'South Korea', 2015],
          [34186, 80.6, 4528526, 'New Zealand', 2015],
          [64304, 81.6, 5210967, 'Norway', 2015],
          [24787, 77.3, 38611794, 'Poland', 2015],
          [23038, 73.13, 143456918, 'Russia', 2015],
          [19360, 76.5, 78665830, 'Turkey', 2015],
          [38225, 81.4, 64715810, 'United Kingdom', 2015],
          [53354, 79.1, 321773631, 'United States', 2015]
        ]
      ]
      const option = {
        backgroundColor: '',
        title: [
          {
            text: '单位：个',
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
        legend: {
          right: 'center',
          top: '3%',
          data: ['1990', '2015']
        },
        grid,
        xAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color
            }
          },
          axisLine: {
            lineStyle: {
              color
            }
          },
          axisLabel: {
            color: textColor
          }
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color
            }
          },
          axisLine: {
            lineStyle: {
              color
            }
          },
          axisLabel: {
            color: textColor
          },
          scale: true
        },
        series: [
          {
            name: '1990',
            data: data[0],
            type: 'scatter',
            symbolSize: function (data) {
              return Math.sqrt(data[2]) / 5e2
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                formatter: function (param) {
                  return param.data[3]
                },
                position: 'top'
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(120, 36, 50, 0.5)',
              shadowOffsetY: 5,
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                },
                {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }
              ])
            }
          },
          {
            name: '2015',
            data: data[1],
            type: 'scatter',
            symbolSize: function (data) {
              return Math.sqrt(data[2]) / 5e2
            },
            emphasis: {
              focus: 'series',
              label: {
                show: true,
                formatter: function (param) {
                  return param.data[3]
                },
                position: 'top'
              }
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(25, 100, 150, 0.5)',
              shadowOffsetY: 5,
              color: new this.$echarts.graphic.RadialGradient(0.4, 0.3, 1, [
                {
                  offset: 0,
                  color: 'rgb(129, 227, 238)'
                },
                {
                  offset: 1,
                  color: 'rgb(25, 183, 207)'
                }
              ])
            }
          }
        ]
      }

      CreateChart(this.$refs.number, option)
    },
    gradeChart() {
      const option = {
        // color: ['rgb(41,182,203)', 'rgb(52,195,242)', 'rgb(52,146,242)', 'rgb(86,111,206)'],
        color: colorArr,
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
            text: '级别',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        series: [
          {
            name: '占比',
            type: 'funnel',
            left: 'center',
            y: 10,
            y2: 10,
            width: '100%',
            min: 100,
            max: 0,
            minSize: '0%',
            maxSize: '100%',
            gap: 10,
            data: [
              { value: 100, name: '5%' },
              { value: 75, name: '14%' },
              { value: 50, name: '21%' },
              { value: 25, name: '60%' }
            ].sort(function (a, b) {
              return a.value - b.value
            }),
            label: {
              normal: {
                formatter: function (params) {
                  return params.name
                },
                position: 'center',
                textStyle: {
                  color: '#fff',
                  fontSize: 18
                }
              }
            },
            itemStyle: {
              normal: {
                borderWidth: 0,
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },

          {
            name: '数值',
            type: 'funnel',
            left: 'center',
            y: 100,
            y2: 100,
            width: '100%',
            min: 100,
            max: 0,
            minSize: '0%',
            maxSize: '100%',
            gap: 15,
            data: [
              { value: 100, name: 100 },
              { value: 75, name: 75 },
              { value: 50, name: 50 },
              { value: 25, name: 25 }
            ].sort(function (a, b) {
              return a.value - b.value
            }),
            label: {
              normal: {
                formatter: function (params) {
                  return params.name
                },
                backgroundColor: 'rgb(192,219,246)',
                color: '#fff',
                padding: [5, 30, 1, 30],
                shadowBlur: 0,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowColor: '#fff',
                textStyle: {
                  color: 'rgb(82,123,172)',
                  fontSize: 30
                }
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 80,
                lineStyle: {
                  type: 'solid',
                  color: '#fff'
                }
              }
            },

            itemStyle: {
              normal: {
                opacity: 0,
                borderWidth: 0,
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },

          {
            name: '标签',
            type: 'funnel',
            left: 'center',
            y: 100,
            y2: 100,
            width: '50%',
            min: 100,
            max: 0,
            minSize: '0%',
            maxSize: '100%',
            gap: 15,
            data: [
              { value: 100, name: '国' },
              { value: 75, name: '省' },
              { value: 50, name: '市' },
              { value: 25, name: '县' }
            ].sort(function (a, b) {
              return a.value - b.value
            }),
            label: {
              normal: {
                formatter: function (params) {
                  return params.name
                },
                backgroundColor: 'rgb(86,111,206)',
                color: '#fff',
                borderRadius: 10,
                padding: [10, 10, 10, 10],
                shadowBlur: 0,
                shadowOffsetX: 2,
                shadowOffsetY: 2,
                shadowColor: '#fff',
                textStyle: {
                  color: '#fff',
                  fontSize: 30
                }
              }
            },
            labelLine: {
              normal: {
                show: false,
                length: 30,
                lineStyle: {
                  type: 'solid',
                  color: '#fff'
                }
              }
            },

            itemStyle: {
              normal: {
                opacity: 0,
                borderWidth: 0,
                shadowBlur: 20,
                shadowOffsetX: 0,
                shadowOffsetY: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      CreateChart(this.$refs.grade, option)
    },
    typeChart() {
      const data = [
        {
          value: 37173,
          name: '一级'
        },
        {
          value: 63596,
          name: '二级'
        },
        {
          value: 10823,
          name: '三级'
        },
        {
          value: 63451,
          name: '四级'
        }
      ]
      const option = {
        color: colorArr,
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
            text: '类型比',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {d}% <br/> {c}'
        },
        graphic: {
          elements: [
            {
              type: 'image',
              style: {
                image: giftImageUrl,
                width: 40,
                height: 40
              },
              left: 'center',
              top: 'center'
            }
          ]
        },
        grid,
        legend: {
          icon: 'circle',
          bottom: 0
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '40%'],
            center: ['50%', '50%'],
            data: data,
            labelLine: {
              show: true,
              length: 10,
              length2: 20,
              lineStyle: {
                width: 2
              }
            },
            label: {
              normal: {
                formatter: function (params) {
                  const str = '{c|' + params.data.name + '}' + '{c|\n' + ((params.data.value / 175043) * 100).toFixed(2) + '%}'
                  return str
                },
                rich: {
                  c: {
                    fontSize: 14,
                    align: 'left',
                    padding: 4
                  }
                }
              }
            }
          }
        ]
      }

      CreateChart(this.$refs.type, option)
    }
  }
}
</script>

<style lang="less" scoped>
// 添加动画效果
tr,
td {
  transition: all 0.6s;
}
// 数据展示框
.tableBox {
  /deep/.el-dialog__body {
    padding-top: 10px !important;
    height: 90%;
  }
  .el-card {
    box-shadow: none !important;
  }
  /deep/.el-card__body {
    height: 100%;
    // padding-bottom: 0 !important;
  }
}
// 展开栏tag标签垂直居中
.vcenter {
  display: flex;
  align-items: center;
}
// 一级tag布局
.level_layout {
  padding: 4px 0;
  margin-left: 47px;
}
// 二级tag布局
.level1_layout {
  padding: 4px 0;
}
// 三级tag布局
.level2_layout {
  margin: 5px 0;
  margin-right: 16px;
}
// 下划线
.level1_bottom {
  border-bottom: 1px solid #ebeef5;
}
.authorit {
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
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    height: 35%;
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
