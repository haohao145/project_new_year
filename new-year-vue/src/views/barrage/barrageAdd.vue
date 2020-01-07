<template>
  <div class="control">
    <div class="zz" v-if="zz == 1">
      <p>请使用微信扫码参与抽奖</p>
    </div>
    <el-row :gutter="40">
      <el-col :span="24"></el-col>
      <el-input v-model="text" placeholder="请输入内容"></el-input>
      <el-button type="warning" @click="barrageAdd()" round style="width:100%;margin-top:40px">发弹幕</el-button>
    </el-row>
  </div>
</template>

<script>
import { userApi } from "@/api/apiList";
//获取 ws 的请求地址
import serverConfig from "../../../public/serverConfig.json";
export default {
  data() {
    return {
      websock: "",
      text: "",
      userData: {},
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

    let userH5Id = window.localStorage.getItem("id");
    let shuju = {
      id: userH5Id
    };
    userApi.axiosuserfind(shuju).then(res => {
      // console.log(res)
      if (res.code == 200) {
        _this.userData = res.data;
        // this.$message.success("信息提交成功");
      } else {
        // this.$message.error("信息提交失败");
      }
    });
  },
  mounted() {
    this.initWebSocket();
  },
  methods: {
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
    //发消息
    websocketsend(data) {
      this.websock.send(JSON.stringify(data));
    },
    //监听消息
    websocketonmessage(data) {
      // console.log(data.data);
      if (data.data == "200") {
        this.$message.success("弹幕发送成功");
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
    }
  }
};
</script>

<style lang="scss" scoped>
.control {
  height: 100%;
  @include linearTopBottom(#5f4594, #642536);
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  padding: 0 20%;
  @include box-sizing();
}

.control a {
  display: block;
  width: 100%;
  height: 60px;
  @include linearTopBottom(#c43706, #db6363);
  @include border-radius(30px);
  cursor: pointer;
  text-decoration: none;
  line-height: 60px;
  font-weight: 600;
}

.control a:hover {
  opacity: 0.9;
}

.control a:active {
  opacity: 0.7;
}
</style>
