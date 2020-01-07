<template>
  <div class="useradd">
    <div class="zz" v-if="zz == 1">
      <p>请使用微信扫码参与抽奖</p>
    </div>
    <div class="cropper-content">
      <div class="cropper">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
          :fixed-number="fixedNumber"
          :fixed="fixed"
        ></vueCropper>
      </div>
      <div
        class="show-preview"
        :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden'}"
      >
        <div :style="previews.div" class="preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </div>
    </div>

    <div class="footer-btn">
      <div class="scope-btn">
        <!-- <label class="btn" for="uploads">选择图片</label>
        <input
          type="file"
          id="uploads"
          style="position:absolute; clip:rect(0 0 0 0);"
          accept="image/png, image/jpeg, image/gif, image/jpg"
          @change="uploadImg($event, 1)"
        />-->
        <el-button size="mini" @click="rotateLeft" circle>↺</el-button>
        <el-button size="mini" @click="rotateRight" circle>↻</el-button>
        <!-- <Button type="ghost" @click="rotateLeft" circle>
          <span style="font-weight: 600;">↺</span>
        </Button>
        <Button type="ghost" @click="rotateRight" circle>
          <span style="font-weight: 600;">↻</span>
        </Button>-->
        <!-- <el-button type="warning" size="mini" @click="uploadImg" round>保存头像</el-button> -->
        <!-- <div @click="uploadImg">上传图片</div> -->
      </div>
      <div class="zdyrq">
        <el-upload
          class="avatar-uploader"
          action="https://10.0.111.21:3000useradd/"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="uploads"
        >
          <el-button type="success" size="mini" round>添加照片</el-button>
          <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon zdy-tj"></i>-->
        </el-upload>
      </div>
    </div>
    <!-- 以下是文本表单 -->
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="dataRule"
      ref="dataForm"
      class="zdysh"
      style="margin-top:80px;"
    >
      <el-row style="width：100%;margin-bottom:20px">
        <el-col :span="8">
          <p class="labe">员工姓名</p>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="staffName" style="width:100%" class="zdyitem">
            <el-input v-model="ruleForm.staffName" style="width:100%" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="width：100%;margin-bottom:20px">
        <el-col :span="8">
          <p class="labe">部门</p>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="department" style="width:100%" class="zdyitem">
            <el-select v-model="ruleForm.department" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="width：100%;margin-bottom:20px">
        <el-col :span="8">
          <p class="labe">是否家属</p>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="FamilyPeople" style="width:100%" class="zdyitem">
            <el-radio v-model="ruleForm.FamilyPeople" style="float:left" label="1" border>是</el-radio>
            <el-radio v-model="ruleForm.FamilyPeople" label="0" border>不是</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="width：100%;margin-bottom:20px" v-if="ruleForm.FamilyPeople == 1">
        <el-col :span="8">
          <p class="labe">家属姓名</p>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="Familyname" style="width:100%" class="zdyitem">
            <el-input v-model="ruleForm.Familyname" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="width：100%;margin-bottom:20px">
        <el-col :span="8">
          <p class="labe">电话</p>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="telePhone" style="width:100%" class="zdyitem">
            <el-input v-model="ruleForm.telePhone" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="width：100%;margin-bottom:20px">
        <el-col :span="8">
          <p class="labe">是否在现场</p>
        </el-col>
        <el-col :span="16">
          <el-form-item prop="xianchang" style="width:100%" class="zdyitem">
            <el-radio v-model="ruleForm.isScene" style="float:left" label="1" border>在</el-radio>
            <el-radio v-model="ruleForm.isScene" label="0" border>不在</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="width：100%;margin-bottom:20px">
        <el-col :span="24">
          <el-button style="width:80%" type="warning" @click="uploadImg" round>提交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
//使用图片裁切组件
var imgUrll = require("../assets/img/systemImg/logo.png");
//公用方法
import utils from "@/utils/utils.js";
//接口
import { userApi } from "@/api/apiList";
export default {
  data() {
    //验证家属
    var FamilyPeopleRe = (rule, value, callback) => {
      //   console.log(value);
      // console.log(value);
      if (this.ruleForm.FamilyPeople == "1" && !value) {
        return callback(new Error("家属不能为空"));
      }
    };
    //验证电话号
    var teltPhoneR = (rule, value, callback) => {
      //   console.log(value);
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test(value)) {
        callback(new Error("请输入正确的电话号"));
        return false;
      } else {
        return true;
      }
    };
    return {
      crap: false,
      previews: {},
      option: {
        img:
          "http:img1.vued.vanthink.cn/vued751d13a9cb5376b89cb6719e86f591f3.png", //裁剪图片的地址

        size: 1, //裁剪后质量
        full: false, // 输出原图比例截图 props名full
        outputType: "jpg", //裁剪后生成图片的格式
        canMove: true, //是否能拖动图片
        original: false, //传图片是否显示原始宽高
        canMoveBox: true, //// 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 100, // 默认生成截图框宽度
        autoCropHeight: 100, // 默认生成截图框高度
        fixedBox: true, //固定选框大小
        centerBox: false //截图框限制在图片里面
      },
      fixedNumber: [1, 1], //限制比例
      fixed: true, //限制比例
      downImg: "#",
      imageUrl: "",
      websock: "",
      ruleForm: {
        staffName: "", //员工姓名
        department: "", //部门
        FamilyPeople: "0", //是否家属  1 是  0 不是
        Familyname: "", //家属姓名
        telePhone: 0, //电话
        isScene: "0" //  是否在现场  1在  0 不在
      },
      dataRule: {
        //姓名不能为空
        staffName: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: "blur"
          }
        ],
        department: [
          {
            required: true,
            message: "部门不能为空",
            trigger: "blur"
          }
        ],
        //是家属的话 姓名不能为空
        Familyname: [
          {
            // validator: FamilyPeopleRe,
            required: true,
            message: "家属姓名不能为空",
            trigger: "blur"
          }
        ],
        telePhone: [
          { required: true, message: "电话不能为空", trigger: "blur" },
          // { type: 'number', message: '电话必须为数字', trigger: 'blur' },
          {
            validator: teltPhoneR,
            // required: true,
            // message: "姓名不能为空",
            trigger: "blur"
          }
        ]
      },
      //部门数据
      options: [
        {
          value: "总裁办",
          label: "总裁办"
        },
        {
          value: "通信事业部",
          label: "通信事业部"
        },
        {
          value: "软件事业部",
          label: "软件事业部"
        },
        {
          value: "智能校园事业部",
          label: "智能校园事业部"
        },
        {
          value: "宇信教育",
          label: "宇信教育"
        },
        {
          value: "财务中心",
          label: "财务中心"
        },
        {
          value: "审计中心",
          label: "审计中心"
        },
        {
          value: "行政采购部",
          label: "行政采购部"
        },
        {
          value: "人力资源部",
          label: "人力资源部"
        },
        {
          value: "产品部",
          label: "产品部"
        },
        {
          value: "企业文化部",
          label: "企业文化部"
        }
      ],
      value: "", //部门存在这里,
      zz: 0
    };
  },
  created() {
    let _this = this;
    var browser = {
      versions: (function() {
        var u = navigator.userAgent,
          app = navigator.appVersion;
        return {
          //移动终端浏览器版本信息
          trident: u.indexOf("Trident") > -1, //IE内核
          presto: u.indexOf("Presto") > -1, //opera内核
          webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
          gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
          iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1, //是否iPad
          webApp: u.indexOf("Safari") == -1 //是否web应该程序，没有头部与底部
        };
      })(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    //验证是否是微信打开
    if (browser.versions.mobile) {
      //判断是否是移动设备打开。browser代码在下面
      var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
      //在微信中打开
      if (ua.match(/MicroMessenger/i) != "micromessenger") {
        _this.zz = 1;
      }
    } else {
      _this.zz = 1;
    }

    //验证用户
    let userH5Id = window.localStorage.getItem("id");
    if (userH5Id) {
      this.$router.push("/barrageapp");
    }
  },
  mounted() {
    // this.initWebSocket();
  },
  methods: {
    // initWebSocket() {
    //   console.log("启动中");
    //   let wsurl = "ws://10.0.111.21:3000/websocket";
    //   this.websock = new WebSocket(wsurl);
    //   this.websock.onopen = this.websocketonopen; //连接成功
    //   this.websock.onmessage = this.websocketonmessage; //广播成功
    //   this.websock.onerror = this.websocketonerror; //连接断开，失败
    //   this.websock.onclose = this.websocketclose; //连接关闭
    // },
    // //初始化weosocket
    // websocketonopen() {
    //   console.log("连接成功");
    // },
    // //连接成功
    // websocketonerror() {
    //   console.log("连接失败");
    // },
    // //连接失败
    // websocketclose() {
    //   console.log("断开连接");
    // },
    // //发消息
    // websocketsend(data) {
    //   this.websock.send(JSON.stringify(data));
    // },
    // //监听消息
    // websocketonmessage(data) {
    //   //   console.log(data);
    //   // if(data.data.type == type){
    //   // }
    //   // if(2 == )
    // },
    //发弹幕
    open() {
      this.$prompt("请输入弹幕内容", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: "邮箱格式不正确"
      })
        .then(({ value }) => {
          //最多输入6个字
          let textAll = value.substring(0, 6);
          //发送弹幕消息
          this.websocketsend({
            type: "barrage",
            text: textAll
          });
          this.$message({
            type: "success",
            message: "弹幕发送成功，内容是: " + textAll
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消发送"
          });
        });
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    realTime(data) {
      this.previews = data;
    },
    uploads(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      // console.log(res.raw);
      this.option.img = URL.createObjectURL(res.raw);
      // this.option.img=this.imageUrl;
    },
    uploadImg() {
      // console.log(this.staffName);
      if (!this.ruleForm.staffName) {
        this.$message.error("员工姓名不能为空");
        return;
      }
      if (!this.ruleForm.department) {
        this.$message.error("部门不能为空");
        return;
      }
      if (this.ruleForm.FamilyPeople == 1 && !this.ruleForm.Familyname) {
        this.$message.error("家属姓名不能为空");
        return;
      }
      if (!this.ruleForm.telePhone) {
        this.$message.error("电话不能为空");
        return;
      }
      this.$refs.cropper.getCropBlob(data => {
        const staffName = this.ruleForm.staffName; //员工姓名
        const department = this.ruleForm.department; //部门
        const FamilyPeople = this.ruleForm.FamilyPeople; //是否家属  1 是  0 不是
        const Familyname = this.ruleForm.Familyname; //家属姓名
        const telePhone = this.ruleForm.telePhone; //电话
        const isScene = this.ruleForm.isScene; //  是否在现场  1在  0 不在

        const Iuuid = utils.uuid(); //唯一标识 作为用户id  和图片名称
        const fm = new FormData(); //设置上传图片

        fm.append("staffName", staffName);
        fm.append("department", department);
        fm.append("FamilyPeople", FamilyPeople);
        fm.append("Familyname", Familyname);
        fm.append("telePhone", telePhone);
        fm.append("isScene", isScene);
        fm.append("id", Iuuid);
        fm.append("file", data); //加入图片信息
        console.log(fm.get("file"));

        userApi.axiosuseradd(fm).then(res => {
          // console.log(res)
          if (res.result == 200) {
            let id = res.id;
            window.localStorage.setItem("id", id);
            this.$message.success("信息提交成功");
            this.$router.push("/barrageapp");
          } else {
            this.$message.error("信息提交失败");
          }
        });

        //  headers: {
        //             "Content-Type": "multipart/form-data"
        //           }

        //     //上传图片  使用XMLHttpRequest上传
        //     // var xhr = new XMLHttpRequest();
        //     // //请求成功
        //     // xhr.addEventListener("load", function(resUpload) {}, false);
        //     // //请求失败
        //     // xhr.addEventListener("error", function() {}, false);
        //     // //上传终止
        //     // xhr.addEventListener("abort", function() {}, false);
        //     // //上传进度
        //     // xhr.upload.addEventListener("progress", function() {}, false);
        //     // //请求地址
        //     // xhr.open("POST", "http://10.0.111.21:3000/useradd");
        //     // //发送
        //     // xhr.send(fm);
      });
    }
  }
};
</script>

<style lang="scss" >
.useradd {
  width: 100%;
  height: 100%;
}
.cropper-content {
  // display: flex;
  // display: -webkit-flex;
  // justify-content: flex-end;
  // -webkit-justify-content: flex-end;
  width: 60%;
  height: 240px;
  margin: 10px auto;
  position: relative;
  .cropper {
    width: 100%;
    height: 240px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 99;
  }
  .show-preview {
    position: absolute;
    left: 50%;
    top: 50px;
    margin-left: -100px;
    // flex: 1;
    // -webkit-flex: 1;
    width: 100%;
    height: 300px;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
    .preview {
      overflow: hidden;
      border: 1px solid #cccccc;
      background: #cccccc;
      margin-left: 40px;
    }
  }
}
.footer-btn {
  // margin-top: 30px;
  // display: flex;
  // display: -webkit-flex;
  // justify-content: flex-end;
  // -webkit-justify-content: flex-end;
  position: absolute;
  top: 0;
  width: 100%;
  height: 300px;
  background: #ddd;
  .scope-btn {
    margin-top: 28%;
    width: 100%;
    height: 45px;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    padding: 6px 15px;
    // background: #444;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
  }
  .zdyrq {
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -48px;
  }
  .upload-btn {
    flex: 1;
    -webkit-flex: 1;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    -webkit-justify-content: center;
  }
  .btn {
    outline: none;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 10px 15px;
    font-size: 12px;
    border-radius: 3px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
  }
}
.avatar-uploader {
  // border: 1px dashed red;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  // width: 140px;
  // height: 50px;
  display: block;
  flex: 0 0 auto;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.zdy-tj {
  width: 200px;
  height: 40px;
}
.el-form-item {
  margin: 0;
}
.zdyitem .el-form-item__content,
.zdyitem .el-select {
  width: 100% !important;
}
.labe {
  line-height: 40px;
  text-align: right;
  padding-right: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
.zdysh {
  padding: 0 15px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
}
</style>
