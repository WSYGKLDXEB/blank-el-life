<template>
  <div class="machine">
    <div class="machine-item" v-for="(item, i) in dataList" :key="i">
      <h4>地下室排风机-0{{ i }}</h4>
      <el-row>
        <el-col :span="16" class="butState">
          <div class="stateBox">
            <p>运行状态</p>
            <el-button @click="toggleBut(0)" :disabled="selectButId !== 0 && !startUpValue" type="success" size="mini">运行</el-button>
          </div>
          <div class="stateBox">
            <p>故障状态</p>
            <el-button @click="toggleBut(1)" :disabled="selectButId !== 1 && !startUpValue" type="danger" size="mini">故障</el-button>
          </div>
          <div class="stateBox">
            <p>自动状态</p>
            <el-button @click="toggleBut(2)" :disabled="selectButId !== 2 && !startUpValue" type="primary" size="mini">自动</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stateBox" style="float: right">
            <p>启动控制</p>
            <el-switch style="margin-top: 4px" class="startUp" :width="70" v-model="startUpValue" active-color="rgba(19, 206, 102, .85)" inactive-color="rgba(126, 124, 125, 1)"> </el-switch>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="stateBox" style="float: left">
            <p>定时模式</p>
            <el-switch class="time" :width="70" v-model="timingValue" active-color="rgba(64, 158, 255, .8)" inactive-color="rgba(126, 124, 125, 1)"> </el-switch>
          </div>
        </el-col>
        <el-col :span="16" class="timeBox">
          <p style="text-align: right">
            时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分&nbsp;&nbsp;&nbsp;
          </p>
          <span>开启&nbsp;&nbsp;{{ timingValue ? timeValue[0] : 'XX : XX' }}&nbsp;&nbsp;关闭&nbsp;&nbsp;{{ timingValue ? timeValue[1] : 'XX : XX' }}</span>
          <el-time-picker
            value-format="HH:mm"
            :picker-options="pickerOptions"
            is-range
            :clearable="false"
            v-model="timeValue"
            :disabled="!timingValue"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
          >
          </el-time-picker>
        </el-col>
      </el-row>
    </div>
    <!-- 补齐空位  -->
    <!-- 列数减去(数据长度)余列数 即：col-(serveData.length)%col -->
    <div
      class="machine-item"
      style="box-shadow: none; background: none; border: none; pointer-events: none"
      v-for="(item, index) in 4 - (dataList.length % 4)"
      :key="index"
      v-show="dataList.length % 4 > 0"
    ></div>
  </div>
</template>

<script>
import { PrefixInteger } from '@/assets/js/blank'
export default {
  name: 'BlankElLifeMachineGroup',
  props: {
    dataList: {
      type: Array,
      default: new Array(10)
    }
  },
  data() {
    return {
      visible: false,
      // 定时模式
      timingValue: false,
      // 启动模式
      startUpValue: false,
      // 时间选择器
      timeValue: [],
      // 时间选择器配置
      pickerOptions: {
        selectableRange: '',
        format: 'HH:mm'
      },
      // 选中按钮ID
      selectButId: 0
    }
  },

  mounted() {
    console.log(this.dataList.length)
    const time = `${PrefixInteger(new Date().getHours(), 2)}:${PrefixInteger(new Date().getMinutes(), 2)}`
    // 设置时间范围
    this.pickerOptions.selectableRange = `${time} - 24:00`
    this.timeValue = [time, time]
    // console.log(this.timeValue)
  },

  methods: {
    toggleBut(i) {
      // const i = Math.floor(Math.random() * 3)
      this.selectButId = i
      this.startUpValue = false
      console.log(i)
    }
  }
}
</script>

<style lang="less" scoped>
// 机器
.machine {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
}
.machine-item {
  // 文字禁止选中
  user-select: none;
  padding: 10px 14px 20px;
  box-sizing: border-box;
  margin-bottom: 15px;
  width: 24%;
  // height: 160px;
  background-color: var(--bgc-theme);
  border-radius: 6px;
  border-style: solid;
  border-color: var(--color-theme);
  border-width: 1px 0 0 1px;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.25);
  transition: all 0.3s;
  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.25);
  }
  .el-button {
    // opacity: 0.9;
    box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
    &:active {
      transform: translate(1px, 1px);
    }
  }
  // ------------------------
  .el-switch {
    // box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.25);
    /deep/.el-switch__core {
      border-radius: 4px;
      &::after {
        width: 33px;
        border-radius: 2px;
        color: #fff;
        font-size: 10px;
        line-height: 16px;
        text-align: center;
      }
    }
  }
  /deep/.el-switch.is-checked .el-switch__core::after {
    margin-left: -34px;
  }
  // 定时模式
  /deep/.el-switch.time {
    .el-switch__core::after {
      content: '本地';
      background: rgba(191, 191, 191, 0.9);
    }
  }
  /deep/.el-switch.time.is-checked {
    .el-switch__core::after {
      content: '在线';
      color: #666;
      background: #fff;
    }
  }
  // -------------------------
  // 启动控制
  /deep/.el-switch.startUp {
    .el-switch__core::after {
      content: '停止';
      background: rgba(255, 73, 73, 0.9);
    }
  }
  /deep/.el-switch.startUp.is-checked {
    .el-switch__core::after {
      content: '启动';
      color: #333;
      background: #fff;
    }
  }
  // -------------------------
  .el-row {
    padding: 0 6px;
    margin-top: 12px;
    height: auto;
  }
  h4 {
    margin: 0;
    color: #bbb;
  }
  p {
    margin: 0;
    margin-bottom: 6px;
    font-size: 12px;
    color: #aaa;
  }
  span {
    user-select: none;
    text-align: center;
    display: block;
    width: 100%;
    height: 20px;
    line-height: 20px;
    border-radius: 4px;
    color: #fff;
    font-size: 14px;
    background: rgba(124, 122, 122, 1);
    box-shadow: 1px 1px 4px 2px rgba(0, 0, 0, 0.25);
  }
  .butState {
    position: relative;
    display: flex;
    justify-content: space-between;
    &::before {
      content: '';
      position: absolute;
      right: -10px;
      bottom: 0;
      width: 2px;
      height: 26px;
      background-color: #aaa;
    }
  }
  .stateBox {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    // justify-content: space-between;
  }
  .timeBox {
    position: relative;
    span {
      cursor: pointer;
      position: relative;
      z-index: 99;
      // 点击穿透
      pointer-events: none;
    }
    /deep/.el-date-editor {
      cursor: pointer;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 98;
      width: 100%;
      height: 20px;
      overflow: hidden;
      opacity: 0;
    }
  }
}
</style>
