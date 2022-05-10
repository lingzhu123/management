<!-- 退货申请处理 -->
<template>
  <div class="topBox">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index/home' }"
        >首页</el-breadcrumb-item
      >
      <el-breadcrumb-item :to="{ path: '/oms' }">订单</el-breadcrumb-item>
      <el-breadcrumb-item>退货申请处理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="fenge"></div>
    <!-- <el-divider /> -->
  </div>
  <div class="content">
    <el-form :inline="true" class="demo-form-inline form1">
      <div class="form1Top">
        <div class="form1TopL">
          <el-icon style="vertical-align: middle"><search /></el-icon>筛选搜索
        </div>
        <div class="form1TopR">
          <el-button @click="reset">重置</el-button>
          <el-button type="primary" @click="hdFilterSearch">查询搜索</el-button>
        </div>
      </div>
      <div class="form1Bottom">
        <el-form-item label="输入搜索:">
          <el-input v-model="filterSearch.id" placeholder="服务单号" />
        </el-form-item>
        <el-form-item label="处理状态:">
          <el-select placeholder="全部" clearable v-model="filterSearch.status">
            <el-option label="待处理" value="0" />
            <el-option label="退货中" value="1" />
            <el-option label="已完成" value="2" />
            <el-option label="已拒绝" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间:">
          <el-date-picker
            type="date"
            v-model="filterSearch.createTime"
            placeholder="请选择时间"
          />
        </el-form-item>
        <el-form-item label="操作人员:">
          <el-input v-model="filterSearch.handleMan" placeholder="全部" />
        </el-form-item>
        <el-form-item label="处理时间:">
          <el-date-picker
            type="date"
            v-model="filterSearch.handleTime"
            placeholder="请选择时间"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="form2">
      <el-icon style="vertical-align: middle"><document /></el-icon>数据列表
    </div>

    <!-- 表格 -->
    <div class="form3">
      <el-table
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :border="true"
        table-layout="auto"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="服务单号" align="center" property="id" />
        <el-table-column align="center" label="申请时间" width="180">
          <template #default="scope">
            <span>{{
              dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="memberUsername"
          label="用户账号"
          align="center"
        />
        <el-table-column
          label="退款金额"
          show-overflow-tooltip
          width="150"
          align="center"
        >
          <template #default="scope">
            <span>¥{{ scope.row.productRealPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请状态"
          show-overflow-tooltip
          width="150"
          align="center"
        >
          <template #default="scope">
            <span>{{
              scope.row.status === 0
                ? "待处理"
                : scope.row.status === 1
                ? "退货中"
                : scope.row.status === 2
                ? "已完成"
                : "已拒绝"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="处理时间"
          show-overflow-tooltip
          width="180"
          align="center"
        >
          <template #default="scope">
            <span>{{
              scope.row.status === 0
                ? ""
                : dayjs(scope.row.handleTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip
          align="center"
          width="180px"
          fixed="right"
        >
          <template #default="scope">
            <el-button
              size="small"
              @click="router.push(`/oms/returnApplyDetail?id=${scope.row.id}`)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div
        style="margin-top: 20px; display: flex; justify-content: space-between"
      >
        <div>
          <el-select placeholder="批量删除">
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
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, nextTick } from "vue";
import { returnApplyList, delReturnApply } from "../../request/http";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import dayjs from "dayjs";
const router = useRouter();

let pageNum = 1;
let pageSize = 10;

const returnAppList = await returnApplyList({
  pageNum,
  pageSize,
});
let list = ref(returnAppList.data.list);
let total = ref(returnAppList.data.total);

//封装重新渲染页面的请求
const renderView = async () => {
  const returnAppList = await returnApplyList({ pageNum, pageSize });
  list.value = returnAppList.data.list;
  total.value = returnAppList.data.total;
};

//筛选搜索
const filterSearch = reactive({
  id: "",
  status: "",
  createTime: "",
  handleMan: "",
  handleTime: "",
});

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 重置按钮  by 李岳森    220503周二19:08
const reset = () => {

  filterSearch.id = "";
  filterSearch.status = "";
  filterSearch.createTime = "";
  filterSearch.handleMan = "";
  filterSearch.handleTime = "";
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 重置按钮  by 李岳森    220503周二19:08

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 筛选搜索  by 李岳森    220503周二19:15
const hdFilterSearch = async () => {

  let id = Number(filterSearch.id.trim());
  let status = filterSearch.status;
  let createTime = filterSearch.createTime
    ? dayjs(filterSearch.createTime).format("YYYY-MM-DD")
    : "";
  let handleMan = filterSearch.handleMan.trim();
  let handleTime = filterSearch.handleTime
    ? dayjs(filterSearch.handleTime).format("YYYY-MM-DD")
    : "";

  // if (!id && !status && !createTime && !handleMan && !handleTime) {
  //   ElMessage({
  //     type: "warning",
  //     message: "请输入要查询的内容",
  //   });
  //   return;
  // }

  //请求退货数据
  const returnAppList = await returnApplyList({
    pageNum,
    pageSize,
    id,
    status,
    createTime,
    handleMan,
    handleTime,
  });

  // 重新渲染页面
  total.value = returnAppList.data.total;
  list.value = returnAppList.data.list;
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 筛选搜索  by 李岳森    220503周二19:15

// ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓Start 批量删除  by 李岳森    220504周三08:31
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
  if (!branchDelArr.length) {
    ElMessage({
      type: "warning",
      message: "请选择要删除的数据",
    });
    return;
  }
  ElMessageBox.confirm("是否要进行删除操作?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    //发送批量删除的请求
    const delReason = await delReturnApply(branchDelArr);
    if (delReason.code === 500) {
      ElMessage({
        type: "error",
        message: delReason.message,
      });
      return;
    }
    renderView();

    ElMessage({
      type: "success",
      message: "删除成功",
    });
  });
};
// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑End 批量删除  by 李岳森    220504周三08:31

// 分页
const currentPage1 = ref(1);
const pageSize2 = ref(10);
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
