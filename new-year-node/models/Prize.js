//引入mongoose 因为这里面的模型要用
var mongoose = require("mongoose");


//创建一个schema,模型， schema 的书写，可以是 基本类型、数组、对象、也可以用 default 来指定默认值
var peopleSchema = new mongoose.Schema({

    prizeclass: String,
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





//静态方法，增加中奖人员
peopleSchema.statics.addprize = function (json, callback) {
    json.forEach((item, index) => {
        Prize.checkPrize(item, function (torf) {
            if (torf) {
                let s = Prize(item);
                s.save()
                //返回控制器一个 200  表示成功
                callback(1);
            } else {
                callback(-1);
            }
        })
    });
}


//静态方法，已经中奖的人  查询内容是  id 或者 openid
peopleSchema.statics.checkPrize = function (json, callback) {
    this.find({
        "id": json.id
    }, function (err, results) {
        //返回结果  数据库中有这个信息 返回false  没有  可以添加  返回 true
        callback(results.length == 0)
    })
}


//静态方法，查询所有用户
peopleSchema.statics.checkPrizeAll = function (callback) {
    this.find({}, function (err, results) {
        //返回结果  数据库中有这个信息 返回false  没有  可以添加  返回 true
        callback(results)
    })
}

//创建一个类,集合名字自动首字母小写后面加s
var Prize = mongoose.model("prize", peopleSchema);

//暴露
module.exports = Prize;