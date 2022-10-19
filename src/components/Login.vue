<template>
    <div class="login-container">
      <div class="login_box">
          <div class="avatar_box">
            <img src="@/assets/logo.jpg" alt="">
          </div>
          <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
            <el-form-item prop="username">
              <el-input  prefix-icon="el-icon-user" v-model="loginForm.username" ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" show-password></el-input>
            </el-form-item>
            <el-form-item class="btns">
              <el-button type="primary" size="small" @click="login">登陆</el-button>
              <el-button size="small" @click="resetLoginForm">重置</el-button>
            </el-form-item>
          </el-form>
      </div>
    </div>
</template>

<script>
export default {
  name: 'loginC',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 9, message: '长度在 6 到 9 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return false
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          this.$message.error('登陆失败！')
        } else {
          this.$message.success('登陆成功，亲！')
          console.log(res)
          sessionStorage.setItem('TOKEN', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
    .login-container{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
    }
    .avatar_box{
      position: absolute;
      width: 130px;
      height: 130px;
      border:1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      left:50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
    }
    .avatar_box img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
    .btns{
      display: flex;
      justify-content: flex-end;
    }
    .login_form{
      position: absolute;
      bottom: 0;
      width: 100%;
      padding:0 10px;
      box-sizing:border-box;
    }
</style>
