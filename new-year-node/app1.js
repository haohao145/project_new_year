//依赖 启动服务 、数据库、session、  
var express = require("express");
const mongoose = require('mongoose');
var session = require("express-session");
// const jws = require("jsonwebtoken"); //生成 token   


//引入总控制器
const mianctrl = require("./controllers/mainCtrl.js");

//创建app
var app = express();

var server = require('http').Server(app);
//引用socket.io
var io = require('socket.io')(server, {
	path: '/websocket'
});

//使用 websocket
app.use(function (req, res, next) {
	res.io = io;
});

// 生成token方法
// function generateToken(data) {

// }

//连接数据库
mongoose.connect('mongodb://localhost:27017/newyear', {
	useNewUrlParser: true
}, function () {
	console.log("数据库连接成功")
});


//使用 session    
// app.use(session({
// 	secret: 'lihao', //通过引号里面的字符串 对内容进行加密 引号里面的内容可以随便写
// 	cookie: {
// 		maxAge: 1000 * 60 * 60
// 	}, //保持时间  10分钟
// 	resave: false,
// 	saveUninitialized: true
// }))


//中间件,路由清单
app.post("/addUser", mianctrl.addUser);


//web 通讯
io.on('connection', function (socket) {
	//向用户传递消息
	socket.emit('news', {
		hello: 'world1'
	});
	// 接收并处理客户端的hi事件
	socket.on('start', function (data) {
		// ....
		console('start', data)
	});
	socket.on('connect', function (data) {
		// ....
		console('connect', data)
	});
	socket.on('message', function (data) {
		// ....
		console('message', data)
	});
	socket.on('text', function (data) {
		console.log(data);
	});
	// 断开事件
	socket.on('disconnect', function (data) {
		console.log('断开通话');
		//socket.emit('c_leave','离开');
		//socket.broadcast用于向整个网络广播(除自己之外)
		//socket.broadcast.emit('c_leave','某某人离开了')
	})

});



//设置一个 404 页面，当上面的中间件和静态资源问价夹 都没有捕获的时候 就使用这个
app.use(function (req, res) {
	res.send("出错了，你的页面不存在");
})


//3000端口
// app.listen(3000, function () {
// 	console.log("程序运行在3000端口");
// });


var port = 3000;
app.set('port', port);
server.listen(port, function () {
	console.log("node在3000端口的服务启动成功");
});