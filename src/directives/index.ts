import store from "../store";
import { DirectiveBinding, Directive } from "vue";
const directiveObj: {
  [key: string]: Directive<any, any>;
} = {
  permission: {
    mounted(el: any, binding: DirectiveBinding<any>) { //el表示自定义指令作用于的标签  binding表示v-permission对应的值
        // 判断后端返回的个人信息数组里面有没有这个权限
      if (store.getters.menusWithName.indexOf(binding.value) === -1) {
        el.remove();
      }
    },
  },
  xxx: {
    beforeMount() {
      console.log("xxx");
    },
  },
};

export default directiveObj;
