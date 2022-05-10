<!-- 订单详情 -->
<template>
  <div>{{ getDetails.data }}</div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref } from "vue";
import { getReturnApplyDetails } from "../../request/http";
import { useRouter } from "vue-router";
const router = useRouter();
let obj = router.currentRoute.value.query;
let id = obj.id as string;
console.log(id);

let getDetails = await getReturnApplyDetails(Number(id));
console.log(getDetails);
</script>
<style lang="less" scoped></style>
