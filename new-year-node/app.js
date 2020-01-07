//依赖 启动服务 、数据库、 //WebSocket
var express = require('express');
const mongoose = require('mongoose');

//WebSocket 插件
var expressWs = require('express-ws');
//使用WebSocket
var expressWs = expressWs(express());
var app = expressWs.app;

// const bodyParser = require('body-parser');
// app.use(bodyParser.json()); //数据JSON类型
// app.use(bodyParser.urlencoded({
// 	extended: false
// })); //解析post请求数据


//自定义模块
const mianctrl = require("./controllers/mainCtrl.js");

//获得所有访问接口
var wss = expressWs.getWss()

//连接数据库
mongoose.connect('mongodb://localhost:27017/newyear', {
	useNewUrlParser: true
}, function (err) {
	if (err) {
		console.log("数据库连接失败")
		return
	}
	console.log("数据库连接成功")
});

//外部调用 websocket
// var aWss = expressWs.getWss('/websocket');
// aWss.clients.forEach(function (client) {
// 	client.send('hello');
// });

app.ws('/websocket', function (ws, req) {
	//监听
	ws.on('message', function (msg) {
		//向发送消息的人返回发起的通知
		ws.send("200")
		//向所有人返回通知
		wss.clients.forEach(function (client) {
			client.send(msg);
		});
		console.log(msg)
	})

})


//中间件,添加用户
app.post("/useradd", mianctrl.userAdd);

//查询所有用户
app.post('/user', mianctrl.userCheck);


//查询所有用户
app.post('/userfind', mianctrl.userFind);

//提交中奖信息
app.post('/upprize', mianctrl.upPrizeData);

//拉取中奖信息
app.post('/priezdata', mianctrl.prizeData);


// 里面的文件将自动拥有路由 
app.use(express.static("static"));


//设置一个 404 页面，当上面的中间件和静态资源问价夹 都没有捕获的时候 就使用这个
app.use(function (req, res) {
	res.send("出错了，你的页面不存在");
})

app.listen(3000, function () {
	console.log("node在3000端口的服务启动成功");
});