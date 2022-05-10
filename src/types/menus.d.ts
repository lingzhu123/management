interface MenuObjType {
    parentId: number;
    id: number;
    name:string;
    children?: MenuObjType[];
  }
  interface State {
    menus: MenuObjType[];
  }
  interface NewMenusType {
    [key: number]: MenuObjType;
  }
  