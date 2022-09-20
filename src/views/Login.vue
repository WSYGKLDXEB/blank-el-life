<template>
  <div class="login">
    <el-card class="box-card">
      <el-form ref="loginForm" :model="loginData" :rules="rules" label-width="54px">
        <el-form-item label="用户" size="small " prop="user">
          <el-input ref="user" clearable type="text" v-model.trim="loginData.user" @keyup.enter.native="$refs.pass.focus"></el-input>
        </el-form-item>
        <el-form-item label="密码" size="small " prop="paw">
          <el-input clearable show-password type="password" ref="pass" v-model.trim="loginData.paw" @keyup.enter.native="$refs.ver.focus"></el-input>
        </el-form-item>
        <el-form-item label="验证码" size="small " prop="verify">
          <el-row type="flex" justify="space-between" align="middle">
            <el-col :span="10">
              <el-input clearable ref="ver" type="text" v-model.trim="loginData.verify" @keyup.enter.native="login"></el-input>
            </el-col>
            <el-col :span="12">
              <el-tooltip class="item" :enterable="false" effect="dark" content="点击刷新" placement="bottom">
                <h1 @click="verifyChange">{{ verify }}</h1>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="login">登录</el-button>
          <el-button type="info" size="small " @click="$refs.loginForm.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'BlankElEcBimRealisticlogin',

  data() {
    return {
      verify: '123',
      loginData: {
        user: 'blank',
        paw: '666666',
        verify: ''
      },
      // 验证规则
      rules: {
        user: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        paw: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        verify: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '长度为4字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.verifyChange()
  },
  mounted() {
    this.$refs.user.focus()
  },

  methods: {
    // 验证码
    verifyChange() {
      const arr = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]
      let yz = ''
      for (let i = 0; i <= 3; i++) {
        const j = Math.floor(Math.random() * 62)
        yz += arr[j]
      }
      this.verify = yz
      console.log(yz)
    },
    // 登录
    login() {
      this.$refs.loginForm.validate((valid) => {
        console.log(valid)
        if (!valid) return
        console.log(this.loginData)
        if (this.loginData.verify.toLowerCase() === this.verify.toLowerCase()) {
          if (this.loginData.user === 'blank' && this.loginData.paw === '666666') {
            sessionStorage.setItem('token', 'XXX-XXXX-XXXX')
            this.$router.push('/layout')
          } else {
            this.$refs.loginForm.resetFields()
            return this.$message.error('用户或者密码错误！')
          }
        } else {
          this.verifyChange()
          this.loginData.verify = ''
          return this.$message.error('验证码错误！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.svg {
  display: none;
  position: absolute;
  top: 50%;
  left: 10vw;
  transform: translateY(-50%);
  // width: 100vw;
  // height: 100vh;
  // z-index: -1;
}
.login {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('../assets/image/bg.jpg');
}
h1 {
  padding: 5px;
  margin: 0;
  cursor: pointer;
  text-align: center;
  background: url(https://img1.baidu.com/it/u=3333204891,3647541244&fm=253&fmt=auto&app=138&f=JPEG?w=641&h=300);
  background-size: cover;
  width: 122px;
  font-size: 32px;
  line-height: 32px;
  border-radius: 4px;
  // user-select属性设置或检索是否允许用户选中文本。
  // user-select的默认值是 text：可以选择文本
  -moz-user-select: none; /* Firefox私有属性 */
  -webkit-user-select: none; /* WebKit内核私有属性 */
  -ms-user-select: none; /* IE私有属性(IE10及以后) */
  -khtml-user-select: none; /* KHTML内核私有属性 */
  -o-user-select: none; /* Opera私有属性 */
  user-select: none; /* CSS3属性 */
}
.el-col {
  display: flex;
  align-items: center;
  height: 32px;
}
.el-form {
  // display: ;
  // position: absolute;
  // right: 5%;
  // top: 50%;
  // transform: translateY(-50%);
  // background-color: #fff;
  // border-radius: 6px;
}

/deep/.el-form-item__label {
  text-align: justify;
  height: 32px;
  &::before {
    display: none !important;
  }
  &::after {
    content: '';
    display: inline-block;
    width: 100%;
    // height: 32px;
  }
}
.el-card {
  // padding-bottom: 0 !important;
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 340px;
  // height: 340px;
  // padding: 16px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4);
}
</style>
