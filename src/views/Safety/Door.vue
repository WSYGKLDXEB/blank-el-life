<template>
  <div class="door">
    <!-- 表格显示框按钮 -->
    <el-button class="listBut" size="mini" type="primary" @click="isFormDialog = true">通行记录</el-button>
    <!--导航 -->
    <el-tabs v-model="activeName" class="nav">
      <el-tab-pane label="实时数据" name="timeData">
        <el-row :gutter="16">
          <!-- 左侧列表 -->
          <el-col :span="18">
            <div class="card" ref="inOut" style="height: 100%"></div>
          </el-col>
          <!-- 右侧图表 -->
          <el-col :span="6" class="chartBox">
            <div class="card" ref="state"></div>
            <div class="card">
              <div class="title">
                <span>出入记录</span>
              </div>
              <div class="body access hidden" ref="access">
                <div class="accessItem between" v-for="(item, i) in accessRecord" :key="i">
                  <img src="~@/assets/image/chartImg.png" alt="" />
                  <div class="between">
                    <div class="info between column">
                      <span>XXXX</span>
                      <p>XXXXXXXXXXXXXXXXXXX</p>
                    </div>
                    <div class="time">10:15</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <el-card>
              <div ref="type" style="height: 100%"></div>
            </el-card>
            <el-card>
              <div ref="state" style="height: 100%"></div>
            </el-card> -->
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <el-row :gutter="16">
          <!-- 左侧列表 -->
          <el-col :span="19">
            <el-tabs class="card" tab-position="left">
              <el-tab-pane label="门禁监控" class="monitoring">
                <el-row :gutter="16" class="r1">
                  <el-col :span="19">
                    <video ref="curMonitor" controls src="@/assets/video/cs.mp4" loop="loop" autoplay="autoplay" muted="muted"></video>
                  </el-col>
                  <el-col :span="5" class="operate">
                    <div class="op_time">
                      <div class="time_box">
                        <h1>{{ time }}</h1>
                        <div>
                          <span>{{ week }}</span>
                          <p>{{ years }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="op_header">
                      <div class="header_box">
                        <h4>设备：<span>门禁</span></h4>
                        <p>摄像头信息，摄像头信息，摄像头信息</p>
                      </div>
                    </div>
                    <div class="op_body">
                      <div class="body_box">
                        <div class="direction">
                          <span class="el-icon-caret-left"></span>
                          <span class="el-icon-caret-top"></span>
                          <span class="el-icon-caret-right"></span>
                          <span class="el-icon-caret-bottom"></span>
                        </div>
                        <div class="focal">
                          <el-slider v-model="focalValue"> </el-slider>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
                <el-row :gutter="16" class="r2">
                  <el-col :span="19">
                    <span class="titles">人脸抓拍</span>
                    <div class="imgBox between">
                      <img v-for="i in 10" :key="i" src="@/assets/image/chartImg.png" alt="" />
                    </div>
                    <div class="peopleInfo">
                      <div class="between">
                        <span>姓名：XXX</span>
                        <span>工号：XXXX-XXXX</span>
                        <span>部门：XXXX-XXXX</span>
                      </div>
                      <div class="between">
                        <span>门禁：XXX</span>
                        <span>时间：XXXX-XXXX</span>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="5">
                    <span class="titles">出入记录</span>
                    <div class="access hidden" ref="access1">
                      <div class="accessItem between" v-for="i in 20" :key="i">
                        <img src="~@/assets/image/chartImg.png" alt="" />
                        <div class="between">
                          <div class="info between column textHidden-single">
                            <span>XXXX</span>
                            <p>XXXXXXXXXXXXXXXXXXX</p>
                          </div>
                          <div class="time">10:15</div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="基础配置" class="basics">
                <el-form :model="basicsForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="设备名称" prop="pass">
                    <el-input size="mini" v-model="basicsForm.name" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="设备编码" prop="checkPass">
                    <el-input size="mini" v-model="basicsForm.code" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="设备语言" prop="age">
                    <el-select v-model="basicsForm.language" placeholder="请选择" size="mini">
                      <el-option label="简体中文" value="zn"></el-option>
                      <el-option label="繁体中文" value="tc"></el-option>
                      <el-option label="英文" value="en"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="产品型号" prop="age">XXXX-XXX-XXX</el-form-item>
                  <el-form-item label="序列号" prop="age">XXXXXXXXXXXXXXX</el-form-item>
                  <el-form-item label="软件版本" prop="age">XXXXXXXXXXXXXXX</el-form-item>
                  <el-form-item label="运行时间" prop="age">XXXX:XX:XX</el-form-item>
                  <el-form-item>
                    <el-button type="primary">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="报警配置" class="alarm">
                <el-card class="box-card" style="background: rgba(255, 255, 255, 0)">
                  <div slot="header" class="clearfix">
                    <div>
                      <el-input clearable size="small" placeholder="输入信息查询" v-model="searchValue" class="input-with-select" @keyup.enter.native="search" @clear="inputClear">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                      </el-input>
                    </div>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddAlarmDialog">添加</el-button>
                  </div>
                  <!-- 表格 -->
                  <el-table stripe max-height="655" :data="alarmConfig" style="width: 100%">
                    <el-table-column type="index" label="#"> </el-table-column>
                    <el-table-column prop="name" label="名称" width="120"> </el-table-column>
                    <el-table-column prop="timeTemplate" label="时间模板" width="120"> </el-table-column>
                    <el-table-column prop="voice" label="声音">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.voice" active-color="#409eff" inactive-color="#dcdfe6"> </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态">
                      <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" active-color="#409eff" inactive-color="#dcdfe6"> </el-switch>
                      </template>
                    </el-table-column>
                    <el-table-column prop="content" label="内容"> </el-table-column>
                    <el-table-column prop="describe" label="描述"> </el-table-column>
                    <el-table-column label="操作" width="180">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditAlarmDialog(scope)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="del(scope, 'alarmConfig')"></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <el-pagination background :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                  </el-pagination>
                </el-card>
              </el-tab-pane>
              <el-tab-pane label="门卡管理">
                <el-card class="box-card" style="background: rgba(255, 255, 255, 0)">
                  <div slot="header" class="clearfix">
                    <div>
                      <el-input clearable size="small" placeholder="输入信息查询" v-model="searchValue" class="input-with-select" @keyup.enter.native="search" @clear="inputClear">
                        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
                      </el-input>
                    </div>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddAlarmDialog">添加</el-button>
                  </div>
                  <!-- 表格 -->
                  <el-table stripe max-height="655" :data="doorCard" style="width: 100%">
                    <el-table-column type="index" label="#"> </el-table-column>
                    <el-table-column prop="name" label="姓名"> </el-table-column>
                    <el-table-column prop="position" label="职位"> </el-table-column>
                    <el-table-column prop="tel" label="电话"> </el-table-column>
                    <el-table-column prop="email" label="邮箱"> </el-table-column>
                    <el-table-column prop="state" label="状态">
                      <template>
                        <el-tag size="mini">激活</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                      <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditAlarmDialog(scope)"></el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="del(scope, 'alarmConfig')"></el-button>
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 分页 -->
                  <el-pagination background :current-page="currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                  </el-pagination>
                </el-card>
              </el-tab-pane>
              <!-- <el-tab-pane label="权限管理">权限管理</el-tab-pane> -->
            </el-tabs>
          </el-col>
          <el-col :span="5">
            <tree-list isFilter></tree-list>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 报警配置弹出框 -->
    <el-dialog center :title="isEditState ? '编辑' : '添加'" :visible.sync="isAlarmDialog" :show-close="false" width="40%" @close="close">
      <el-form ref="alarmForm" label-position="right" label-width="80px" :model="alarmForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="alarmForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="时间模板" prop="timeTemplate">
          <el-input v-model="alarmForm.timeTemplate" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="alarmForm.content" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="alarmForm.describe" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAlarmDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            () => {
              isEditState ? editAlarm() : addAlarm()
            }
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog center :title="isEditState ? '编辑' : '添加'" :visible.sync="isDialog" :show-close="false" width="40%" @close="close">
      <el-form ref="formRef" label-position="right" label-width="80px" :model="formData" :rules="formRules">
        <el-form-item label="日期" prop="date">
          <!-- <el-input v-model="formData.date"></el-input> -->
          <el-date-picker value-format="yyyy-MM-dd" format="yyyy年MM月dd日" clearable v-model="formData.date" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            () => {
              isEditState ? edit() : add()
            }
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 表格展示框 -->
    <el-dialog class="tableBox" center fullscreen title="数据查询" :visible.sync="isFormDialog" width="80%">
      <el-card class="leftBox">
        <div slot="header" class="clearfix">
          <div style="width: auto">
            <el-date-picker
              style="margin-right: 10px"
              v-model="datePickerValue"
              size="small"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
            <el-input style="width: 200px; margin: 0 10px" size="small" placeholder="请输入内容" v-model="searchValue" class="input-with-select" @keyup.enter.native="search"> </el-input>
            <el-button type="primary" size="mini" icon="el-icon-search" @click="search">查询</el-button>
          </div>
          <div v-if="tableData.length !== 0">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="showAddDialog">添加</el-button>
            <el-button type="primary" size="mini" icon="el-icon-data-analysis" @click="exportToExcel">导出</el-button>
          </div>
        </div>
        <!-- 表格 -->
        <template v-if="tableData.length !== 0">
          <el-table id="table" max-height="655" :data="tableData" style="width: 100%">
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="date" label="日期" width="180"> </el-table-column>
            <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-delete-solid" @click="del(scope)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
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
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import { export_el_table_to_excel } from '@/plugins/Export2Excel'
import { CreateChart, CurrentDate, grid, color, colorArr, textColor, autoRoll } from '@/assets/js/blank'
import tableData from '@/assets/js/tableData'
export default {
  name: 'BlankElLifeDoor',

  data() {
    return {
      // 时间日期配置项
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      // 表单项规则
      formRules: {
        date: [{ required: true, message: '请输入日期', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        address: [{ type: 'string', required: true, message: '请输入地址', trigger: 'blur' }]
      },
      // 时间日期
      datePickerValue: '',
      // table表格数据
      tableData: [],
      // 分页
      currentPage: 1,
      // 弹出框弹出与否
      isDialog: false,
      isAlarmDialog: false,
      // 数据表格弹出与否
      isFormDialog: false,
      formData: {
        date: '',
        name: '',
        address: ''
      },
      // 当前选中项ID,
      tableId: 0,
      // 是否为编辑状态
      isEditState: true,
      // 选择器
      searchValue: '',
      // 当前所处页面
      activeName: 'timeData',
      // 出入记录
      accessRecord: new Array(20),
      time: '',
      week: '',
      years: '',
      timeInterVal: null,
      // 焦距
      focalValue: 0,
      // 报警配置
      alarmConfig: [],
      alarmForm: {
        name: '', // 名称
        timeTemplate: '', // 时间模板
        voice: false, // 是否开启声音警报
        state: false, // 是否启用
        content: '', // 内容
        describe: '' // 描述
      },
      // 基础配置
      basicsForm: {
        name: 'XXXXXX',
        code: 'x',
        language: 'zn'
      },
      // 门卡管理
      doorCard: []
    }
  },

  mounted() {
    autoRoll(this.$refs.access, 60)
    autoRoll(this.$refs.access1, 50)
    // this.waterChart()
    // this.typeChart()
    this.stateChart()
    this.inOutChart()
    this.getAlarmConfig()
    this.getDoorCard()
    this.timeInterVal = setInterval(() => {
      const obj = CurrentDate()
      // console.log(obj)
      this.week = obj.week
      this.years = obj.years
      this.time = obj.time
    }, 1000)
  },

  methods: {
    exportToExcel() {
      // 提供一个简单的测试数据，测试时注意要把上面数据注释掉
      const header = ['姓名', '年龄']
      const data = [
        ['tom', 12],
        ['jerry', 13]
      ]
      // export_json_to_excel(header, data, '测试内容')
      // export_table_to_excel('#table')
      export_el_table_to_excel('#table', '通行记录', true)
    },
    // 查询
    search() {
      if (!this.datePickerValue && !this.searchValue) {
        return this.$message.warning('请先选择查询条件！')
      }
      this.tableData = tableData
    },
    // 显示对话框
    showEditDialog(item) {
      this.isEditState = true
      this.tableId = item.$index
      this.isDialog = true
      this.formData = item.row
      this.$refs.formRef.resetFields()
    },
    showAddDialog() {
      this.isEditState = false
      this.formData = {
        date: '',
        name: '',
        address: ''
      }
      this.isDialog = true
      // this.$refs.formRef.resetFields()
    },
    add() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.tableData.push(this.formData)
        this.isDialog = false
        this.$message.success('添加成功！')
      })
    },
    // 编辑
    edit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.tableData[this.tableId] = this.formData
        this.isDialog = false
        this.$message.success('编辑成功！')
      })
    },
    // 删除
    async del(item, obj = 'tableData') {
      const isDel = await this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // console.log(isDel)
      // console.log(item)
      if (isDel === 'confirm') {
        this[obj].splice(item.$index, 1)
        return this.$message.success('删除成功！')
      }
    },
    close() {
      // this.$refs.formRef.resetFields()
    },
    // -----------------------门卡管理-------------------------
    getDoorCard() {
      const obj = {
        name: 'XXXX', // 姓名
        position: 'XXXX', // 职位
        tel: 123456789, // 电话
        email: '123456@qq.com', // 邮箱
        state: 1 // 是否启用 1:激活 2:冻结 3:注销
      }
      for (let i = 0; i < 10; i++) {
        this.doorCard.push(obj)
      }
    },
    // -----------------------报警配置-------------------------
    getAlarmConfig() {
      const obj = {
        name: 'XXXX-XXXX', // 名称
        timeTemplate: 'XXXXXXX', // 时间模板
        voice: false, // 是否开启声音警报
        state: true, // 是否启用
        content: '内容', // 内容
        describe: '描述' // 描述
      }
      for (let i = 0; i < 10; i++) {
        this.alarmConfig.push(obj)
      }
    },
    showAddAlarmDialog() {
      this.isEditState = false
      this.alarmForm = {
        name: '', // 名称
        timeTemplate: '', // 时间模板
        // voice: false, // 是否开启声音警报
        // state: true, // 是否启用
        content: '', // 内容
        describe: '' // 描述
      }
      this.isAlarmDialog = true
    },
    addAlarm() {
      this.$refs.alarmForm.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.alarmConfig.push(this.alarmForm)
        this.isAlarmDialog = false
        this.$message.success('添加成功！')
      })
    },
    // 显示对话框
    showEditAlarmDialog(item) {
      this.isEditState = true
      this.tableId = item.$index
      this.isAlarmDialog = true
      this.alarmForm = JSON.parse(JSON.stringify(item.row))
      this.$refs.alarmForm.resetFields()
    },
    // 编辑
    editAlarm() {
      this.$refs.alarmForm.validate((valid) => {
        if (!valid) return this.$message.error('输入框不能为空!')
        this.alarmConfig[this.tableId] = this.alarmForm
        console.log(this.alarmConfig)
        this.isAlarmDialog = false
        this.$message.success('编辑成功！')
      })
    },
    // ---------------------------------------------------
    // 门禁运行状态
    stateChart() {
      const myData = ['办公区', '设备区', '仓库区', '通行区']
      // 全彩屏，双基色屏，简易屏，条形屏
      const offLine = [
        [20, 40, 60, 60],
        [10, 30, 50, 20],
        [50, 20, 40, 10],
        [20, 10, 30, 40]
      ]

      const onLine = [
        [10, 20, 20, 40],
        [20, 10, 40, 30],
        [30, 30, 30, 20],
        [40, 40, 40, 10]
      ]

      const offLineSum = [100, 100, 180, 130]
      const onLineSum = [100, 100, 130, 100]

      // backgroundColor: '#11356D',
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
            text: '设备运行状态',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: [
          {
            // 图例
            top: 0,
            left: 'center', // 图例距离左侧距离(此处水平居中)
            textStyle: {
              // 图例文本样式
              color: '#fff'
            },
            itemGap: 100,

            selectedMode: false, // 图例点击失效
            data: ['脱机状态', '联机状态']
          },
          {
            // 图例
            bottom: 0,
            left: 'center', // 图例距离左侧距离(此处水平居中)
            textStyle: {
              // 图例文本样式
              color: '#fff'
            },
            selectedMode: false, // 图例点击失效
            // data: ['全彩屏', '双基色屏', '简易屏', '条形屏']
            data: ['电磁锁', '电插锁', '基站锁', '电控锁']
          }
        ],
        tooltip: {
          // 提示框
          show: true,
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器配置项。
            type: 'shadow' // 'line' 直线指示器;'shadow' 阴影指示器.
          },
          // formatter: '{b}<br/>脱机: {c}' // 提示框所提示的文本内容
          formatter: function (params) {
            const fullScreenColor = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#F59A3F;"></span>' // 全彩屏颜色
            const doubleScreenColor = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#F2C751;"></span>' // 双基色屏颜色
            const simpleScreenColor = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#296FFB;"></span>' // 简易屏颜色
            const lineScreenColor = '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#4AA5EA;"></span>' // 条形屏颜色
            const fullScreen = params[0] // 全彩屏序列
            const doubleScreen = params[1] // 双基色屏序列
            const simpleScreen = params[2] // 简易屏屏序列
            const lineScreen = params[3] // 条形屏屏序列
            const bg = params[4] // 背景区分联机与脱机
            const status = bg.seriesName === '联机状态' ? '<span style="display:inline-block;color:#2087FE;">联机</span>' : '<span style="display:inline-block;color:#DC3239;">脱机</span>'
            return (
              `${fullScreen.name}(${status})</br>` +
              `${fullScreenColor}${fullScreen.seriesName}：${fullScreen.value}</br>` +
              `${doubleScreenColor}${doubleScreen.seriesName}：${doubleScreen.value}</br>` +
              `${simpleScreenColor}${simpleScreen.seriesName}：${simpleScreen.value}</br>` +
              `${lineScreenColor}${lineScreen.seriesName}：${lineScreen.value}</br>`
            )
          }
        },
        grid: [
          {
            // 左边
            show: false,
            left: 0,
            // right: 0,
            top: 10,
            bottom: 16,
            containLabel: true,
            width: '43%'
          },
          {
            // 中间
            show: false,
            left: '55%',
            top: 32,
            bottom: 16,
            width: '14%'
          },
          {
            // 右边
            show: false,
            right: '2%',
            top: 10,
            bottom: 16,
            containLabel: true,
            width: '43%'
          }
        ],
        // X轴线配置
        xAxis: [
          {
            // 左侧区域
            gridIndex: 0, // x 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
            type: 'value', // 轴线类型: 数值轴
            position: 'top', // 轴线位置(此处位于顶部)
            inverse: true, // 是否是反向坐标轴.[ default: false ]
            axisLine: {
              show: false // 轴线不显示
            },
            axisTick: {
              show: false // 轴线刻度不显示
            },
            axisLabel: {
              // 轴线刻度标签
              show: true, // 显示刻度标签
              textStyle: {
                // 标签样式
                color: '#153D7D64',
                fontSize: 12
              }
            },
            splitLine: {
              // 垂直于X轴的分隔线
              show: true, // 显示分隔线
              lineStyle: {
                // 分隔线样式
                color: '#153D7D64',
                width: 1,
                type: 'solid'
              }
            }
            // 强制设置坐标轴分割间隔
            // interval: 50,
            // min: 0, // 最小值
            // max: 200 // 最大值
          },
          {
            // 中间区域
            gridIndex: 1,
            show: false // 中间部分不显示X轴
          },
          {
            // 右侧区域
            gridIndex: 2,
            type: 'value',
            position: 'top',
            inverse: false, // 是否是反向坐标轴.[ default: false ]
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#153D7D64',
                fontSize: 12
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#153D7D64',
                width: 1,
                type: 'solid'
              }
            }
            // 强制设置坐标轴分割间隔
            // interval: 50,
            // min: 0, // 最小值
            // max: 200 // 最大值
          }
        ],
        // Y轴线配置
        yAxis: [
          {
            // 左侧区域
            gridIndex: 0, // y 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
            type: 'category', // 轴线类型: 类目轴
            // 类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
            boundaryGap: true, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
            inverse: true, // 是否是反向坐标轴.[ default: false ]
            position: 'right', // y轴的位置。'left' or 'right'
            axisLine: {
              show: false // y轴线不显示
            },
            axisTick: {
              show: false, // y轴线刻度不显示
              lineStyle: {
                // 刻度线样式
                color: '#11356D'
              }
            },
            axisLabel: {
              show: false // 刻度标签不显示
            },
            data: myData // Y轴(这里是类目轴)的类目数据
          },
          {
            gridIndex: 1, // 中间区域
            type: 'category',
            boundaryGap: true,
            inverse: true,
            position: 'left', // y轴的位置。'left' or 'right'
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true, // 显示中间部分的Y轴刻度标签(中间的文字)
              textStyle: {
                // 标签样式
                color: '#cccccc',
                fontSize: 12
              }
            },
            data: myData
          },
          {
            // 右侧区域
            gridIndex: 2,
            type: 'category',
            boundaryGap: true,
            inverse: true,
            position: 'left',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false,
              lineStyle: {
                // 刻度线样式
                color: '#153D7D'
              }
            },
            axisLabel: {
              show: false
            },
            data: myData
          }
        ],
        series: [
          {
            name: '电磁锁', // 系列名称
            type: 'bar',
            // barGap: 5, // 柱间距离
            barWidth: 15, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            stack: '1', // 相同就是堆叠
            // barGap:'-100%', //重叠
            label: {
              show: true,
              position: 'top',
              color: '#F59A3F',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#F59A3F'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 鼠标指向高亮
              show: true,
              label: {
                color: '#F59A3F96' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#F59A3F96' // 高亮状态下柱条颜色
              }
            },
            data: offLine[0] // 系列中的数据内容数组
          },
          {
            name: '电插锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            stack: '1', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#F2C751',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#F2C751'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 高亮
              show: true,
              label: {
                color: '#F2C75196' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#F2C75196' // 高亮状态下柱条颜色
              }
            },
            data: offLine[1] // 系列中的数据内容数组
          },
          {
            name: '基站锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            stack: '1', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#296FFB',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#296FFB'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 高亮
              show: true,
              label: {
                color: '#296FFB96' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#296FFB96' // 高亮状态下柱条颜色
              }
            },
            data: offLine[2] // 系列中的数据内容数组
          },
          {
            name: '电控锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            stack: '1', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#4AA5EA',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#4AA5EA'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 高亮
              show: true,
              label: {
                color: '#4AA5EA96' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#4AA5EA96' // 高亮状态下柱条颜色
              }
            },
            data: offLine[3] // 系列中的数据内容数组
          },
          // 脱机背景
          {
            name: '脱机状态', // 系列名称
            type: 'bar',
            // barGap: 5, // 柱间距离
            barWidth: 21, // 柱子宽度
            xAxisIndex: 0, // 对应在X轴的grid索引
            yAxisIndex: 0, // 对应在Y轴的grid索引
            // stack: '1', // 相同就是堆叠
            barGap: '-120%', // 重叠
            itemStyle: {
              // 柱条样式。
              // color: '#DC3239',
              color: 'transparent',
              borderWidth: 1,
              borderColor: '#DC3239',
              shadowColor: '#DC3239',
              shadowBlur: 20
            },
            emphasis: {
              scale: false
            },
            data: offLineSum // 系列中的数据内容数组
          },

          {
            name: '电磁锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            stack: '2', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#F59A3F',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#F59A3F'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 鼠标指向高亮
              show: true,
              label: {
                color: '#F59A3F96' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#F59A3F96' // 高亮状态下柱条颜色
              }
            },
            data: onLine[0] // 系列中的数据内容数组
          },
          {
            name: '电插锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            stack: '2', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#F2C751',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#F2C751'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 高亮
              show: true,
              label: {
                color: '#F2C75196' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#F2C75196' // 高亮状态下柱条颜色
              }
            },
            data: onLine[1] // 系列中的数据内容数组
          },
          {
            name: '基站锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            stack: '2', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#296FFB',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#296FFB'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 高亮
              show: true,
              label: {
                color: '#296FFB96' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#296FFB96' // 高亮状态下柱条颜色
              }
            },
            data: onLine[2] // 系列中的数据内容数组
          },
          {
            name: '电控锁', // 系列名称
            type: 'bar',
            barWidth: 15, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            stack: '2', // 相同就是堆叠
            label: {
              show: true,
              position: 'top',
              color: '#4AA5EA',
              fontSize: 10
            },
            itemStyle: {
              // 柱条样式。
              color: '#4AA5EA'
              // borderWidth:1,
              // borderColor:'transparent'
            },
            emphasis: {
              // 高亮
              show: true,
              label: {
                color: '#4AA5EA96' // 高亮状态下柱条颜色
              },
              itemStyle: {
                color: '#4AA5EA96' // 高亮状态下柱条颜色
              }
            },
            data: onLine[3] // 系列中的数据内容数组
          },
          // 联机背景
          {
            name: '联机状态', // 系列名称
            type: 'bar',
            // barGap: 5, // 柱间距离
            barWidth: 21, // 柱子宽度
            xAxisIndex: 2, // 对应在X轴的grid索引
            yAxisIndex: 2, // 对应在Y轴的grid索引
            // stack: '2', // 相同就是堆叠
            barGap: '-120%', // 重叠
            itemStyle: {
              // 柱条样式。
              // color: '#2087FE',
              color: 'transparent',
              borderWidth: 1,
              borderColor: '#2087FE'
            },
            data: onLineSum // 系列中的数据内容数组
          }
        ]
      }
      CreateChart(this.$refs.state, option)
    },
    waterChart() {
      const value = 0.53
      const data = [value, value, value]
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
            text: '报警处理百分比',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        grid,
        series: [
          {
            type: 'liquidFill',
            radius: '55%',
            z: 6,
            center: ['25%', '50%'],
            // color: ['#f8eeb0', '#fddc75', '#fbad17'],
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: 'rgba(255,255,255, 0)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(251, 173, 23, .2)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(251, 173, 23, .8)'
                  }
                ],
                globalCoord: false
              }
            ],
            data,
            backgroundStyle: {
              borderWidth: 1,
              color: 'rgba(255,255,255, 0)' // 球体本景色
              // color: 'transparent'
            },
            amplitude: '6  %', // 波浪的振幅
            label: {
              normal: {
                // formatter: 0.87 * 100 + '\n%',
                formatter: value * 100 + '\n{d|%}',
                //  formatter: function(params){
                //     return params.value* 100 + " \n%";
                // },
                rich: {
                  d: {
                    fontSize: 20
                  }
                },
                textStyle: {
                  fontSize: '26',
                  // fontWeight: '300',
                  color: '#a06a0a',
                  textAlign: 'center',
                  textBorderColor: 'rgba(0, 0, 0, 0)',
                  textShadowColor: '#fff',
                  textShadowBlur: '0',
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 1
                }
              }
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0
              },
              borderDistance: 0
            }
          },
          {
            name: '5',
            type: 'pie',
            z: 5,
            radius: ['55%', '0%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 20
                }
              }
            ]
          },
          {
            name: '4',
            type: 'pie',
            z: 4,
            radius: ['54.5%', '0%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 4,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              }
            ]
          },
          {
            name: '3',
            type: 'pie',
            z: 3,
            radius: ['0%', '60%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '2',
            type: 'pie',
            z: 2,
            radius: ['0%', '56.5%'],
            center: ['25%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ]),
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '1',
            type: 'pie',
            z: 1,
            radius: ['0%', '68%'],
            center: ['25%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#f3f3f5'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '0',
            type: 'pie',
            z: 0,
            radius: ['0%', '68.5%'],
            center: ['25%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fff'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ]),
                  shadowBlur: 3,
                  shadowColor: 'rgba(140, 149, 166, .6)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            // value: 50, //  内容 配合formatter
            type: 'liquidFill',
            radius: '55%', // 控制中间圆球的尺寸（此处可以理解为距离外圈圆的距离控制）
            center: ['75%', '50%'],
            z: 6,
            data: [value + 0.1, { value, direction: 'left' }, value - 0.1, value - 0.2], // data个数代表波浪数
            backgroundStyle: {
              borderWidth: 1,
              color: 'transparent'
            },
            amplitude: '6  %', // 波浪的振幅
            // 修改波浪颜色
            // color: ['#0286ea', 'l#0b99ff'], // 每个波浪不同颜色，颜色数组长度为对应的波浪个数
            color: [
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 1,
                    color: 'rgba(255,255,255, 0)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(0, 155, 219, .2)'
                  },
                  {
                    offset: 0,
                    color: 'rgba(0, 155, 219, .8)'
                  }
                ],
                globalCoord: false
              }
            ],
            label: {
              normal: {
                // formatter: 0.87 * 100 + '\n%',
                formatter: value * 100 + '\n{d|%}',
                //  formatter: function(params){
                //     return params.value* 100 + " \n%";
                // },
                rich: {
                  d: {
                    fontSize: 20
                  }
                },
                textStyle: {
                  fontSize: '26',
                  // fontWeight: '300',
                  color: '#02456d',
                  textAlign: 'center',
                  textBorderColor: 'rgba(0, 0, 0, 0)',
                  textShadowColor: '#fff',
                  textShadowBlur: '0',
                  textShadowOffsetX: 0,
                  textShadowOffsetY: 1
                }
              }
            },
            outline: {
              show: true,
              itemStyle: {
                borderWidth: 0
              },
              borderDistance: 0
            }
          },
          {
            name: '5',
            type: 'pie',
            z: 5,
            radius: ['55%', '0%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 20
                }
              }
            ]
          },
          {
            name: '4',
            type: 'pie',
            z: 4,
            radius: ['54.5%', '0%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: '#e7e8ea',
                  shadowBlur: 4,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              }
            ]
          },
          {
            name: '3',
            type: 'pie',
            z: 3,
            radius: ['0%', '60%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '2',
            type: 'pie',
            z: 2,
            radius: ['0%', '56.5%'],
            center: ['75%', '50%'],
            // // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fefefe'
                    },
                    {
                      offset: 1,
                      color: '#e7e8ea'
                    }
                  ]),
                  shadowBlur: 15,
                  shadowColor: '#8c95a6',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '1',
            type: 'pie',
            z: 1,
            radius: ['0%', '68%'],
            center: ['75%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#f3f3f5'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ])
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          },
          {
            name: '0',
            type: 'pie',
            z: 0,
            radius: ['0%', '68.5%'],
            center: ['75%', '50%'],
            // hoverAnimation: false,
            itemStyle: {
              label: {
                show: false
              }
            },
            data: [
              {
                value: 100,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: '#fff'
                    },
                    {
                      offset: 1,
                      color: '#e0e1e5'
                    }
                  ]),
                  shadowBlur: 3,
                  shadowColor: 'rgba(140, 149, 166, .6)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0
                }
              },
              {
                value: 0,
                itemStyle: {
                  color: 'transparent'
                }
              }
            ]
          }
        ]
      }

      CreateChart(this.$refs.water, option)
    },
    typeChart() {
      // Schema:
      // date,AQIindex,PM2.5,PM10,CO,NO2,SO2
      const dataBJ = [
        [55, 9, 56, 0.46, 18, 6, 1],
        [25, 11, 21, 0.65, 34, 9, 2],
        [56, 7, 63, 0.3, 14, 5, 3],
        [33, 7, 29, 0.33, 16, 6, 4],
        [42, 24, 44, 0.76, 40, 16, 5],
        [82, 58, 90, 1.77, 68, 33, 6],
        [74, 49, 77, 1.46, 48, 27, 7],
        [78, 55, 80, 1.29, 59, 29, 8],
        [267, 216, 280, 4.8, 108, 64, 9],
        [185, 127, 216, 2.52, 61, 27, 10],
        [39, 19, 38, 0.57, 31, 15, 11],
        [41, 11, 40, 0.43, 21, 7, 12],
        [64, 38, 74, 1.04, 46, 22, 13],
        [108, 79, 120, 1.7, 75, 41, 14],
        [108, 63, 116, 1.48, 44, 26, 15],
        [33, 6, 29, 0.34, 13, 5, 16],
        [94, 66, 110, 1.54, 62, 31, 17],
        [186, 142, 192, 3.88, 93, 79, 18],
        [57, 31, 54, 0.96, 32, 14, 19],
        [22, 8, 17, 0.48, 23, 10, 20],
        [39, 15, 36, 0.61, 29, 13, 21],
        [94, 69, 114, 2.08, 73, 39, 22],
        [99, 73, 110, 2.43, 76, 48, 23],
        [31, 12, 30, 0.5, 32, 16, 24],
        [42, 27, 43, 1, 53, 22, 25],
        [154, 117, 157, 3.05, 92, 58, 26],
        [234, 185, 230, 4.09, 123, 69, 27],
        [160, 120, 186, 2.77, 91, 50, 28],
        [134, 96, 165, 2.76, 83, 41, 29],
        [52, 24, 60, 1.03, 50, 21, 30],
        [46, 5, 49, 0.28, 10, 6, 31]
      ]
      const dataGZ = [
        [26, 37, 27, 1.163, 27, 13, 1],
        [85, 62, 71, 1.195, 60, 8, 2],
        [78, 38, 74, 1.363, 37, 7, 3],
        [21, 21, 36, 0.634, 40, 9, 4],
        [41, 42, 46, 0.915, 81, 13, 5],
        [56, 52, 69, 1.067, 92, 16, 6],
        [64, 30, 28, 0.924, 51, 2, 7],
        [55, 48, 74, 1.236, 75, 26, 8],
        [76, 85, 113, 1.237, 114, 27, 9],
        [91, 81, 104, 1.041, 56, 40, 10],
        [84, 39, 60, 0.964, 25, 11, 11],
        [64, 51, 101, 0.862, 58, 23, 12],
        [70, 69, 120, 1.198, 65, 36, 13],
        [77, 105, 178, 2.549, 64, 16, 14],
        [109, 68, 87, 0.996, 74, 29, 15],
        [73, 68, 97, 0.905, 51, 34, 16],
        [54, 27, 47, 0.592, 53, 12, 17],
        [51, 61, 97, 0.811, 65, 19, 18],
        [91, 71, 121, 1.374, 43, 18, 19],
        [73, 102, 182, 2.787, 44, 19, 20],
        [73, 50, 76, 0.717, 31, 20, 21],
        [84, 94, 140, 2.238, 68, 18, 22],
        [93, 77, 104, 1.165, 53, 7, 23],
        [99, 130, 227, 3.97, 55, 15, 24],
        [146, 84, 139, 1.094, 40, 17, 25],
        [113, 108, 137, 1.481, 48, 15, 26],
        [81, 48, 62, 1.619, 26, 3, 27],
        [56, 48, 68, 1.336, 37, 9, 28],
        [82, 92, 174, 3.29, 0, 13, 29],
        [106, 116, 188, 3.628, 101, 16, 30],
        [118, 50, 0, 1.383, 76, 11, 31]
      ]
      const dataSH = [
        [91, 45, 125, 0.82, 34, 23, 1],
        [65, 27, 78, 0.86, 45, 29, 2],
        [83, 60, 84, 1.09, 73, 27, 3],
        [109, 81, 121, 1.28, 68, 51, 4],
        [106, 77, 114, 1.07, 55, 51, 5],
        [109, 81, 121, 1.28, 68, 51, 6],
        [106, 77, 114, 1.07, 55, 51, 7],
        [89, 65, 78, 0.86, 51, 26, 8],
        [53, 33, 47, 0.64, 50, 17, 9],
        [80, 55, 80, 1.01, 75, 24, 10],
        [117, 81, 124, 1.03, 45, 24, 11],
        [99, 71, 142, 1.1, 62, 42, 12],
        [95, 69, 130, 1.28, 74, 50, 13],
        [116, 87, 131, 1.47, 84, 40, 14],
        [108, 80, 121, 1.3, 85, 37, 15],
        [134, 83, 167, 1.16, 57, 43, 16],
        [79, 43, 107, 1.05, 59, 37, 17],
        [71, 46, 89, 0.86, 64, 25, 18],
        [97, 71, 113, 1.17, 88, 31, 19],
        [84, 57, 91, 0.85, 55, 31, 20],
        [87, 63, 101, 0.9, 56, 41, 21],
        [104, 77, 119, 1.09, 73, 48, 22],
        [87, 62, 100, 1, 72, 28, 23],
        [168, 128, 172, 1.49, 97, 56, 24],
        [65, 45, 51, 0.74, 39, 17, 25],
        [39, 24, 38, 0.61, 47, 17, 26],
        [39, 24, 39, 0.59, 50, 19, 27],
        [93, 68, 96, 1.05, 79, 29, 28],
        [188, 143, 197, 1.66, 99, 51, 29],
        [174, 131, 174, 1.55, 108, 50, 30],
        [187, 143, 201, 1.39, 89, 53, 31]
      ]
      const lineStyle = {
        width: 1,
        opacity: 0.5
      }
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
            text: '门禁类型',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        legend: {
          bottom: 0,
          data: ['Beijing', 'Shanghai', 'Guangzhou'],
          itemGap: 20,
          textStyle: {
            color: '#9ec6d7',
            fontSize: 10
          },
          selectedMode: 'single'
        },
        grid: {
          ...grid,
          bottom: '5%'
        },
        radar: {
          indicator: [
            { name: 'AQI', max: 300 },
            { name: 'PM2.5', max: 250 },
            { name: 'PM10', max: 300 },
            { name: 'CO', max: 5 },
            { name: 'NO2', max: 200 },
            { name: 'SO2', max: 100 }
          ],
          shape: 'circle',
          splitNumber: 5,
          axisName: {
            color: 'rgb(238, 197, 102)'
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)', 'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)', 'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'].reverse()
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102, 0.5)'
            }
          }
        },
        series: [
          {
            name: 'Beijing',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            symbol: 'none',
            itemStyle: {
              color: '#F9713C'
            },
            areaStyle: {
              opacity: 0.1
            }
          },
          {
            name: 'Shanghai',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataSH,
            symbol: 'none',
            itemStyle: {
              color: '#B3E4A1'
            },
            areaStyle: {
              opacity: 0.05
            }
          },
          {
            name: 'Guangzhou',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataGZ,
            symbol: 'none',
            itemStyle: {
              color: 'rgb(238, 197, 102)'
            },
            areaStyle: {
              opacity: 0.05
            }
          }
        ]
      }

      CreateChart(this.$refs.type, option)
    },
    stateChart1() {
      const data = []
      const dataCount = 10
      const startTime = +new Date()
      const categories = ['A', 'B', 'C']
      const types = [
        { name: 'JS Heap', color: '#7b9ce1' },
        { name: 'Documents', color: '#bd6d6c' },
        { name: 'Nodes', color: '#75d874' },
        { name: 'Listeners', color: '#e0bc78' },
        { name: 'GPU Memory', color: '#dc77dc' },
        { name: 'GPU', color: '#72b362' }
      ]
      // Generate mock data
      categories.forEach((category, index) => {
        let baseTime = startTime
        for (let i = 0; i < dataCount; i++) {
          const typeItem = types[Math.round(Math.random() * (types.length - 1))]
          const duration = Math.round(Math.random() * 10000)
          data.push({
            name: typeItem.name,
            value: [index, baseTime, (baseTime += duration), duration],
            itemStyle: {
              color: typeItem.color
            }
          })
          baseTime += Math.round(Math.random() * 2000)
        }
      })
      const renderItem = (params, api) => {
        const categoryIndex = api.value(0)
        const start = api.coord([api.value(1), categoryIndex])
        const end = api.coord([api.value(2), categoryIndex])
        const height = api.size([0, 1])[1] * 0.6
        const rectShape = this.$echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          }
        )
        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style()
          }
        )
      }
      const option = {
        backgroundColor: '',
        color: colorArr,
        tooltip: {
          formatter: function (params) {
            return params.marker + params.name + ': ' + params.value[3] + ' ms'
          }
        },
        title: [
          {
            text: '单位：MS',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '设备运行状态',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            filterMode: 'weakFilter',
            showDataShadow: false,
            top: 400,
            labelFormatter: ''
          },
          {
            type: 'inside',
            filterMode: 'weakFilter'
          }
        ],
        grid: {
          ...grid,
          left: 0,
          bottom: 0
        },
        xAxis: {
          min: startTime,
          scale: true,
          axisLabel: {
            formatter: (val) => {
              return Math.max(0, val - startTime) + ' ms'
            },
            color: textColor
          },
          axisLine: {
            lineStyle: {
              color
            }
          }
        },
        yAxis: {
          data: categories,
          axisLine: {
            lineStyle: {
              color
            }
          },
          splitLine: {
            lineStyle: {
              color
            }
          },
          axisLabel: {
            color: textColor
          }
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8
            },
            encode: {
              x: [1, 2],
              y: 0
            },
            data: data
          }
        ]
      }

      CreateChart(this.$refs.state, option)
    },
    inOutChart() {
      const icon =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAABDCAMAAABjnP3jAAAAilBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAADT09MAAAAAAAAAAAAAAAD////8/Pz5+fnr6+v8/Pzr6+vZ2dn09PTFxcX+/v719fX6+vrf39+5ubnDw8MSEhIrKytRUVF2dnZAQEDi4uLi4uLk5OTk5OT///+tdFIzAAAALXRSTlMABQgNFBwDNS4mCxEYIyAamisoMS364t9b57qWj3b0s6mec28rJhMNDKemZ2YvJtR9AAACMUlEQVRo3u2ZaW/iMBBAaTDdxI7tOCeF0vvaY/7/39sZJ2BgKyUrxNBKfh+RyHtMJkhJZl+Ja+LqzHjJ53rvTs5OX/Gp/n350DZwZu66h+X7vwmoT5YtMNEuE0w48n/cAiO3H0NB+P2cfioYZhDmD8yEs0ABydsNMHPzllDA4Jd/gJ3fEguGADm/B3bu5xIDhgGoFthpFY2gD5iLBthpxHwbIFUOFyBX8osE4ApYuAAWl4ACaAUuE0BLMAQs4AIsYkAMiAExIAbEgBgQA2JADIgB+wF3wE5zENABO+1+gF0BOytLAdt7ww2ws6F7w93d8Sv/M6LXg9tz8wzMPJsQQFuoH4GVR007uA2gEbz8AkZ+vtAAKMAXSBpB+dQBE91TSQOQ5N+NAAvSzapr4Mw03WqToj8MoN8CX+DSqvoxjQKOKCZ+sapS5/20AeFZsaQCozPn6jodpcLO4tiPH6aj1LVzmTbkl1d9QCgQmGC0zsYpHc6qOPDj73JlNo7WBvVi5w8FiU/IrV2MY2hWabHnT11GRx7H2tzrk+APBZiglJhATqerTIvgL2msuZiAUqgP/lBACYnEiAlgJu1sXQz+mrZK4JEnINFO+utT3prJfmczKiB/1m+V/I+3Zie+N8QGJazJ3Bpg7TJjhUL7ae8Np+Mr+wJdrtel7v3+2DMWqIGuGkG7SNsnaKtZ7McFIrc2F+z+UKAUXVfM/lDg/zr8Rc3tDwUefn9I8PDrQ4Jn9q35C4Ev35B0ZZBdAAAAAElFTkSuQmCC'

      const wanchengData = [180, 119, 155, 101, 65]
      const mubiaoData = [250, 250, 250, 250, 250]

      const colors = [
        ['#389af4', '#dfeaff'],
        ['#ff8c37', '#ffdcc3'],
        ['#ffc257', '#ffedcc'],
        ['#fd6f97', '#fed4e0'],
        ['#a181fc', '#e3d9fe']
      ]
      const option = {
        backgroundColor: '',
        title: [
          {
            text: '单位：次',
            left: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: '门禁出入情况',
            right: '6px',
            textStyle: {
              color: '#9ec6d7',
              fontSize: 10
            }
          },
          {
            text: 'a',
            left: '13.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#389af4',
              textAlign: 'center'
            }
          },
          {
            text: 'b',
            left: '31.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#ff8c37',
              textAlign: 'center'
            }
          },
          {
            text: 'c',
            left: '49.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#ffc257',
              textAlign: 'center'
            }
          },
          {
            text: 'd',
            left: '67.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#fd6f97',
              textAlign: 'center'
            }
          },
          {
            text: 'e',
            left: '85.5%',
            top: '80%',
            textAlign: 'center',
            textStyle: {
              fontWeight: 'normal',
              fontSize: '16',
              color: '#a181fc',
              textAlign: 'center'
            }
          }
        ],
        grid: [
          {
            left: '5%',
            top: '5%',
            bottom: '30%',
            right: '5%'
          },
          {
            left: '5%',
            top: '15%',
            bottom: '30%',
            right: '5%'
          }
        ],
        legend: {
          show: false,
          data: ['完成', '目标'],
          align: 'left',
          right: 0,
          textStyle: {
            color: '#434e79',
            fontSize: 14,
            fontWeight: 400
          },
          itemWidth: 14,
          itemHeight: 14,
          itemGap: 35
        },
        tooltip: {
          show: false,
          trigger: 'axis',
          padding: [8, 10],
          textStyle: {
            color: '#fff'
          },
          backgroundColor: 'rgba(0,0,0,0.5)',
          axisPointer: {
            type: 'none'
          }
        },
        xAxis: [
          {
            type: 'category',
            gridIndex: 0,
            data: ['A', 'B', 'C', 'D', 'E'],
            axisLine: {
              lineStyle: {
                color: '#E0E2E5'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: '#434e79',
                fontSize: 16,
                fontWeight: 400
              }
            }
          },
          {
            type: 'category',
            gridIndex: 1,
            data: ['a', 'b', 'c', 'd', 'e'],
            axisLine: {
              lineStyle: {
                color: '#E0E2E5'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#434e79',
                fontSize: 16,
                fontWeight: 400
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            gridIndex: 0,
            position: [-20, 0, 0, 0],
            show: true,
            interval: 50,
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#E0E2E5'
              }
            }
          },
          {
            type: 'value',
            gridIndex: 1,
            position: [20, 0, 0, 0],
            offset: [-50],
            show: true,
            max: 200,
            interval: 50,
            axisLine: {
              show: false
            },
            axisLabel: {
              padding: [20, 0, 0, 0],
              verticalAlign: 'top',
              // backgroundColor:'red',
              formatter: function (value, index) {
                if (value === 0) {
                  value = ''
                  return value
                } else {
                  return value
                }
              }
            },
            splitLine: {
              lineStyle: {
                color: '#E0E2E5'
              }
            }
          }
        ],
        series: [
          {
            name: '目标',
            type: 'bar',
            max: 250,
            silent: true,
            barMaxWidth: 20,
            xAxisIndex: 0,
            yAxisIndex: 0,
            symbol: 'none',
            z: 0,
            itemStyle: {
              normal: {
                color: 'rgba(255,255,255,0)'
              }
            },
            data: mubiaoData,
            markLine: {
              symbol: ['none', 'none'],
              symbolSize: 15,
              lineStyle: {
                color: '#E0E2E5'
              },
              label: {
                show: false
              },
              data: [
                {
                  xAxis: 'A'
                },
                {
                  xAxis: 'B'
                },
                {
                  xAxis: 'C'
                },
                {
                  xAxis: 'D'
                },
                {
                  xAxis: 'E'
                }
              ]
            },
            markPoint: {
              symbol: 'circle',
              symbolSize: 15,
              label: {
                show: false
              },
              data: [
                {
                  yAxis: 250,
                  xAxis: 'A',
                  itemStyle: {
                    normal: {
                      color: '#389af4'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'B',
                  itemStyle: {
                    normal: {
                      color: '#ff8c37'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'C',
                  itemStyle: {
                    normal: {
                      color: '#ffc257'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'D',
                  itemStyle: {
                    normal: {
                      color: '#fd6f97'
                    }
                  }
                },
                {
                  yAxis: 250,
                  xAxis: 'E',
                  itemStyle: {
                    normal: {
                      color: '#a181fc'
                    }
                  }
                }
              ]
            }
          },
          {
            name: '完成',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            silent: false,
            barMaxWidth: 20,
            z: 1,
            itemStyle: {
              normal: {
                barBorderRadius: [10, 10, 0, 0],
                color: (params) => {
                  const colors = ['#dfeaff', '#ffdcc3', '#ffedcc', '#fed4e0', '#e3d9fe']
                  return colors[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'top',
                  distance: 0,
                  color: '#000',
                  fontSize: 16,
                  backgroundColor: {
                    image: icon
                  },
                  padding: [10, 15, 20, 15]
                }
              }
            },
            data: wanchengData,
            emphasis: {
              itemStyle: {
                color: '#389af4'
              }
            }
          },
          {
            // 折线
            data: [120, 75, 100, 80, 45],
            type: 'line',
            smooth: true,

            name: '折线图',
            symbol: 'none',
            lineStyle: {
              color: '#3275FB',
              width: 4,
              shadowColor: 'rgba(0, 0, 0, 0.3)', // 设置折线阴影
              shadowBlur: 5,
              shadowOffsetY: 20
            },
            areaStyle: {
              // 区域填充样式
              normal: {
                // 线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(25,163,223,.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(25,163,223, 0)'
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(25,163,223, 0.5)', // 阴影颜色
                shadowBlur: 20 // shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
              }
            }
          },
          {
            // piek
            name: 'a',
            type: 'pie',
            xAxisIndex: 2,
            yAxisIndex: 2,
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#82C0F9',
                shadowColor: '#389af4',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: true,
            center: ['14%', '85%'],
            data: [
              {
                value: 54,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#389af4'
                    }
                  }
                }
              },
              {
                value: 46,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#dfeaff'
                  },
                  emphasis: {
                    color: '#dfeaff'
                  }
                }
              }
            ]
          },
          {
            name: 'b',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#FFB379',
                shadowColor: '#ff8c37',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['32%', '85%'],
            data: [
              {
                value: 44,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#ff8c37'
                    }
                  }
                }
              },
              {
                value: 56,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#ffdcc3'
                  },
                  emphasis: {
                    color: '#ffdcc3'
                  }
                }
              }
            ]
          },
          {
            name: 'c',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#FFD184',
                shadowColor: '#ffc257',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['50%', '85%'],
            data: [
              {
                value: 35,
                name: 'c',
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#ffc257'
                    }
                  }
                }
              },
              {
                value: 65,
                name: 'invisible',
                itemStyle: {
                  borderRadius: 7,
                  normal: {
                    color: '#ffedcc'
                  },
                  emphasis: {
                    color: '#ffedcc'
                  }
                }
              }
            ]
          },
          {
            name: 'd',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#FD84A5',
                shadowColor: '#fd6f97',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['68%', '85%'],
            data: [
              {
                value: 30,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },

                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#fd6f97'
                    }
                  }
                }
              },
              {
                value: 70,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#fed4e0'
                  },
                  emphasis: {
                    color: '#fed4e0'
                  }
                }
              }
            ]
          },
          {
            name: 'e',
            type: 'pie',
            clockWise: true,
            radius: [55, 65],
            itemStyle: {
              normal: {
                borderRadius: 7,
                color: '#C0ACFD',
                shadowColor: '#a181fc',
                shadowBlur: 0,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            center: ['86%', '85%'],
            data: [
              {
                value: 20,
                label: {
                  normal: {
                    formatter: function (params) {
                      return params.value + '%'
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontWeight: 'bold',
                      color: '#a181fc'
                    }
                  }
                }
              },
              {
                value: 80,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: '#e3d9fe'
                  },
                  emphasis: {
                    color: '#e3d9fe'
                  }
                }
              }
            ]
          }
        ]
      }
      const chart = this.$echarts.init(this.$refs.inOut)
      chart.setOption(option)
      chart.on('mouseover', (params) => {
        if (params.componentSubType === 'bar' && params.seriesName !== '目标') {
          console.log(option, params.dataIndex)
          const colors = ['#389af4', '#ff8c37', '#ffc257', '#fd6f97', '#a181fc']
          const color = colors[params.dataIndex]
          option.series[1].emphasis.itemStyle.color = color
          const PIEindex = params.dataIndex + 3
          option.series[PIEindex].radius = [60, 70]
          option.series[PIEindex].itemStyle.normal.color = colors[params.dataIndex]
          chart.setOption(option)
        }
      })

      chart.on('mouseout', (params) => {
        if (params.componentSubType === 'bar' && params.seriesName !== '目标') {
          //  console.log(params);
          const colors = ['#82C0F9', '#FFB379', '#FFD184', '#FD84A5', '#C0ACFD']
          option.series[1].itemStyle.normal.label.show = false
          const PIEindex = params.dataIndex + 3
          option.series[PIEindex].radius = [55, 65]
          option.series[PIEindex].itemStyle.normal.color = colors[params.dataIndex]
          chart.setOption(option)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.door {
  // position: relative;
  width: 100%;
  height: 100%;
}
.leftBox {
  /deep/.el-card__body {
    height: 93%;
  }
}
// 门禁管理
// 基础配置
.basics {
  box-sizing: border-box;
  padding: 10px 20px;
  color: aliceblue;
  /deep/.el-form-item__label {
    color: rgba(255, 255, 255, 0.6) !important;
  }
  /deep/.el-input {
    width: 200px;
  }
}
// 报警配置
.alarm {
  /deep/.el-card .el-card__body {
    height: 95% !important;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
// 门禁监控
.monitoring {
  .titles {
    margin: 0.15rem 0;
    font-size: 0.2rem;
    color: #6cecff;
    display: block;
    height: 0.2rem;
    line-height: 0.2rem;
    font-weight: 600;
  }
  video {
    width: 100%;
    border-radius: 6px;
  }
  img {
    height: 1.2rem;
    width: 1.2rem;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      transform: translateY(1px) scale(1.01);
    }
  }
  .imgBox {
    // width: 8.45rem;
    // width: 100%;
    height: 1.3rem;
    overflow-y: hidden;
    padding-bottom: 0.1rem;
  }
  .access {
    height: calc(100% - 0.5rem);
  }
  .r1 {
    height: 6rem;
  }
  .r2 {
    box-sizing: border-box;
    // margin-top: 2%;
    height: calc(100% - 6rem);
    .peopleInfo {
      // height: calc(100% - 2rem);
      margin-top: 0.5rem;
      font-size: 0.16rem;
      color: aliceblue;
    }
  }
}
// 右侧操作
.operate {
  padding-left: 40px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  color: #bbb;
  .op_time {
    position: relative;
    width: 95%;
    height: 15%;
    font-size: 0.2rem;
    margin-bottom: 20px;
    box-sizing: border-box;
    // border: 1px dashed rgba(64, 158, 255, 0.8);
    border: 1px dashed rgba(62, 101, 121, 0.8);
    background: rgba(64, 158, 255, 0.1);
    border-radius: 6px;
    transition: all 0.3s;
    .time_box {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 10px;
      left: 10px;
      transition: all 0.3s;

      // background: rgba(185, 210, 240, 1);
      background-color: rgba(40, 87, 112);
      border-radius: 6px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      & > div {
        // color: rgba(64, 158, 255, 0.8);
        color: #bbb;
        margin-left: 6px;
        font-size: 12px;
      }
      h1 {
        // color: rgba(64, 158, 255, 0.6);
        color: #aaa;
        transition: all 0.3s;
      }
      p {
        margin: 0;
      }
    }
  }
  .op_header {
    position: relative;
    display: flex;
    justify-content: flex-end;
    padding-bottom: 15px;
    font-size: 0.16rem;
    width: 95%;
    height: 34%;
    margin-bottom: 20px;
    box-sizing: border-box;
    // border: 1px dashed rgba(64, 158, 255, 0.8);
    border: 1px dashed rgba(62, 101, 121, 0.8);
    background: rgba(64, 158, 255, 0.1);
    border-radius: 6px;
    transition: all 0.3s;
    .header_box {
      padding: 30px 10px 10px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 10px;
      left: 10px;
      transition: all 0.3s;
      // background: rgba(185, 210, 240, 1);
      background-color: rgba(40, 87, 112);
      border-radius: 6px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    }
  }
  .op_body {
    position: relative;
    width: 95%;
    height: 34%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: flex-end;
    // border: 1px dashed rgba(64, 158, 255, 0.8);
    border: 1px dashed rgba(62, 101, 121, 0.8);
    background: rgba(64, 158, 255, 0.1);
    border-radius: 6px;
    transition: all 0.3s;
    .body_box {
      padding: 30px 10px 10px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 10px;
      left: 10px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      align-items: flex-end;
      transition: all 0.3s;
      // background: rgba(185, 210, 240, 1);
      background-color: rgba(40, 87, 112);
      border-radius: 6px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      p {
        width: 100%;
        text-align: left;
        // background-image: -webkit-linear-gradient(270deg, #fff, rgba(185, 210, 240, 1));
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
      }
    }
    .direction {
      position: relative;
      right: 50%;
      transform: translateX(50%);
      width: 86px;
      height: 86px;
      z-index: 98;
      border-radius: 50%;
      // background-color: rgba(150, 185, 220, 0.8);
      background-color: rgba(14, 63, 88, 0.4);
      box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
      span {
        cursor: pointer;
        position: absolute;
        width: 20px;
        height: 20px;
        z-index: 99;
        line-height: 20px;
        text-align: center;
        color: #aaa;
        font-size: 20px;
        box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
        // background-color: rgba(150, 185, 220, 1);
        background-color: rgba(14, 63, 88, 0.4);
        // background-color: rgba(0, 0, 0, 0.1);
      }
      span:nth-of-type(1) {
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        &:active {
          transform: translateY(-50%) translateX(-1px);
        }
      }
      span:nth-of-type(2) {
        left: 50%;
        top: 8px;
        transform: translateX(-50%);
        &:active {
          transform: translateX(-50%) translateY(-1px);
        }
      }
      span:nth-of-type(3) {
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        &:active {
          transform: translateY(-50%) translateX(1px);
        }
      }
      span:nth-of-type(4) {
        left: 50%;
        bottom: 8px;
        transform: translateX(-50%);
        &:active {
          transform: translateX(-50%) translateY(1px);
        }
      }
    }
    .focal {
      position: relative;
      padding-left: 15px;
      padding-right: 10px;
      width: 100%;
      height: 30px;
      border-radius: 6px;
      box-sizing: border-box;
      box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.3);
      // background-color: rgba(150, 185, 220, 1);
      background-color: rgba(14, 63, 88, 0.4);
      .el-slider {
        // position: absolute;
        // top: 50%;
        // left: 0;
        // transform: translateY(-50%);
      }
      /deep/.el-slider__runway {
        margin: 12px 0;
      }
      /deep/.el-slider__button {
        width: 14px;
        height: 14px;
        border-color: rgba(1, 53, 79) !important;
      }
    }
  }
  /deep/.el-slider__button-wrapper .el-tooltip,
  .el-slider__button-wrapper::after {
    margin-top: 8px;
    vertical-align: top !important;
  }
}
// 右侧图表
.chartBox {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: 100%;
  & > div:nth-of-type(1) {
    height: 28%;
  }
  & > div:nth-of-type(2) {
    height: 70%;
  }
}
// 出入记录
.accessItem {
  height: 0.5rem;
  width: 100%;
  padding-bottom: 0.1rem;
  margin-bottom: 0.1rem;
  border-bottom: 1px solid rgba(30, 77, 102);
  img {
    height: 0.4rem;
    width: 0.4rem;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  }
  & > div {
    height: 100%;
    width: calc(95% - 0.4rem);
    font-size: 0.16rem;
    color: aliceblue;
  }
  .info {
    width: 80%;
    height: 100%;
    align-items: flex-start !important;
    p {
      margin: 0 !important;
    }
  }
}
// 分页定位
.el-pagination {
  position: absolute;
  bottom: 15px;
}
// 空状态定位
.el-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.el-row {
  height: 100%;
  .el-col {
    height: 100%;
  }
}
.el-card {
  width: 100%;
  height: 100%;
}
.clearfix {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
