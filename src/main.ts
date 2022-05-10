import { createApp } from "vue";
import App from "./App.vue";
import { initRouter } from "./router";
import * as ElIconModules from "@element-plus/icons-vue";
import "reset-css";
import { initStore } from "./store";

import directiveOption from "./directives/index";

let app = createApp(App);

//初始化路由
initRouter(app);
//初始化store
initStore(app);
app.mount("#app");

// 全局注册自定义指令
for (let key in directiveOption) {
  app.directive(key, directiveOption[key]);
}

// 统一注册Icon图标
for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName)) {
    const item = ElIconModules[iconName];
    app.component(iconName, item);
  }
}
