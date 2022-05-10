<script lang="ts" setup>
import { ref } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import 'element-plus/dist/index.css'


const locale = ref(zhCn);
</script>

<template>
  <Suspense>
    <el-config-provider :locale="locale">
      <router-view></router-view>
    </el-config-provider>
  </Suspense>
</template>

<style lang="less">
body {
  overflow: hidden;
}
</style>
