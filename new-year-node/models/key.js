//使用nodejs 本地储存
var {
    LocalStorage
} = require('node-localstorage')
//是一个构造函数
var localStorage = new LocalStorage('./static/key')

//设置  键名
exports.setKey = function (callback) {
    var s = [];
    var hexDigits = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 6; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    let keya = s.join("");
    // console.log(uuidA)

    //把健名存到本地出巡 
    localStorage.setItem("key", keya);

    //检验是否储存成功
    let key = localStorage.getItem("key");
    if (key) {
        callback(200)
    } else {
        callback(-1)
    }
}

//查询键名
exports.checkKey = function (callback) {
    let key = localStorage.getItem("key");
    if (key) {
        callback({
            "code": 200,
            "key": key
        })
    } else {
        callback(-1)
    }
}