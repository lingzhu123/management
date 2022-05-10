<!--  -->
<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="topL">
          <span> 叩丁狼电商运营平台</span>
          <i class="iconfont icon-menu" @click="hdIsCollapse" />
        </div>
        <div class="topR">
          <el-dropdown>
            <span style="color: white">admin</span>
            <el-icon><arrow-down /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/index/home')"
                  >首页</el-dropdown-item
                >
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside class="el-menu-vertical-demo">
          <el-scrollbar>
            <el-menu
              :default-active="routerShow"
              :collapse="isCollapse"
              :collapse-transition="false"
              :unique-opened="true"
              :router="true"
            >
              <el-menu-item index="/index/home">
                <i class="iconfont icon-home" />&nbsp;&nbsp;&nbsp;
                <span v-show="!isCollapse">首页</span>
              </el-menu-item>
              <el-sub-menu
                :index="menu.id + ''"
                v-for="menu in newMenusObj"
                :key="menu.id"
              >
                <template #title>
                  <i
                    class="iconfont"
                    :class="'icon-' + menu.icon"
                  />&nbsp;&nbsp;&nbsp;
                  <span v-show="!isCollapse">{{ menu.title }}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item
                    :index="'/' + menu.name + '/' + submenu.name"
                    v-for="submenu in menu.children"
                    :key="submenu.id"
                    v-show="!submenu.hidden"
                  >
                    <i
                      class="iconfont"
                      :class="'icon-' + submenu.icon"
                    />&nbsp;&nbsp;&nbsp; {{ submenu.title }}</el-menu-item
                  >
                </el-menu-item-group>
              </el-sub-menu>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import "../../assets/fonts/iconfont.css";

const store = useStore();
const router = useRouter();

let newMenusObj = computed(() => {
  return store.getters.genNewMenus;
});

const isCollapse = ref(false);
const routerShow = ref("/index/home");

const hdIsCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
watch(
  router.currentRoute,
  (newVal, oldVal) => {
    routerShow.value = newVal.path;
  },
  { immediate: true }
);
</script>
<style lang="less" scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
}

.el-container {
  height: 100vh;
  width: 100vw;

  .el-header {
    width: 100vw;
    height: 70px;
    background-color: #409eff;
    display: flex;
    justify-content: space-between;
    color: #fff;
    .topL {
      line-height: 70px;
      span {
        font-size: 24px;
        margin-right: 20px;
      }
    }
    .topR {
      line-height: 70px;
      span {
        font-size: 14px;
        margin-right: 6px;
      }

      .el-dropdown {
        line-height: 70px;
        .el-icon {
          font-weight: bold;
          vertical-align: middle;
          color: #fff;
        }
      }
    }
  }
  .el-container {
    .el-aside {
      width: v-bind('isCollapse?"60px":"250px"');
      background-color: #304156;
      transition: 0.35s;
      :deep(.el-menu) {
        background-color: #304156;
        --el-menu-hover-bg-color: #263445;
        --el-menu-text-color: #fff;
        --el-menu-border-color: #304156;

        .el-sub-menu.home {
          .el-sub-menu__icon-arrow {
            display: none;
          }
        }
      }
    }
  }
}

:deep(.el-main) {
  --el-main-padding: 0px;
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: var(--el-main-padding);
  height: calc(100vh - 70px);
  overflow: hidden;
  overflow-y: auto;
}

:deep(.el-dialog) {
  --el-dialog-width: 25%;
  --el-dialog-margin-top: 15vh;
  --el-dialog-bg-color: var(--el-bg-color);
  --el-dialog-box-shadow: var(--el-box-shadow);
  --el-dialog-title-font-size: var(--el-font-size-large);
  --el-dialog-content-font-size: 14px;
  --el-dialog-font-line-height: var(--el-font-line-height-primary);
  --el-dialog-padding-primary: 20px;
  --el-dialog-border-radius: var(--el-border-radius-small);
  position: relative;
  margin: var(--el-dialog-margin-top, 15vh) auto 50px;
  background: var(--el-dialog-bg-color);
  border-radius: var(--el-dialog-border-radius);
  box-shadow: var(--el-dialog-box-shadow);
  box-sizing: border-box;
  width: var(--el-dialog-width, 25%);
}

</style>
