import { createStore } from "vuex";
import { App } from "vue";

interface MenuObjType {
  parentId: number;
  id: number;
  children?: MenuObjType[];
  name:string
}
interface State {
  menus: MenuObjType[];
}
interface NewMenusType {
  [key: number]: MenuObjType;
}

const store = createStore<State>({
  state() {
    return {
      menus: [],
    };
  },
  getters: {
    genNewMenus(state) {
      let newMenus: NewMenusType = {};
      for (let i = 0; i < state.menus.length; i++) {
        if (state.menus[i].parentId === 0) {
          //一级菜单
          let key = state.menus[i].id;
          let value = state.menus[i];
          // newMenus[key]=value
          newMenus[key] = { ...value, children: newMenus[key]?.children || [] };
        } else {
          //二级菜单
          //二级菜单所对应的一级菜单id
          let id = state.menus[i].parentId;
          newMenus[id] = newMenus[id] || {};
          newMenus[id].children = newMenus[id].children || [];
          newMenus[id].children!.push(state.menus[i]);
        }
      }
      return newMenus;
    },
    menusWithName(state) {
      return state.menus.map((item) => item.name);
    },
  },
  mutations: {
    updateMenus(state, menus) {
      state.menus = menus;
    },
  },
  actions: {},
  modules: {},
});

export const initStore = (app: App<Element>) => {
  app.use(store);
};

export default store;
