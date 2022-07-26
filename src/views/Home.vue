<template>
  <div class="home">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row type="flex" justify="space-between" align="middle" class="content_row1">
      <el-col>
        <i class="iconfont icon--shebei"></i>
        <div>
          <p>设备总数</p>
          <p>12</p>
        </div>
      </el-col>
      <el-col
        ><i class="el-icon-s-platform"></i>
        <div>
          <p>在线设备</p>
          <p>4</p>
        </div></el-col
      >
      <el-col
        ><i class="el-icon-message-solid"></i>
        <div>
          <p>报警设备</p>
          <p>3</p>
        </div></el-col
      >
      <el-col
        ><i class="iconfont icon-lixian1"></i>
        <div>
          <p>离线设备</p>
          <p>11</p>
        </div></el-col
      >
    </el-row>
    <el-row type="flex" justify="space-between" align="middle" class="content_row2" ref="content_row2">
      <el-col>
        <tree-list title="设备列表"></tree-list>
      </el-col>
      <el-col style="padding: 0 10px">
        <el-card class="box-card" ref="card">
          <div slot="header" class="header">
            <span>地理位置</span>
          </div>
          <map-box></map-box>
        </el-card>
      </el-col>
      <el-col>
        <el-card class="box-card">
          <div slot="header" class="header">
            <span>设备信息</span>
          </div>
          <el-descriptions column="1">
            <el-descriptions-item labelStyle="font-weight:700;color: #111;" label="用户名">kooriookami</el-descriptions-item>
            <el-descriptions-item labelStyle="font-weight:700;color: #111;" label="手机号">18100000000</el-descriptions-item>
            <el-descriptions-item labelStyle="font-weight:700;color: #111;" label="居住地">苏州市</el-descriptions-item>
            <el-descriptions-item labelStyle="font-weight:700;color: #111;" label="备注">
              <el-tag size="small">学校</el-tag>
            </el-descriptions-item>
            <el-descriptions-item labelStyle="font-weight:700;color: #111;" label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
          </el-descriptions>
          <div class="footer">
            <el-button type="success" size="mini" icon="el-icon-video-camera">测试</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="content_row3" style="width: 100%">
      <div slot="header" class="header">
        <span>空气信息</span>
      </div>
      <div v-for="o in 8" :key="o" class="">
        <!-- 搜索 -->
        <i class="el-icon-search"></i>
        <i class="iconfont icon--shebei" style="margin-left: 0"></i>
        <p>
          <span>温度-{{ o }}</span>
          <span>离线</span>
        </p>
      </div>
      <div style="background: none; border: none; pointer-events: none" v-for="(item, index) in 5 - (8 % 5)" :key="index" v-show="8 % 5 > 0"></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BlankElEcBimRealisticHome',

  data() {
    return {
      data: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
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
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  mounted() {},
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.home {
  position: relative;
  height: 100%;
  // 隐藏滚动条
  overflow: auto !important;
  // overflow-y: auto;
  // overflow-x: hidden;
  // 解决隐藏滚动条无法滚动的问题
  &::-webkit-scrollbar {
    display: none;
  }
}
.el-row {
  color: var(--color-default);

  width: 100%;
  .el-col {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
.el-card {
  width: 100%;
  // height: 100%;
}

.content_row1 {
  margin-bottom: 10px;
  height: 100px;
  & > .el-col {
    cursor: pointer;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 24%;
    background: #1e9fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15) !important;
    &:nth-of-type(2) {
      background: #47a96c;
      i {
        color: #91cba7;
      }
    }
    &:nth-of-type(3) {
      background: #ff5722;
      i {
        color: #ff9a7a;
      }
    }
    &:nth-of-type(4) {
      background: #393d49;
      i {
        color: #888b92;
      }
    }
    i {
      font-size: 40px;
      color: #78c5ff;
    }
    div {
      p {
        margin: 0;
        text-align: right;
        color: #dfdfdf;
        &:nth-of-type(2) {
          font-size: 26px;
        }
      }
    }
  }
}
.content_row2 {
  margin: 0;
  margin-bottom: 10px;
  height: 45%;
  min-height: 300px;
  .el-col {
    /deep/.el-card__body {
      height: 90%;
    }
    &:nth-of-type(1) {
      flex: 3;
      min-width: 170px;
    }
    &:nth-of-type(2) {
      min-width: 535px;
      flex: 12;
      // min-width: 170px;
      /deep/.el-card__body {
        padding: 10px !important;
      }
    }
    &:nth-of-type(3) {
      min-width: 405px;
      position: relative;
      flex: 9;
      // min-width: 170px;
      .footer {
        // margin: 0 14px;
        padding: 10px 14px;
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 94%;
        border-top: 1px solid #ebeef5;
        box-sizing: border-box;
        // background-color: pink;
      }
    }
  }
  .el-card {
    height: 100%;
  }
}
/deep/.el-card__header {
  padding: 10px 20px !important;
  color: #666 !important;
  font-size: 14px !important;
  font-family: '微软雅黑' !important;
}

.content_row3 {
  // height: calc(100%-40%-100px);
  width: 100%;
  height: 38%;
  min-width: 1130px;
  max-height: 308px;
  /deep/.el-card__body {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 90%;
    // width: 100%;
    // height: 100%;
    div {
      position: relative;
      display: flex;
      margin-bottom: 10px;
      width: 18%;
      height: 80px;
      // line-height: 80px;
      min-width: 270px;
      background-color: #f8f8f8;
      border: 1px solid #dddddd;
      border-radius: 2px;
      &:hover {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
      }
      i {
        &:nth-of-type(1) {
          cursor: pointer;
          position: absolute;
          top: 4px;
          right: 4px;
          font-weight: 700;
          color: #000;
          font-size: 14px;
        }
        &:nth-of-type(2) {
          height: 100%;
          line-height: 80px;
          text-align: center;
          flex: 2;
          background-color: #a3a6a4;
          color: var(--color-default);
          font-size: 40px;
        }
      }
      p {
        // height: 100%;
        text-align: center;
        flex: 8;
        display: flex;
        justify-content: center;
        flex-flow: column nowrap;

        span {
          margin-top: 5px;
          &:nth-of-type(1) {
            margin: 0;
            font-weight: 700;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
