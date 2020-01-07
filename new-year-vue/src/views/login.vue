<template>
  <div class="zdy-w">
    <div class="form">
      <el-form
        :inline="true"
        :rules="dataRule"
        :model="dataForm"
        ref="dataForm"
        class="demo-form-inline"
      >
        <br />
        <h1>登录</h1>
        <br />
        <br />
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="userName" style="width:100%">
              <el-input v-model="dataForm.userName" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <br />
        <br />
        <br />
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="password" style="width:100%">
              <el-input v-model="dataForm.password" type="password" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <br />
        <br />
        <el-row :gutter="20">
          <el-col :span="24">
            <img :src="captchaPath" @click="getCaptcha()" alt />
          </el-col>
        </el-row>
        <br />
        <br />
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button type="primary" style="width:100%" @click="loginAX('dataForm')">登录</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
 
<script>
import { userApi } from "../api/apiList";
import { async } from "q";
export default {
  data() {
    var checkAge = (rule, value, callback) => {
      console.log(value);
      if (!value) {
        return callback(new Error("年龄不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 18) {
            callback(new Error("必须年满18岁"));
          } else {
            // callback();
          }
        }
      }, 1000);
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        captcha: ""
      },
      dataRule: {
        userName: [
          {
            // validator: checkAge,
            required: true,
            message: "帐号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            // required: validatePass,
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            // validator: checkAge,
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        ]
      },
      captchaPath: ""
    };
  },
  created() {
    this.loginAX();
  },
  methods: {
    loginAX(formName) {
      let _this = this;
      console.log("开始登录");
      userApi.axiosLogin().then(res => {
        console.log(res);
        if (res.code == 200) {
        } else {
          this.$message.error("账户名或密码错误");
        }
      });
    }
  }
};
</script>

<style lang="less">
.form {
  width: 600px;
  height: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
  margin: 10% auto 0;
  padding: 50px 45px;
}
</style>