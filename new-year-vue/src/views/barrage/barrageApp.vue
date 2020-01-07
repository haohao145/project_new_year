<template>
  <div class="aaa barrage-bgapp barrages-drop dmbgapp" style="width: 100%;height: 100%;">
    <div class="zz" v-if="zz == 1">
      <p>请使用微信扫码参与抽奖</p>
    </div>
    <div class="dmkkapp">
      <div class="dmkknapp">
        <vue-baberrage
          :isShow="barrageIsShow"
          :barrageList="barrageList"
          :loop="barrageLoop"
          :maxWordCount="maxWordCount"
          :throttleGap="throttleGap"
          :boxHeight="boxHeight"
          :messageHeight="messageHeight"
        ></vue-baberrage>
      </div>
    </div>
    <p class="dmapp-text">向心聚力&nbsp;&nbsp;&nbsp;&nbsp;逐梦前行</p>
    <div class="fsdmapp">
      <el-row :gutter="0">
        <el-col :span="20">
          <el-input v-model="text" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <a @click="barrageAdd()" class="el-icon-position zdyfj"></a>
          <!-- <el-button type="warning" @click="barrageAdd()" round style="width:100%;padding:0;">发弹幕</el-button> -->
        </el-col>
      </el-row>
    </div>
    <!-- <img src="../../assets/img/peopleImg/renwu.jpg" alt /> -->
    <!-- {{userData}}
    <p>{{idd}}</p>
    <p>{{res}}</p>-->
  </div>
</template>

<script>
//引入弹幕插件
import { MESSAGE_TYPE } from "vue-baberrage";
let renwu = require("../../assets/img/peopleImg/renwu.jpg");
import { userApi } from "@/api/apiList";
//获取 ws 的请求地址
import serverConfig from "../../../public/serverConfig.json";
export default {
  // name: "prize",
  data() {
    return {
      msg: "开始弹幕吧",
      barrageIsShow: true, //是否显示
      currentId: 0,
      messageHeight: 10, //弹幕高度
      boxHeight: 512, //显示弹幕区域的高度
      barrageLoop: false, //是否循环
      maxWordCount: 1, //弹幕最大字数长度，超过则忽略
      throttleGap: 100, //弹幕之间的节流时间
      barrageList: [], //数据
      text: "",
      userData: {},
      zz: 0,
      color: [
        "blue",
        "green",
        "red",
        "yellow",
        "zdy-huang",
        "blue",
        "green",
        "red",
        "yellow",
        "zdy-huang"
      ]
      // idd: "",
      // res: null
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
    // 验证是否是微信打开;
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

    let userH5Id = window.localStorage.getItem("id");
    let shuju = {
      id: userH5Id
    };
    this.idd = shuju.id;
    console.log(shuju);
    if (!userH5Id) {
      this.$message.error("请先录入个人信息");
      this.$router.push("/useradd");
    }
    userApi.axiosuserfind(shuju).then(res => {
      // console.log(res)
      if (res.code == 200) {
        // console.log(userH5Id);
        // console.log(res.data);
        _this.res = res;
        _this.userData = res.data;
        console.log(res.data);
        // this.$message.success("信息提交成功");
      } else {
        // this.$message.error("信息提交失败");
      }
    });
  },
  mounted() {
    // 初始化WebSocket
    this.initWebSocket();

    this.addToList();
  },
  methods: {
    //初始化  WebSocket
    initWebSocket() {
      console.log("启动中");
      let wsurl = serverConfig.ws;
      this.websock = new WebSocket(wsurl);
      this.websock.onopen = this.websocketonopen; //连接成功
      this.websock.onmessage = this.websocketonmessage; //广播成功
      this.websock.onerror = this.websocketonerror; //连接断开，失败
      this.websock.onclose = this.websocketclose; //连接关闭
    },
    //初始化weosocket
    websocketonopen() {
      console.log("连接成功");
    },
    //连接成功
    websocketonerror() {
      console.log("连接失败");
    },
    //连接失败
    websocketclose() {
      console.log("断开连接");
    },
    //发送数据
    websocketsend(data) {
      this.websock.send(JSON.stringify(data));
    },
    //监听消息
    websocketonmessage(data) {
      let _this = this;
      // console.log(data);
      if (data.data == "200") {
        this.$message.success("弹幕发送成功");
        return;
      }
      let restu = JSON.parse(data.data);

      if (restu.type == "barrage") {
        //监听 服务器的通知

        // console.log("data:", restu.type);
        let sjs = Math.floor(Math.random() * 10);
        let sjss = sjs > 7 ? sjs : 7;
        this.barrageList.push({
          // id: "00",
          avatar: serverConfig.imgpath + restu.data[0].imgpath,
          msg: restu.data[0].staffName + "：" + restu.text,
          time: sjss,
          type: MESSAGE_TYPE.NORMAL,
          barrageStyle: _this.color[Math.ceil(Math.random() * 10)]
        });
      }
    },
    //发弹幕
    barrageAdd() {
      let textAll = this.text.substring(0, 10);
      //发送弹幕消息
      this.websocketsend({
        type: "barrage",
        text: textAll,
        data: this.userData
      });
    },
    // 弹幕配置
    addToList() {
      let _this = this;
      let list = [
        {
          id: 1,
          avatar: renwu,
          msg: this.msg,
          time: 6,
          barrageStyle: _this.color[Math.ceil(Math.random() * 10)]
        }

        // {
        //   id: 2,
        //   avatar: renwu,
        //   msg: "测试弹幕的类可行",
        //   time: 110,
        //   barrageStyle: "red"
        // },
        // {
        //   id: 3,
        //   avatar: renwu,
        //   msg: "把你想说的话放在这里吧",
        //   time: 8,
        //   barrageStyle: "red"
        // }
      ];
      console.log(list[0].barrageStyle);
      list.forEach(v => {
        this.barrageList.push({
          id: v.id,
          avatar: v.avatar,
          msg: v.msg,
          time: v.time,
          type: MESSAGE_TYPE.NORMAL,
          barrageStyle: v.barrageStyle
        });
      });
    }
  }
};
</script>

<style lang="less" >
.barrage-bgapp {
  // background: url(../../assets/img/systemImg/dmbg-s.jpg);
  background: #c9151e;
}
.barrages-drop {
  .blue {
    border-radius: 100px;
    background: #358178;
    color: #fff;
  }
  .green {
    border-radius: 100px;
    background: #2e7f0b;
    color: #fff;
  }
  .red {
    border-radius: 100px;
    background: #d10d28;
    color: #fff;
  }
  .yellow {
    border-radius: 100px;
    background: #3262b4;
    color: #fff;
  }
  .zdy-huang {
    border-radius: 100px;
    color: #000;
    background: #fbb86a;
  }
  .baberrage-stage {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    top: 0;
    // margin-top: 130px;
    color: #fff;
  }
}
.dmkkapp {
  width: 100%;
  height: calc(100% - 130px);
  padding: 40px 20px 0;
  box-sizing: border-box;
}
.dmkknapp {
  width: calc(100% - 20px);
  height: 100%;
  background: #f3f1f6;
  border: 6px solid #fadabe;
  border-radius: 30px;
  box-sizing: border-box;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.4) inset;
  padding: 10px 0;
  box-sizing: border-box;
}
.dmapp-text {
  line-height: 50px;
  margin: 0;
  color: #fff;
  text-align: center;
}
.zdyfj {
  color: #d20d29;
  font-size: 24px;
  line-height: 40px;
  width: 100%;
  display: inline-block;
}
.zdyfj:active {
  opacity: 0.7;
}
.fsdmapp {
  width: 100%;
  height: 80px;
  background: #f3f1f6;
  padding: 20px 10px;
  box-sizing: border-box;
}
.dmbg {
  // background: url();
}
</style>
