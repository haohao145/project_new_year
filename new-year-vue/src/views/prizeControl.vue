<template>
  <div class="control">
    <el-row>
      <el-col :span="24">
        <a @click="prizeGo(3)">抽取三等奖</a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <a @click="prizeGo(2)">抽取二等奖</a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <a @click="prizeGo(1)">抽取一等奖</a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <a @click="prizeGo(1)">加奖(一个)</a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <a @click="toggeBg()">换背景</a>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="20">
      <el-col :span="24">
        <a @click="open">发弹幕</a>
      </el-col>
    </el-row>-->
    <el-row>
      <el-col :span="24">
        <a @click="clear()">清空本地储存</a>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <a @click="clearServe()">清空服务器（慎用，所有数据将消失）</a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//获取 ws 的请求地址
import serverConfig from "../../public/serverConfig.json";
import { userApi } from "@/api/apiList";
export default {
  data() {
    return {
      websock: "",
      onePrize: {
        type: "prizeGo",
        prizeclass: "one",
        number: 1
      },
      twoPrize: {
        type: "prizeGo",
        prizeclass: "two",
        number: 5
      },
      threePrize: {
        type: "prizeGo",
        prizeclass: "Three",
        number: 5
      }
    };
  },
  mounted() {
    this.initWebSocket();
    //窗口关闭时 断开连接
    let _this = this;
    window.onbeforeunload = function() {
      _this.websock.close();
    };
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
      //   console.log(data);
      // if(data.data.type == type){
      // }
      // if(2 == )
    },
    prizeGo(num) {
      if (num == 3) {
        this.websocketsend(this.threePrize);
      } else if (num == 2) {
        this.websocketsend(this.twoPrize);
      } else if (num == 1) {
        this.websocketsend(this.onePrize);
      } else if (num == 1) {
        this.websocketsend(this.onePrize);
      }
    },
    //发弹幕
    // open() {
    //   this.$prompt("请输入弹幕内容", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消"
    //     // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    //     // inputErrorMessage: "邮箱格式不正确"
    //   })
    //     .then(({ value }) => {
    //       //最多输入6个字
    //       let textAll = value.substring(0, 6);
    //       //发送弹幕消息
    //       this.websocketsend({
    //         type: "barrage",
    //         text: textAll
    //       });
    //       this.$message({
    //         type: "success",
    //         message: "弹幕发送成功，内容是: " + textAll
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "取消发送"
    //       });
    //     });
    // },
    toggeBg() {
      this.websocketsend({
        type: "bg"
      });
    },
    clear() {
      if (confirm("请保证多次录入的设备在弹幕页！")) {
        this.websocketsend({
          type: "clear"
          // text: textAll
        });
        // this.$router.push("/");
        // location.reload(true); //重新加载页面
      }
    },
    clearServeAll() {
      try {
        console.log(1);
        userApi.delete().then(res => {
          if (res.code == 200) {
            // console.log(res);
            this.$message.success("数据删除成功");
          } else {
            this.$message.error("数据删除失败或数据库本无数据");
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    clearServe() {
      if (confirm("确定要清空数据库吗？所有历史数据将被清除！")) {
        this.websocketsend({
          type: "clear"
        });
        console.log(1);
        this.clearServeAll();
        //删除数据库
      }
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
  padding: 0 10%;
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
