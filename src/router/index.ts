import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { App } from "vue";
import store from "../store";
import Cookies from "js-cookie";
import { getAdminInfo } from "../request/http";
import path from "path";
import { Chicken } from "@element-plus/icons-vue/dist/types";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login/Login.vue"),
    },
  ],
});

// 封装生成路由规则
const genRoutesConfig = () => {
  //1.获取vuex里面的getters数据
  let genNewMenus: NewMenusType = store.getters.genNewMenus;
  for (let key in genNewMenus) {
    let newRouteObj: RouteRecordRaw = {
      path: "/" + genNewMenus[key].name,
      name: genNewMenus[key].name,
      component: () => import("../views/index/Index.vue"),
      children: [],
    };
    if (genNewMenus[key].children) {
      for (let i = 0; i < genNewMenus[key].children!.length; i++) {
        //二级路由规则
        let subRouteObj: RouteRecordRaw = {
          path: genNewMenus[key].children![i].name,
          name: genNewMenus[key].children![i].name,
          component: () =>
            import(
              `../views/${genNewMenus[key].name}/${
                genNewMenus[key].children![i].name
              }.vue`
            ),
        };
        newRouteObj.children!.push(subRouteObj);
      }
    }

    //动态添加路由规则
    router.addRoute(newRouteObj);
  }
  router.addRoute({
    path: "/index",
    name: "index",
    component: () => import("../views/index/Index.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/index/home.vue"),
      },
    ],
  });
};

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to, from);
  const token = Cookies.get("token");
  //已登录和vuex中数据不存在时重新获取当前登录用户的信息
  if (token && store.state.menus.length === 0) {
    // 发送请求重新获取数据
    getAdminInfo().then((res) => {
      if (res.code === 200) {
        //将数据重新存到vuex
        store.commit("updateMenus", res.data.menus);
        // 动态添加路由规则
        genRoutesConfig();
        next(to);
      }
    });

    //如果首次登录进到首页还没生成路由规则的解决办法
  } else if (token && from.path === "/login" && to.path === "/home") {
    genRoutesConfig();
    next("/index/home");
    

    //如果token失效清除后并且当前不在登录页面的话刷新页面重定向到登录页面
  } else if (!token && to.path !== "/login") {
    next("/login");

    // 如果已登录手动修改url上的路径跳转到login登录页面的话阻止跳转,重定向到本页面
  } else if (token && to.path === "/login") {
    if (from.path == "/") {
      next();
    } else {
      next(from);
    }
  } else {
    next();
  }
});

// use()方法里面可以传一个对象或者一个函数,传入函数的话函数就会被调用,传入对象的话,对象身上要有install属性,会调用install对应的方法

// export default router;
export const initRouter = (app: App<Element>) => {
  app.use(router);
};
