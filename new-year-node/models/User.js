//引入mongoose 因为这里面的模型要用
var mongoose = require("mongoose");


//创建一个schema,模型， schema 的书写，可以是 基本类型、数组、对象、也可以用 default 来指定默认值
var peopleSchema = new mongoose.Schema({
	id: String, //具有唯一性   32位
	openId: String, //获取的微信 openid
	staffName: String, //员工姓名
	department: String, //部门
	FamilyPeople: String, //是否家属 1 是  0 不是
	Familyname: String, //家属姓名
	telePhone: String, //电话
	isScene: String, //是否在现场  1在  0 不在
	imgpath: String, //图片
})

//静态方法，增加永华
peopleSchema.statics.addUser = function (json, callback) {
	User.checkUser(json, function (torf) {
		if (torf) {
			let s = User(json);
			s.save(function (err) {
				if (err) {
					//返回控制器一个 -1  表示失败
					callback(-1);
				} else {
					//返回控制器一个 200  表示成功
					callback(200);
				}
			})

		} else {
			callback(-1);
		}
	})
}

//静态方法，查找数据库中是否用这个人  不能重复的内容： 电话   id  openid  
peopleSchema.statics.checkUser = function (json, callback) {
	this.find({
		$or: [
			// { "openId": json.openId },
			{
				"id": json.id
			}, {
				"telePhone": json.telePhone
			}
		]
	}, function (err, results) {
		//返回结果  数据库中有这个信息 返回false  没有  可以添加  返回 true
		callback(results.length == 0)
	})
}

//静态方法，查询所有用户
peopleSchema.statics.checkUserAll = function (callback) {
	this.find({}, function (err, results) {
		//返回结果  数据库中有这个信息 返回false  没有  可以添加  返回 true
		callback(results)
	})
}


//查询在现场的所有用户
peopleSchema.statics.checkUserScene = function (callback) {
	this.find({
		isScene: '1'
	}, function (err, results) {
		//返回结果  数据库中有这个信息 返回false  没有  可以添加  返回 true
		callback(results)
	})
}


//静态方法，查询所有用户
peopleSchema.statics.userFind = function (id, callback) {
	this.find({
		'id': id
	}, function (err, results) {
		//返回结果  数据库中有这个信息 返回false  没有  可以添加  返回 true
		callback(results)
	})
}


//删除所有用户信息
peopleSchema.statics.deleteAll = function (callback) {
	mongoose.connection.collection("users").drop(function (err) {
		if (err) {
			console.log("失败")
			callback(-1)
			return;
		}
		callback(200)
	})
}



//创建一个类,集合名字自动首字母小写后面加s
var User = mongoose.model("user", peopleSchema);

//暴露
module.exports = User;