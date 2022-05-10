<!-- 分配角色 -->
<template>
  <el-dialog
    v-model="props.dialogFormVisible"
    title="分配角色"
    :before-close="close"
  >
    <el-form :model="form">
      <el-select
        v-model="form.selectRole"
        multiple
        placeholder="请选择"
        style="width: 240px"
      >
        <el-option
          v-for="roleItem in roleListAll"
          :key="roleItem.id"
          :label="roleItem.name"
          :value="roleItem.id"
        />
      </el-select>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="editAdminRole">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import * as http from "../../../request/http";
const formLabelWidth = "140px";
let props = defineProps<{
  dialogFormVisible: boolean;
  uid: number;
}>();
let emit = defineEmits<{
  (event: "close"): void;
}>();

//关闭弹框
const close = () => {
  emit("close");
};

const form = reactive<{ selectRole: number[] }>({
  selectRole: [1, 5],
});
//用户权限
watch(
  () => props.uid,
  (newVal) => {
    if (newVal === 0) return;
    http.getAdminRole(newVal).then((res) => {
      if (res.code === 200) {
        form.selectRole = res.data.reduce((prev, current) => {
          current && prev.push(current.id);
          return prev;
        }, [] as number[]);
      }
    });
  }
);

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 点击确定修改用户角色  by 李岳森    220506周五18:30
const editAdminRole = () => {
  ElMessageBox.confirm("此操作将修改当前用户角色,是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    //发送更新用户角色的请求
    const res = await http.updateAdminRole({
      adminId: props.uid,
      roleIds: form.selectRole.join(","),
    });
    if (res.code === 500) {
      ElMessage({
        type: "error",
        message: res.message,
      });
      return;
    }
    emit("close");
    ElMessage({
      type: "success",
      message: "更新成功",
    });
  });
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 点击确定修改用户角色  by 李岳森    220506周五18:30

//获取所有角色列表
interface RoleObjData {
  name: string;
  id: number;
}
let roleListAll = ref<RoleObjData[]>([]);
http.getRoleListAll().then((res) => {
  if (res.code === 200) {
    roleListAll.value = res.data;
  }
});
</script>
<style lang="less" scoped></style>
