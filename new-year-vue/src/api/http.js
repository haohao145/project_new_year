// 在http.js中引入axios
import axios from 'axios'; // 引入axios
import {
    Message,
    Loading
} from 'element-ui'
// 创建 axios 实例  默认项的自定义配置
let service = axios.create({
    // headers: {'Content-Type': 'application/json'},
    timeout: 60000
})


// 设置 post、put 默认 Content-Type  请求头
service.defaults.headers.post['Content-Type'] = 'application/json'
// service.defaults.headers.post['Content-Type'] = 'multipart/form-data'
service.defaults.headers.put['Content-Type'] = 'application/json'

// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        if (config.method === 'post' || config.method === 'put') {
            // post、put 提交时，将对象转换为string, 为处理Java后台解析问题
            // config.data = JSON.stringify(config.data)
        }

        // 每次发送请求之前判断vuex中是否存在token        
        // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
        // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断 
        // const token = store.state.token;
        // token && (config.headers.Authorization = token);

        // config.headers['token'] = Vue.cookie.get('token') // 请求头带上token

        // 请求发送前进行处理  处理数据
        return config
    },
    (error) => {
        // 请求错误处理   Promise.reject  抛出错误
        return Promise.reject("请求前拦截-错误：" + error)
    }
)

let _this = this;
// 添加响应拦截器
service.interceptors.response.use(
    (response) => {

        // console.log(response)
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        if (response.status === 200) {
            return Promise.resolve(response);
        } else {
            Message.error("登录失败")
            return Promise.reject(response);
        }

    },
    // 服务器状态码不是2开头的的情况
    // 需要跟后台开发人员协商好统一的错误状态码    
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    (error) => {
        Message.error("登录失败")
        console.log("请求在响应阶段被拦截了，请求失败")
        if (error.response.status) {
            switch (error.response.status) {
                // 401: 未登录
                // 未登录则跳转登录页面，并携带当前页面的路径
                // 在登录成功后返回当前页面，这一步需要在登录页操作。                
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;

                    // 403 token过期
                    // 登录过期对用户进行提示
                    // 清除本地token和清空vuex中token对象
                    // 跳转登录页面                
                case 403:
                    Toast({
                        message: '登录过期，请重新登录',
                        duration: 1000,
                        forbidClick: true
                    });
                    // 清除token
                    localStorage.removeItem('token');
                    store.commit('loginSuccess', null);
                    // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面 
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;

                    // 404请求不存在
                case 404:
                    Toast({
                        message: '网络请求不存在',
                        duration: 1500,
                        forbidClick: true
                    });
                    break;
                    // 其他错误，直接抛出错误提示
                default:
                    Toast({
                        message: error.response.data.message,
                        duration: 1500,
                        forbidClick: true
                    });
            }
            return Promise.reject(error.response);
        }

    }
)

// 创建统一封装过的 axios 实例   @return {AxiosInstance}
export default function () {
    return service
}
