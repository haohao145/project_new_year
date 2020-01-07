//封装几个常用的方法，get、post、put、delete
//当前问价夹下的 axios.js  封装好的拦截器
import axios from './http'

// 引入qs模块，用来序列化post类型的数据，后面会提到
import QS from 'qs';


let instance = axios()


// get方法：我们通过定义一个get函数，get函数有两个参数，第一个参数表示我们要请求的url地址，第二个参数是我们要携带的请求参数。get函数返回一个promise对象，
// 当axios其请求成功时resolve服务器返回 值，请求失败时reject错误值。最后通过export抛出get函数。
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        instance.get(url, {
            params: params
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}


// ost方法：原理同get基本一样，但是要注意的是，post方法必须要使用对提交从参数对象进行序列化的操作，所以这里我们通过node的qs模块来序列化我们的参数。
// 这个很重要，如果没有序列化操作，后台是拿不到你提交的数据的。这就是文章开头我们import QS from ‘qs’; 的原因。
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        // instance.post(url, QS.stringify(params))
        instance.post(url, params)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
