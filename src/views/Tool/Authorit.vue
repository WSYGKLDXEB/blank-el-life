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
          <div slot="header" class="clearfix">
            <div>
              <el-input clearable size="small" placeholder="请输入用户名" v-model="searchValue" class="input-with-select" @keyup.enter.native="search" @clear="inputClear">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
              </el-input>
            </div>
            <div>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
              <el-button type="primary" size="mini" icon="el-icon-s-grid" @click="$router.push('/rights')">权限列表</el-button>
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
          <div ref="clas" style="height: 100%"></div>
        </el-card>
        <el-card>
          <div ref="dealWith" style="height: 100%"></div>
        </el-card>
      </el-col>
    </el-row>

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
export default {
  name: 'BlankElEcBimRealisticAuthorit',

  data() {
    return {
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
      selValue: ''
    }
  },

  mounted() {
    console.log(userPerm)
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
