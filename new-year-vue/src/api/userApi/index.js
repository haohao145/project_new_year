//引入封装好的请求方法
import {
    get,
    post
} from '../index'

//引入接口文件
//引入默认的请求地址 头  如 http:192.168.11:8080/api 接口地址  
import baseUrl from '../baseUrl'

//罗列请求方法  和接口
export default {
    //请求路由表     
    axiosNav: (parameter) => get(baseUrl + '/sys/menu/nav', parameter),
    //登录
    axiosLogin: (parameter) => post(baseUrl + '/api/login', parameter),
    //新增用户
    axiosuseradd: (parameter) => post(baseUrl + '/useradd', parameter),
    //查询所有用户
    axiosuser: (parameter) => post(baseUrl + '/user', parameter),
    //查询所有用户
    axiosuserfind: (parameter) => post(baseUrl + '/userfind', parameter),
    //提交中奖数据
    upPriezData: (parameter) => post(baseUrl + '/upprize', parameter),
    //检索中奖数据
    priezData: (parameter) => post(baseUrl + '/priezdata', parameter)
}
