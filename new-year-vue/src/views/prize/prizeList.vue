<template>
  <div class="aaa barrage-bg prizelist-bg" style="width: 100%;height: 100%;">
    <div class="cjmb">
      <dv-border-box-12>
        <div class="cjmb-n">
          <p class="cjmb-p">一等奖</p>
          <div class="prizelist">
            <div class="list-item" v-for="(item,index) in one" key="index">
              <img :src="serverConfig.imgpath+item.imgpath" alt />
              <p>{{item.staffName+"-"+item.department}}</p>
            </div>
          </div>
          <p class="cjmb-p">二等奖</p>
          <div class="prizelist">
            <div class="list-item" v-for="(item,index) in two" key="index">
              <img :src="serverConfig.imgpath+item.imgpath" alt />
              <p>{{item.staffName+"-"+item.department}}</p>
            </div>
          </div>
          <p class="cjmb-p">三等奖</p>
          <div class="prizelist">
            <div class="list-item" v-for="(item,index) in three" key="index">
              <img :src="serverConfig.imgpath+item.imgpath" alt />
              <p>{{item.staffName+"-"+item.department}}</p>
            </div>
          </div>
        </div>
      </dv-border-box-12>
    </div>
  </div>
</template>

<script>
import { userApi } from "@/api/apiList";
//获取 ws 的请求地址
import serverConfig from "../../../public/serverConfig.json";

export default {
  // name: "prize",
  data() {
    return {
      one: [],
      two: [],
      three: [],
      serverConfig: serverConfig
    };
  },
  created() {},
  mounted() {
    // 初始化WebSocket
    this.initWebSocket();
    //请求中将数据
    userApi.priezData().then(res => {
      // console.log(res);
      if (res.code == 200) {
        let data = res.data;
        data.forEach((item, index) => {
          if (item.prizeclass == "one") {
            this.one.push(item);
          } else if (item.prizeclass == "two") {
            this.two.push(item);
          } else if (item.prizeclass == "Three") {
            this.three.push(item);
          }
        });
        console.log(data);
        // this.$message.success("");
      } else {
        this.$message.error("中奖信息储存失败");
      }
    });
  },
  methods: {
    //初始化  WebSocket
    initWebSocket() {
      console.log("启动中");
      let wsurl = "ws://10.0.111.18:3000/websocket";
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
      //监听 服务器的通知
      let restu = JSON.parse(data.data);
      console.log("data:", restu.type);
      if (restu.type == "barrage") {
        this.barrageList.push({
          // id: "00",
          avatar: renwu,
          msg: restu.text,
          time: 10,
          type: MESSAGE_TYPE.NORMAL,
          barrageStyle: "zdy-huang"
        });
      }
    }
  }
};
</script>

<style lang="less" >
.barrage-bg {
  //   background: url(../../assets/img/systemImg/dmbg-s.jpg);
}
.prizelist-bg {
  background: url("../../assets/img/systemImg/icon-wall.jpg") no-repeat
    center/100% 100% !important;
}
.cjmb {
  width: 80%;
  height: 80%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(18, 27, 138, 0.5);
  //   padding: 20px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
}
.cjmb-n {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.cjmb-p {
  margin: 0;
  line-height: 40px;
  color: #fff;
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 30px;
  background: rgba(7, 232, 219, 0.1);
  //   width: 80%;
  border-radius: 7px;
}
.prizelist {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  margin-bottom: 30px;
}
.list-item {
  width: 100px;
  height: 130px;
  margin: 0 10px;
}
.list-item img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
.list-item p {
  line-height: 30px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}
</style>
