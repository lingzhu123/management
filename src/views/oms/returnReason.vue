<!-- 退货原因设置 -->
<template>
  <div class="topBox">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/oms' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>退货原因设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="fenge"></div>
    <!-- <el-divider /> -->
  </div>
  <div class="content">
    <div class="form2">
      <div style="line-height: 32px">
        <el-icon style="vertical-align: middle"><document /></el-icon>数据列表
      </div>
      <el-button :plain="true" @click="addReason">添加</el-button>
    </div>

    <!-- 表格 -->
    <div class="form3">
      <el-table
        :data="list"
        style="width: 100%"
        :border="true"
        table-layout="auto"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          align="center"
          property="id"
          label="编号"
          width="100"
        />
        <el-table-column align="center" property="name" label="原因类型" />
        <el-table-column
          property="sort"
          label="排序"
          show-overflow-tooltip
          width="100"
          align="center"
        />
        <el-table-column property="status" label="是否可用" align="center">
          <template #default="scope">
            <el-switch
              :model-value="scope.row.status === 1 ? true : false"
              @change="isUseChange(scope.row.id, scope.row.status ? 0 : 1)"
            />
          </template>
        </el-table-column>
        <el-table-column
          property="createTime"
          label="添加时间"
          width="200"
          align="center"
        >
          <template #default="scope">
            <span>{{
              dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="address"
          label="操作"
          align="center"
          width="180"
          fixed="right"
        >
          <template #default="scope">
            <el-button size="small" @click="editReason(scope.row.id)"
              >编辑</el-button
            >
            <el-button size="small" @click="delReason(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div
        style="margin-top: 20px; display: flex; justify-content: space-between"
      >
        <div>
          <el-select v-model="formInline.region" placeholder="批量删除">
            <el-option label="批量删除" value="shanghai" />
          </el-select>
          <el-button type="primary" style="margin-left: 20px" @click="batchDel"
            >确定</el-button
          >
        </div>
        <!-- 分页 -->
        <el-pagination
          v-model:currentPage="currentPage1"
          v-model:page-size="pageSize2"
          :page-sizes="[5, 10, 15]"
          :small="small"
          :disabled="disabled"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          class="mt-4"
        />
      </div>
    </div>
  </div>

  <!-- 添加退货原因 -->
  <el-dialog v-model="dialogFormVisible" title="添加退货原因">
    <el-form :model="addReasonForm">
      <el-form-item label="原因类型:" :label-width="formLabelWidth">
        <el-input v-model="addReasonForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序:" :label-width="formLabelWidth">
        <el-input v-model="addReasonForm.sort" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否启用:" :label-width="formLabelWidth">
        <el-switch v-model="addReasonForm.status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addReasonYes">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 修改退货原因 -->
  <el-dialog v-model="dialogEditReason" title="修改退货原因">
    <el-form :model="editReasonForm">
      <el-form-item label="原因类型:" :label-width="formLabelWidth">
        <el-input v-model="editReasonForm.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序:" :label-width="formLabelWidth">
        <el-input v-model="editReasonForm.sort" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否启用:" :label-width="formLabelWidth">
        <el-switch v-model="editReasonForm.status" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogEditReason = false">取消</el-button>
        <el-button type="primary" @click="editReasonYes">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from "vue";
import {
  getReturnReasonList,
  addReturnReason,
  editReturnReason,
  editReasonStatus,
  delReturnReason,
} from "../../request/http";
import dayjs from "dayjs";

import { ElNotification } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";

//发送请求获取退货原因
let pageNum = 1;
let pageSize = 5;
const reasonList = await getReturnReasonList(pageNum, pageSize);
let list = ref(reasonList.data.list);
let total = ref(reasonList.data.total);

//封装重新渲染页面的请求
const renderView = async () => {
  const reasonList = await getReturnReasonList(pageNum, pageSize);
  list.value = reasonList.data.list;
  total.value = reasonList.data.total;
};

//点击修改退货原因启动状态
const isUseChange = async (id: number, status: number) => {
  //发送请求修改退货原因的启动状态
  await editReasonStatus(status, id);

  renderView();
  //弹出提示修改成功
  ElMessage({
    message: "修改状态成功",
    type: "success",
  });
};

//点击删除单个退货原因
const delReason = (id: number) => {
  ElMessageBox.confirm("是否要进行该删除操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    // 发送删除单个退货原因的请求
    await delReturnReason([id]);
    renderView();

    ElMessage({
      type: "success",
      message: "删除成功",
    });
  });
};

//批量删除
let delArr: number[] = [];
let branchDelArr: number[] = [];
const handleSelectionChange = (e: any) => {
  // console.log(e);
  e.forEach((item: { id: number }) => {
    if (!delArr.includes(item.id)) {
      delArr.push(item.id);
    }
  });
  console.log(delArr);
  branchDelArr = [...delArr];

  delArr.splice(0);
};
const batchDel = async () => {
  //发送批量删除的请求
  await delReturnReason(branchDelArr);

  renderView();
};

// 添加退货原因
const formLabelWidth = "140px";
const dialogFormVisible = ref(false);
const addReasonForm = reactive({
  status: true,
  name: "",
  sort: 0,
  id: "",
  createTime: "",
});

//点击添加
const addReason = () => {
  dialogFormVisible.value = true;
};

//点击添加的确定按钮
const addReasonYes = async () => {
  if (!addReasonForm.name) {
    //弹出提示请输入内容
    ElMessage({
      message: "请输入退货原因",
      type: "error",
    });
    return;
  }
  dialogFormVisible.value = false;
  //发送post请求添加退货原因
  await addReturnReason({
    createTime: "",
    id: 1,
    name: addReasonForm.name,
    sort: addReasonForm.sort,
    status: addReasonForm.status == false ? 0 : 1,
  });
  //弹出提示添加成功
  ElMessage({
    message: "添加成功",
    type: "success",
  });
  renderView();

  addReasonForm.name = "";
};

const formInline = reactive({
  user: "",
  region: "",
});

// 分页
const currentPage1 = ref(1);
const pageSize2 = ref(5);
const small = ref(false);
const disabled = ref(false);

//点击切换页数
const handleSizeChange = async (val: number) => {
  pageSize = val;
  renderView();
};

// 点击切换每页条数
const handleCurrentChange = async (val: number) => {
  pageNum = val;
  renderView();
};

//点击修改退货原因
let dialogEditReason = ref(false);
const editReasonForm = reactive({
  status: true,
  name: "",
  sort: 0,
  id: 0,
  createTime: "",
});
const editReason = (val: number) => {
  dialogEditReason.value = true;
  list.value.forEach((item) => {
    if (item.id === val) {
      editReasonForm.status = item.status === 1 ? true : false;
      editReasonForm.name = item.name;
      editReasonForm.sort = item.sort;
      editReasonForm.id = val;
      editReasonForm.createTime = item.createTime;
    }
  });
};

//点击修改的确定按钮
const editReasonYes = async () => {
  if (!editReasonForm.name) {
    //弹出提示请输入内容
    ElMessage({
      message: "请输入修改的退货原因",
      type: "error",
    });
    return;
  }
  //发送更改退货原因的请求
  await editReturnReason(editReasonForm.id, {
    createTime: editReasonForm.createTime,
    id: editReasonForm.id,
    name: editReasonForm.name,
    sort: editReasonForm.sort,
    status: editReasonForm.status == false ? 0 : 1,
  });
  renderView();

  dialogEditReason.value = false;
};
</script>
<style lang="less" scoped>
.topBox {
  position: absolute;
  background-color: #fff;
  padding: 20px;
  z-index: 2;
  width: 83%;
}
.fenge {
  margin-top: 10px;
  height: 1px;
  background-color: #ebeef5;
}

.content {
  margin-top: 50px;
  padding: 20px;
}

.el-form--inline {
  border: 1px solid #ebeef5;
  border-radius: 5px;
  padding: 20px;
  box-sizing: border-box;
  .form1Top {
    display: flex;
    justify-content: space-between;
  }
  .form1Bottom {
    padding: 0 40px;
    box-sizing: border-box;
  }
}

.el-form--inline .el-form-item {
  margin-right: 80px;
}
:deep(.el-input) {
  width: 210px;
}
:deep(.el-pagination__editor) {
  width: 50px;
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

.form3 {
  margin-top: 20px;
}
:deep(.el-table th.el-table__cell > .cell) {
  font-size: 14px;
  font-weight: bold;
}

:deep(.el-table .el-table__cell) {
  height: 50px;
}
</style>
