import { ReadableStreamBYOBRequest } from "stream/web";
import request from "./request";
import qs from "qs";

interface LoginParams {
  password: string;
  username: string;
}
//登录接口返回数据
interface LoginData {
  token: string;
  tokenHead: string;
}

interface ResData<T> {
  code: number;
  data: T;
  message: string;
  errno:number
}
// axios请求返回的类型
type PromiseResult<T> = Promise<ResData<T>>;

//当前登录用户的信息数据
interface AdminInfoData {
  menus: {}[];
}

//退货原因数据
type List = {
  createTime: string;
  id: number;
  name: string;
  sort: number;
  status: number;
};

//请求返回的退货原因数据
interface ReturnReasonData {
  list: List[];
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: 2;
}

// 添加退货原因
interface ReturnReason {
  createTime: string;
  id: number;
  name: string;
  sort: number;
  status: number;
}

//用户列表参数
interface AdminListParams {
  keyword: string;
  pageNum: number;
  pageSize: number;
}

//用户列表返回data
interface AdminList {
  list: { id: number }[];
  pageNum: number;
  pageSize: number;
  total: number;
  totalPage: 2;
}

//用户权限接口返回数据
interface AdminRoleData {
  adminCount: number;
  createTime: string;
  description: string;
  id: number;
  name: string;
  sort: number;
  status: number;
}
//所有用户角色权限
interface RoleObjData {
  name: string;
  id: number;
}

//用户信息参数
interface AdminObjType {
  email: string;

  id: number;

  nickName: string;
  note: string;
  password: string;
  status: number;
  username: string;
}

// 登录接口
export const loginApi = (data: LoginParams): PromiseResult<LoginData> =>
  request.post("/admin/login", data);

//获取当前登录用户信息
export const getAdminInfo = (): PromiseResult<AdminInfoData> =>
  request.get("/admin/info");

// 分页查询全部退货原因
export const getReturnReasonList = (
  pageNum: number,
  pageSize: number
): PromiseResult<ReturnReasonData> =>
  request.get(`/returnReason/list?pageNum=${pageNum}&pageSize=${pageSize}`);

// 添加退货原因
export const addReturnReason = (data: ReturnReason) =>
  request.post("/returnReason/create", data);

//修改退货原因
export const editReturnReason = (id: number, data: ReturnReason) =>
  request.post(`/returnReason/update/${id}`, data);

// 修改退货原因启用状态
export const editReasonStatus = (status: number, id: number) =>
  request.post(`/returnReason/update/status?status=${status}&ids=${id}`);

// 批量删除退货原因
export const delReturnReason = (ids: number[]) =>
  request.post(`/returnReason/delete?ids=${ids}`);

// 分页查询退货的申请传参的数据
interface retApplyListData {
  pageNum: number;
  pageSize: number;
  createTime?: string;
  handleMan?: string;
  handleTime?: string;
  id?: number;
  receiverKeyword?: string;
  status?: number | string;
}
//分页查询的get请求
export const returnApplyList = (
  data: retApplyListData
): PromiseResult<ReturnReasonData> =>
  request.get(`/returnApply/list?pageNum=${data.pageNum}&pageSize=${
    data.pageSize
  }
${data.createTime ? "&createTime=" + data.createTime : ""}
${data.handleMan ? "&handleMan=" + data.handleMan : ""}
${data.handleTime ? "&handleTime=" + data.handleTime : ""}
${data.id ? "&id=" + data.id : ""}
${data.receiverKeyword ? "&receiverKeyword=" + data.receiverKeyword : ""}
${data.status == undefined ? "" : "&status=" + data.status}
`);

// 批量删除退货申请
export const delReturnApply = (ids: number[]): PromiseResult<null> =>
  request.post(`/returnApply/delete?ids=${ids}`);

// 获取退货申请详情
export const getReturnApplyDetails = (id: number) =>
  request.get(`/returnApply/${id}`);

//获取用户列表
export const getAdminList = (data: AdminListParams): PromiseResult<AdminList> =>
  request.get("/admin/list", { params: data });

// 获取指定用户的角色
export const getAdminRole = (id: number): PromiseResult<AdminRoleData[]> =>
  request.get(`/admin/role/${id}`);

//获取所有角色列表
export const getRoleListAll = (): PromiseResult<RoleObjData[]> =>
  request.get("/role/listAll");

// 给用户分配角色
export const updateAdminRole = (data: {
  adminId: number;
  roleIds: string;
}): PromiseResult<{}> => request.post(`/admin/role/update`, qs.stringify(data));

//修改用户信息
export const updateAdminInfo = (
  id: number,
  data: AdminObjType
): PromiseResult<unknown> => request.post("/admin/update/" + id, data);

// 用户注册
export const registerAdmin = (data: AdminObjType): PromiseResult<unknown> =>
  request.post("/admin/register", data);

//图表数据
export const getAdminStat=():PromiseResult<IndexStatData>=>request.get("http://kumanxuan1.f3322.net:8360/admin/stat");