import axios from "axios";
import Cookies from "js-cookie";

const instance=axios.create({
    baseURL:"http://120.24.64.5:8088/mall-admin"
});

//请求拦截器
instance.interceptors.request.use(
    (config)=>{
        const token=Cookies.get("token");
        if(token){
            config.headers=config.headers||{};
            config.headers.Authorization=token
        }
        return config;
    },
    (err)=>{
        return Promise.reject(err)
    }
)

//响应后的拦截器
instance.interceptors.response.use(
    (result)=>{
        return result.data;
    },
    (err)=>{    
        return Promise.reject(err)
    }
)

//导出
export default instance