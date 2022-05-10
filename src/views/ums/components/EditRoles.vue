<!-- 编辑用户权限 -->
<template>
  <el-dialog
    v-model="props.dialogFormVisible"
    title="分配角色"
    :before-close="close"
  >
    <el-form ref="ruleFormRef" :model="ruleForm" class="demo-ruleForm">
      <el-form-item label="账号:" prop="username">
        <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="姓名:" prop="nickName">
        <el-input v-model="ruleForm.nickName" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱:" prop="email">
        <el-input v-model="ruleForm.email" type="text" />
      </el-form-item>
    </el-form>
    <el-form-item label="密码:" prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="备注:" prop="note">
      <el-input
        v-model="ruleForm.note"
        :row="2"
        type="textarea"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="是否启用:" prop="status">
      <el-radio v-model="ruleForm.status" :label="1" size="large">是</el-radio>
      <el-radio v-model="ruleForm.status" :label="0" size="large">否</el-radio>
    </el-form-item>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="updateAdmin">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { Http2ServerRequest } from "http2";
import * as http from "../../../request/http";
import { reactive, toRefs, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { format } from "path";
let props = defineProps<{
  dialogFormVisible: boolean;
  AdminInfo: {};
}>();
let emit = defineEmits<{
  (event: "close", reload?: "reload"): void;
}>();
//关闭弹框
const close = (reload?: "reload") => {
  emit("close", reload);
};

const ruleForm = reactive({
  id: 0,
  username: "",
  nickName: "",
  email: "",
  password: "",
  note: "",
  status: 0,
});

watch(
  () => props.AdminInfo,
  (newVal) => {
    if (newVal === {}) return;

    let AdminInfoNew = JSON.parse(JSON.stringify(props.AdminInfo));

    ruleForm.username = AdminInfoNew.username;

    ruleForm.nickName = AdminInfoNew.nickName;
    ruleForm.email = AdminInfoNew.email;
    ruleForm.password = AdminInfoNew.password;
    ruleForm.note = AdminInfoNew.note;
    ruleForm.status = AdminInfoNew.status;
    ruleForm.id = AdminInfoNew.id;
  }
);

//点击确定按钮
const updateAdmin = async () => {
  if (
    !ruleForm.username ||
    !ruleForm.nickName ||
    !ruleForm.email ||
    !ruleForm.password ||
    !ruleForm.note
  ) {
    //弹出提示请输入内容
    ElMessage({
      message: "请输入内容",
      type: "error",
    });
    return;
  }
  if (ruleForm.id) {
    //编辑用户
    const res = await http.updateAdminInfo(ruleForm.id, ruleForm);
    if (res.code === 200) {
      close("reload");
    }
  } else {
    //添加用户
    const res = await http.registerAdmin(ruleForm);
    if (res.code === 200) {
      ElMessage({
        message: "添加成功",
        type: "success",
      });

      close("reload");
      return;
    } else {
      ElMessage({
        message: res.message,
        type: "error",
      });
      return;
    }
  }
};
</script>
<style lang="less" scoped></style>
