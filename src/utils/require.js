import axios from 'axios';


// 创建一个 Axios 实例
const http = axios.create({
    baseURL: 'https:/v3pz.itndedu.com/v3pz', // 替换为你的 API 基础 URL
    timeout: 10000, // 请求超时时间
    // headers: { 'Content-Type': 'application/json' }, // 默认请求头
});

// 请求拦截器
http.interceptors.request.use(
    config => {

        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
http.interceptors.response.use(
    response => {


        return response.data;
    },
    error => {
        // 对响应错误做点什么
        if (error.response) {
            // 服务器返回了状态码，并且状态码触发了错误处理
            switch (error.response.status) {
                case 401:
                    // 未授权，重定向到登录页面或显示登录弹窗
                    console.error('未授权，请登录');
                    break;
                case 403:
                    // 禁止访问
                    console.error('禁止访问');
                    break;
                case 404:
                    // 资源未找到
                    console.error('资源未找到');
                    break;
                case 500:
                    // 服务器错误
                    console.error('服务器错误');
                    break;
                default:
                    console.error('其他错误', error.response.data);
            }
        } else if (error.request) {
            // 请求已发出，但没有收到响应
            console.error('请求已发出，但没有收到响应', error.request);
        } else {
            // 发生在设置请求时
            console.error('请求配置错误', error.message);
        }
        return Promise.reject(error);
    }
);


export default http;