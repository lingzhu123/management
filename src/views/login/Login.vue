<!--  -->
<template>
  <div class="loginBox">
    <div class="loginSmallBox">
      <div class="title">叩丁狼商品管理系统</div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        class="demo-ruleForm el-form-item__content"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><avatar /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input
            type="password"
            v-model="ruleForm.pwd"
            placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="loginFn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { loginApi, getAdminInfo } from "../../request/http";
import { reactive, toRefs, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Cookie from "js-cookie";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const store = useStore();

const ruleForm = reactive({
  username: "admin",
  pwd: "123456",
});

// 校验密码
const validatePwd = (
  rule: unknown,
  value: string,
  cb: (msg?: string) => void
) => {
  if (!value.trim()) {
    cb("密码不能为空");
  }
  //   if (!(value.length >= 6 && value.length <= 10)) {
  //     cb("密码长度应该在6-10位之间");
  //   }
  //   if (!/^.*[0-9]{1,}.*$/.test(value)) {
  //     cb("密码需要包含数字0...9!");
  //   }

  cb();
};

const rules = reactive({
  username: [{ required: true, message: "用户名不能为空!", trigger: "blur" }],
  pwd: [{ validator: validatePwd, trigger: "blur" }],
});
const ruleFormRef = ref();

//响应点击事件的方法
const loginFn = () => {
  //回调函数
  //   ruleFormRef.value.validate((isValid: boolean) => {
  //     console.log(isValid);
  //   });

  ruleFormRef.value
    .validate()
    .then(() => {
      console.log("校验通过");

      //调用登录请求的API
      loginApi({
        username: ruleForm.username,
        password: ruleForm.pwd,
      }).then((res) => {
        if (res.code === 200) {
          Cookie.set("token", res.data.tokenHead + res.data.token);
          getAdminInfo().then((res) => {
            if (res.code === 200) {
              // console.log(res.data.menus);
              store.commit("updateMenus", res.data.menus);
              //跳转页面homepage
              router.push("/home");
            }
          });
        } else {
          ElMessage({
            type: "error",
            message: res.message,
          });
        }
      });
    })
    .catch(() => {
      console.log("校验失败");
    });
};
</script>
<style lang="less" scoped>
.loginBox {
  background-color: #2d3a4b;
  height: 100vh;
  width: 100vw;

  .loginSmallBox {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .title {
    margin: 0 auto;
    text-align: center;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 18px;
  }
  :deep(form.el-form-item__content) {
    margin: 0 auto;
    width: 420px;
    height: 50px;
    color: #fff;

    .el-form-item {
      width: 100%;
      display: block;
      font-size: 14px;
      margin-bottom: 20px;
      height: 50px;

      .el-input {
        height: 50px;
        border: none;
        border: 1px solid #3e4856;

        .el-input__wrapper {
          background-color: #283443;
          box-shadow: none;
        }
      }
      .el-button--primary {
        width: 420px;
        height: 40px;
      }
    }
  }
}
</style>
