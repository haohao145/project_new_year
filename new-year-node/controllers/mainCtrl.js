//依赖，用来接收东西 处理post请求
var formidable = require("formidable");
var path = require("path");
//读取内容的内置模块，file system 文件系统
var fs = require("fs");

//使用 用户 模块
var User = require("../models/User.js")

var Prize = require("../models/Prize.js")

var key = require("../models/key.js")


//增加用户
exports.userAdd = function (req, res) {
	try {


		// 使用formidable
		var form = new formidable.IncomingForm();

		//设置上传的文件存放在那个问价夹里面
		form.uploadDir = "./static/uploads";
		//格式
		form.encoding = 'utf-8';
		//原样保存
		form.keepExtensions = true;
		//开始处理表单，||||||重点|||||| 回调函数会转换请求中所包含的表单数据，其中 fields 表示普通控件 files 表示文件控件，files可以输出上传文件的详细信息
		form.parse(req, function (err, fields, files) {
			// console.log(files.file.path)  //储存的路径
			//验证是否有文件这个控件，和他有没有名字

			try {


				if (!files) {
					res.end("请选择要上传的文件")
					console.log("请选择要上传的文件")
					return
				}
				// console.log(files)
				// console.log(fields)
				//名称和路径
				let imgPath = './static/uploads/' + fields.id + ".jpg";
				// //formidable天生传输文件没有名字的拓展名
				// //给上传的文件改名(默认的路劲就是他原来的名字，默认的路劲就是他原来的名字 + 获取到的文件拓展名，回调函数)
				if (!files.file) {
					res.send("请上传图片")
					console.log("请上传图片")
					return
				}

				fs.rename(files.file.path, imgPath, function (err) {

					if (err) {
						res.send("头像生成失败")
					} else {

						//重装一下数据  id名 等于图片名字
						var json = {
							id: fields.id, //具有唯一性   32位
							openId: 'Stying', //获取的微信 openid
							staffName: fields.staffName, //员工姓名
							department: fields.department, //部门
							FamilyPeople: fields.FamilyPeople, //是否家属 1 是  0 不是
							Familyname: fields.Familyname, //家属姓名
							telePhone: fields.telePhone, //电话
							isScene: fields.isScene, //是否在现场  1在  0 不在
							imgpath: 'uploads/' + fields.id + ".jpg", //图片
						}
						//调用user  中的  静态方法 查询没有重复后  存入数据库 病返回结果
						User.addUser(json, function (result) {
							if (result != 200) {
								console.log("删除多余文件")
								//删除文件  往服务器 储存数据不成功  所以要删除多余的图片
								fs.unlink(imgPath, function (err) {
									if (err) {
										console.log("删除问件错误");
										return;
									}
								})
							}
							//向前端返回数据 
							res.json({
								"result": result,
								"id": json.id
							})
						})
					}
				})
			} catch (error) {
				console.log(error)
				res.send("请上传图片")
			}
		});

		// 失败 文本域 文件
		// form.parse(req, function (err, fields, files) {
		// 	console.log(files);
		// 	let userData = fields;
		// 	res.json({
		// 		"code": 200
		// 	})
		// });
	} catch (error) {
		console.log(error)
	}

}


//查询所有用户
exports.userCheck = function (req, res) {
	try {


		//调用user  中的  静态方法 查询没有重复后  存入数据库 病返回结果
		User.checkUserAll(function (result) {
			if (result) {
				//向前端返回数据 
				res.json({
					"data": result,
					"code": 200
				})
			} else {
				//向前端返回数据 
				res.json({
					"data": result,
					"code": -1
				})
			}
		})
	} catch (error) {
		console.log(error)
	}
}



//查询所有用户
exports.userFindScene = function (req, res) {
	try {


		//调用user  中的  静态方法 查询没有重复后  存入数据库 病返回结果
		User.checkUserScene(function (result) {
			if (result) {
				//向前端返回数据 
				res.json({
					"data": result,
					"code": 200
				})
			} else {
				//向前端返回数据 
				res.json({
					"data": result,
					"code": -1
				})
			}
		})
	} catch (error) {
		console.log(error)
	}
}


//查询单个用户
exports.userFind = function (req, res) {
	try {


		var form = new formidable.IncomingForm();
		//接受上传的内容
		form.parse(req, function (err, fields, files) {

			//调用user  中的  静态方法 查询没有重复后  存入数据库 病返回结果
			User.userFind(fields.id, function (result) {
				if (result) {
					//向前端返回数据 
					res.json({
						"data": result,
						"code": 200
					})
					// console.log(fields)
					// console.log(result)
				} else {
					//向前端返回数据 
					res.json({
						"data": result,
						"code": -1
					})
				}
			})

		})

	} catch (error) {
		console.log(error)
	}

}


//提交中奖信息
exports.upPrizeData = function (req, res) {
	try {


		var form = new formidable.IncomingForm();
		//接受上传的内容
		form.parse(req, function (err, fields, files) {
			// console.log(fields)
			var num = 0;
			//调用user  中的  静态方法 查询没有重复后  存入数据库 病返回结果
			Prize.addprize(fields.data, function (result) {
				num += result;
				console.log(num)
				if (num == fields.data.length) {
					//向前端返回数据 
					res.json({
						"result": 200
					})
				}

			})
		})
	} catch (error) {

	}
}




//拉取中奖信息prizeData
exports.prizeData = function (req, res) {
	try {
		//
		Prize.checkPrizeAll(function (result) {

			if (result) {
				//向前端返回数据 
				res.json({
					"data": result,
					"code": 200
				})
			} else {
				//向前端返回数据 
				res.json({
					"data": result,
					"code": -1
				})
			}
		})
	} catch (error) {

	}

}


//查询  本地储存的 健名
exports.checkKey = function (req, res) {
	try {


		key.checkKey(function (data) {
			if (data.code == 200) {
				res.json({
					"code": 200,
					"key": data.key
				})
			} else {
				res.json({
					"code": -1
				})
			}
		})
	} catch (error) {
		console.log(error)
	}

}


//删除所有数据
exports.delete = function (req, res) {
	console.log("接收到删除请求")
	try {

		//删除中奖信息
		Prize.deleteAll(function (result) {
			//判断删除中奖信息成功
			if (result == 200) {
				//删除用户
				User.deleteAll(function (results) {
					if (results == 200) {
						//重新设置  本地储存的健名
						key.setKey(function (data) {
							if (data == 200) {
								res.json({
									"code": 200
								})
							} else {
								res.json({
									"code": -1
								})
							}
						})

					} else {
						res.json({
							"code": -1
						})
					}
				})
			} else {
				res.json({
					"code": -1
				})
			}
		})

	} catch (error) {
		console.log(error)
	}


}