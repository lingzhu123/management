用户列表
<template>
  <div class="form2">
    <div style="line-height: 32px">
      <el-icon style="vertical-align: middle"><document /></el-icon>数据列表
    </div>
    <el-button :plain="true" @click="hdEditRoles">添加</el-button>
  </div>
  <el-table
    :data="tableData"
    style="width: 100%"
    :border="true"
    table-layout="auto"
  >
    <el-table-column label="编号" width="id" align="center" property="id" />
    <el-table-column label="账号" align="center" property="username" />
    <el-table-column
      align="center"
      label="姓名"
      width="150"
      property="nickName"
    >
    </el-table-column>
    <el-table-column property="email" label="邮箱" align="center" />
    <el-table-column
      label="添加时间"
      show-overflow-tooltip
      width="200"
      align="center"
    >
      <template #default="scope">
        <span>{{ formatDate(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="最后登录"
      show-overflow-tooltip
      width="200"
      align="center"
    >
      <template #default="scope">
        <span>{{ formatDate(scope.row.loginTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="是否启用"
      show-overflow-tooltip
      width="180"
      align="center"
    >
      <template #default="scope">
        <el-switch :model-value="scope.row.status === 1 ? true : false" />
      </template>
    </el-table-column>
    <el-table-column
      label="操作"
      show-overflow-tooltip
      align="center"
      width="150px"
      fixed="right"
    >
      <template #default="scope">
        <el-button type="text" @click="hdRoles(scope.row.id)"
          >分配角色</el-button
        >
        <el-button
          type="text"
          @click="hdEditRoles(scope.row.id)"
          v-permission="'editUser'"
          >编辑</el-button
        >
      </template>
    </el-table-column>
  </el-table>

  <div style="float: right">
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15, 20]"
      :small="false"
      :disabled="false"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

  <EditRole
    :dialogFormVisible="dialogFormVisible"
    :uid="uid"
    @close="closeForm"
  ></EditRole>
  <EditAdminRole
    :dialogFormVisible="dialogFormVisible2"
    :AdminInfo="AdminInfo"
    @close="closeForm2"
  ></EditAdminRole>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from "vue";
import * as http from "../../request/http";
import EditRole from "../ums/components/AssigningRoles.vue";
import EditAdminRole from "../ums/components/EditRoles.vue";

const state = reactive<{
  tableData: { id: number }[];
  currentPage: number;
  pageSize: number;
  total: number;
}>({
  tableData: [],
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

let { tableData, currentPage, pageSize, total } = toRefs(state);

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 分页条目数改变时触发  by 李岳森    220506周五09:37
const handleSizeChange = (size: number) => {
  pageSize.value = size;
  fetchData();
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 分页条目数改变时触发  by 李岳森    220506周五09:37

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 分页页码改变时触发  by 李岳森    220506周五09:37
const handleCurrentChange = (page: number) => {
  currentPage.value = page;
  fetchData();
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 分页页码改变时触发  by 李岳森    220506周五09:37

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 发送请求获取用户列表初次渲染页面  by 李岳森    220506周五09:33
const fetchData = async () => {
  let res = await http.getAdminList({
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    keyword: "",
  });
  if (res.code === 200) {
    tableData.value = res.data.list;
    total.value = res.data.total;
  }
};
fetchData();
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 发送请求获取用户列表初次渲染页面  by 李岳森    220506周五09:33

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 格式化时间  by 李岳森    220506周五11:37
const formatDate = (createTime?: string) => {
  if (!createTime) return "";
  const date = new Date(createTime);

  let year = date.getFullYear();
  let month = addZero(date.getMonth() + 1);
  let day = addZero(date.getDate());
  let hour = addZero(date.getHours());
  let min = addZero(date.getMinutes());
  let sec = addZero(date.getSeconds());
  return `${year}-${month}-${day} ${hour}:${min}:${sec}`;
};
const addZero = (num: number) => {
  return num > 9 ? num : "0" + num;
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 格式化时间  by 李岳森    220506周五11:37

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 弹框关闭  by 李岳森    220506周五15:48
let dialogFormVisible = ref(false);
const closeForm = () => {
  dialogFormVisible.value = false;
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 弹框关闭  by 李岳森    220506周五15:48

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 点击分配角色  by 李岳森    220506周五15:28

let uid = ref<number>(0);

const hdRoles = async (id: number) => {
  dialogFormVisible.value = true;
  uid.value = id;
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 点击分配角色  by 李岳森    220506周五15:28

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 编辑角色权限  by 李岳森    220507周六10:06
let dialogFormVisible2 = ref(false);
const closeForm2 = (reload?: "reload") => {
  dialogFormVisible2.value = false;
  if (reload === "reload") {
    fetchData();
  }
};

let AdminInfo = ref<{}>({});
//点击编辑按钮
const hdEditRoles = (id: number) => {
  dialogFormVisible2.value = true;
  if (typeof id === "number") {
    let Arr = tableData.value.filter((item) => {
      return item.id == id;
    });
    AdminInfo.value = Arr[0];
  } else {
    AdminInfo.value = {};
  }
};

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 编辑角色权限  by 李岳森    220507周六10:06
</script>

<style lang="less" scoped>
:deep(.el-pagination.is-background) {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.form2 {
  margin-top: 20px;
  border: 1px solid #ebeef5;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
}
</style>
