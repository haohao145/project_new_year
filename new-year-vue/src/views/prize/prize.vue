<template>
  <div class="aaa bg" :class="{bgh:bg==1}" style="width: 100%;height: 100%;">
    <h1 class="cwl" v-if="prizeOut == 1">已经抽完了a</h1>
    <div id="result" class="result" v-show="prizeInterface == 1">
      <div class="tx" v-for="(item,index) in prizeDatas" :key="index">
        <img :src="serverConfig.imgpath+item.imgpath" />
        <br />
        {{item.staffName}}
      </div>
    </div>
    <div id="main" class="wall" :class="{mask:mask == 1}">
      <!-- <div class="result-btn">
                <a href="./result.html" target="_blank">获奖名单</a>
      </div>-->
      <!-- <div>{{allData}}</div> -->
      <canvas id="myCanvas" :width="width" :height="height"></canvas>
    </div>
    <!-- <p>{{allData}}</p>
    <p>{{userData}}</p>-->
    <div id="myLi">
      <ul>
        <li v-for="(item,index) in userData" class="colorf" :key="index">
          <a href="#" :style="{color:item.color}">
            <img :src="serverConfig.imgpath+item.imgpath" />
            {{item.staffName}}
          </a>
        </li>
      </ul>
    </div>
    <div id="tools" class="tools">
      <!-- <button
        :key="index"
        v-for="(value,index) in btns"
        @click="onClick(value)"
        class="pure-button"
        :class="{ 'button-error': selected == value}"
      >{{value}}</button>-->
      <!-- <button
        class="pure-button"
        @click="toggle"
        :class="{'button-secondary': !running,
               'button-success': running}"
      >{{running?'停!':'开始'}}</button>-->
      <router-link class="gengduo" to="/prizelist">中奖名单</router-link>
      <a class="gengduo" @click="reset">重置</a>
      <!-- <button class="pure-button button-warning" @click="reset">重置</button> -->
    </div>
  </div>
</template>

<script>
//zepto
import $ from "@/views/prize/js/zepto.js";
//引入canvas插件
import "@/views/prize/js/tagcanvas.js";
// 假数据
import member from "@/views/prize/js/member.js";

var logo = require("@/assets/img/systemImg/logo.png");

import { userApi } from "@/api/apiList";

//获取 ws 的请求地址
import serverConfig from "../../../public/serverConfig.json";

export default {
  // name: "prize",
  data() {
    return {
      websock: "",
      // 画布宽高
      width: "1902px",
      height: "1080px",
      choosed: JSON.parse(localStorage.getItem("choosed")) || {}, //拿到本地储存中的所有数据
      allData: this.userData, //所有人员数据
      prizeDataNo: [], //未中奖的名单
      btns: [30, 10, 5, 2, 1],
      selected: 5,
      running: false, //开始或者停止抽奖 也就是球体转动的快慢
      prizeInterface: 0, //遮罩显示隐藏
      prizeNumber: "", //正在抽几等奖
      prizeDatas: "",
      prizeOut: 0, //奖项抽完了  1  表示抽完了
      mask: 0,
      serverConfig: serverConfig,
      bg: 0
    };
  },
  watch: {
    userData: {
      handler(newValue, oldValue) {
        // console.log("更新标签后重绘失败 ");
        // / 更新标签
        TagCanvas.Update("myCanvas");
        // TagCanvas.Delete("myCanvas");
        //重新加载标签
        TagCanvas.Reload("myCanvas");
      },
      deep: true
    }
  },
  computed: {
    userData: {
      //获取
      get: function() {
        return this.$store.state.user.count;
      },
      //修改
      set: function(newValue) {
        this.$store.state.user.count = newValue;
      }
      //获取  vuex  中的
      // return this.$store.state.user.count;
    },
    prizeData: {
      //获取
      get: function() {
        return this.$store.state.user.prizeData;
      },
      //修改
      set: function(newValue) {
        this.$store.state.user.prizeData = newValue;
      }
      //获取  vuex  中的
      // return this.$store.state.user.count;
    },
    noPrizeData: {
      //获取
      get: function() {
        return this.$store.state.user.count;
      },
      //修改
      set: function(newValue) {
        this.$store.state.user.count = newValue;
      }
      //获取  vuex  中的
      // return this.$store.state.user.count;
    }
  },
  created() {},
  mounted() {
    // var F5_KEY_CODE = 116;
    // window.addEventListener("keydown", function(e) {
    //   if (e.keyCode === F5_KEY_CODE) {
    //     this.$router.push({ path: "/" });
    //   }
    // });

    // 初始化WebSocket
    this.initWebSocket();
    // console.log(TagCanvas)
    let _this = this;

    //设置宽高
    this.width = document.body.offsetWidth;
    this.height = document.body.offsetHeight;

    //整理数据
    this.createHTML();

    //设置插件属性
    TagCanvas.Start("myCanvas", "myLi", {
      shape: "sphere",
      // offsetY: -60,
      //   lock: "x",
      textColour: null,
      initial: _this.speed(),
      dragControl: 1,
      imageMode: true, //图片和文字都显示
      textHeight: 10, //文字高度
      imagePosition: "top", //图片位置
      imagePadding: "8", //图片距离文字
      outlineThickness: 4, //边框粗细
      outlineOffset: 4, //边框距离
      // bgOutlineThickness:5,  //标签背景轮廓的厚度  加上这个才能显示边框
      // bgRadius:5,            //标签的圆角
      // bgColour:"#f5f5f5" ,   //标签的背景色
      // centreFunc:RSquare ,        //在云中心绘图的功能。函数按以下参数的顺序传递：canvas 2D上下文；画布宽度；画布高度；中心X; centerY
      centreImage: logo,
      // centreImage:          //在云的中心绘制的图像。使用内置的
      imageRadius: 5 //图像的圆角
      // zoom:1
    });
    setTimeout(function() {
      document.getElementById("myLi").style.display = "none";
    }, 1000);
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
      //监听 服务器的通知
      let restu = JSON.parse(data.data);
      //换背景
      if (restu.type == "bg") {
        this.bg = this.bg == 0 ? 1 : 0;
      }

      // console.log("data:", restu.type);
      if (restu.type == "prizeGo") {
        //设置抽奖个数
        this.selected = restu.number;
        //设置几等奖
        this.prizeNumber = restu.prizeclass;
        this.toggle();
      }
    },

    // 请求所有用户的数据
    axiosUserData() {},

    // 创建dome
    createHTML() {
      //  vuex  请求 所有用户数据
      this.$store.dispatch("checkUser");
      //打印请求到的数据
      // console.log(this.userData);
      let _this = this;
      //非空判断
      if (this.userData) {
        this.userData.forEach(function(item, index) {
          // 加上 一个 index 属性
          item.index = index;

          // key  抽取出员工姓名 和 id  组成  后面的 这种格式 姓名 - id
          let key = _this.getKey(item);

          //看看中奖结果中有没有当前循环的这个人   黄色 或者  白色
          item.color = _this.prizeData[key] ? "yellow" : "white";
        });
      }

      // this.prizeDataNo = this.allData;
      // await this.addCanvas();
      // console.log(this.allData)
      // console.log(this.prizeDataNo)

      // 更新标签
      // console.log(this.userData);
      TagCanvas.Update("myCanvas");
    },

    addCanvas() {
      let _this = this;
    },

    // 方法 返回 （0-0.1 且加上 0.01 的随机数，-0-0.1 且加上 0.01 的随机数）
    speed() {
      return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    },

    //返回 姓名 + id
    getKey(item) {
      return item.staffName + "-" + item.id;
    },

    //重置   清空画布 和属性
    reset() {
      if (confirm("确定要重置么？所有之前的抽奖历史将被清除！")) {
        localStorage.clear(); //删除本地储存中的数据
        this.$router.push("/");
        location.reload(true); //重新加载页面
      }
    },

    //开始或者停止抽奖
    toggle() {
      let _this = this;

      if (this.running) {
        // 恢复球体的 转动速度和方向
        TagCanvas.SetSpeed("myCanvas", _this.speed());

        //启动抽奖方法  selected 抽出的奖的数量
        var rets = _this.lottery(this.selected);
        console.log(rets);

        //奖项已抽完时
        if (rets.length === 0) {
          this.prizeOut = 1;
          this.mask = 0;
          // $('#result').css('display', 'block').html('<span>已抽完</span>');
          return;
        }
        //显示中奖的内容
        _this.prizeInterface = 1;
        this.mask = 1;
        _this.prizeDatas = rets;
        // $('#result').css('display', 'block').html('<span>' + ret.join('</span><span>') + '</span>');

        //重新加载标签
        TagCanvas.Reload("myCanvas");

        //背景逐渐模糊
        setTimeout(function() {
          localStorage.setItem(new Date().toString(), JSON.stringify(rets));
          _this.mask = 1;
          // $('#main').addClass('mask');
        }, 100);
      } else {
        //不显示遮罩
        this.prizeInterface = 0;
        // $('#result').css('display', 'none');
        // $('#main').removeClass('mask');
        //开始抽奖  快速转动
        TagCanvas.SetSpeed("myCanvas", [7, 1]);
      }
      //设置抽奖状态  true  正在抽奖
      this.running = !this.running;
    },

    //关闭中奖界面
    onClick(num) {
      this.prizeInterface = 0;
      this.mask = 0;
      // $('#result').css('display', 'none');
      // $('#main').removeClass('mask');
      // this.selected = num;
    },

    //抽奖方法
    lottery(count) {
      let _this = this;
      //拿到所有的人名
      var list = document.getElementById("myLi").getElementsByTagName("a");
      // 设置中奖后人的名字颜色
      var color = "yellow";

      //开始抽奖的 数据筛选
      var ret = this.userData
        //添加上去 index 属性后  返回 没有中奖的名单  也就是本地储存中没有的
        .filter(function(m, index) {
          m.index = index;
          // return !_this.prizeData[_this.getKey(m)]; //也就是不等于1的  就是没有
          return !_this.choosed[_this.getKey(m)];
        })
        // 给每一个没有中奖的名单上加上一个随机数 score
        .map(function(m) {
          return Object.assign(
            {
              score: Math.random()
            },
            m
          );
        })
        //给没有中奖的排序  根据上面加进去的随机数排序  从小到大
        .sort(function(a, b) {
          return a.score - b.score;
        })
        // 选取中奖名单  从几开始  选几个
        .slice(0, count)
        //循环中奖的人  然后存进本地  创建中奖dome
        .map(function(m) {
          // _this.prizeData[_this.getKey(m)] = 1;
          _this.choosed[_this.getKey(m)] = 1;
          list[m.index].style.color = color;
          return m;
          // return '<div class="tx"><img src="img/touxiang/renwu.jpg"></div>' + m.name + '<br/>' + m.phone;
        });

      localStorage.setItem("choosed", JSON.stringify(_this.choosed));
      // console.log(_this.prizeData);
      // _this.prizeData = ret
      // let
      // console.log("ret" + ret);
      ret.forEach((item, index) => {
        item.prizeclass = this.prizeNumber;
      });
      // 提交中奖的数据;
      let upPriezData = {
        data: ret
      };
      userApi.upPriezData(upPriezData).then(res => {
        // console.log(res);
        if (res.result == 200) {
          // let data = res.data;
          this.$message.success("中奖信息已经储存到服务器1");
        } else {
          this.$message.error("中奖信息储存失败");
        }
      });
      return ret;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/views/prize/css/reset";
@import "~@/views/prize/css/wall";

body,
html {
  width: 100%;
  height: 100%;
}

a {
  color: #fff;
}

.result {
  position: absolute;
  height: 70%;
  width: 80%;
  left: 10%;
  top: 15%;
  text-align: center;
  padding: 10px;
  @include box-sizing();
  z-index: 999;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: center;
  background: rgba(18, 27, 138, 0.5);
}

.result span {
  display: inline-block;
  font-size: 16px;
  width: 160px;
  /* background: #fff; */
  line-height: 30px;
  color: #fff;
  margin: 10px;
  border-radius: 10px;
  /* box-shadow: 0 5px 10px rgba(0, 0, 0, 0.8); */
  padding: 10px 0;
}

button,
input,
optgroup,
select,
textarea {
  color: inherit;
  font: inherit;
  margin: 0;
  border: none;
}

button {
  overflow: visible;
}

button,
select {
  text-transform: none;
}

button,
html input[type="button"],
input[type="reset"],
input[type="submit"] {
  -webkit-appearance: button;
  cursor: pointer;
}

.pure-button {
  display: inline-block;
  zoom: 1;
  line-height: normal;
  white-space: nowrap;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.pure-button {
  font-family: inherit;
  font-size: 100%;
  padding: 0.5em 1em;
  color: #444;
  color: rgba(0, 0, 0, 0.8);
  border: 0 rgba(0, 0, 0, 0);
  background-color: #e6e6e6;
  text-decoration: none;
  border-radius: 2px;
}

.pure-button:focus {
  outline: 0;
}

.pure-button-hover,
.pure-button:hover,
.pure-button:focus {
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#1a000000', GradientType=0);
  background-image: -webkit-gradient(
    linear,
    0 0,
    0 100%,
    from(transparent),
    color-stop(40%, rgba(0, 0, 0, 0.05)),
    to(rgba(0, 0, 0, 0.1))
  );
  background-image: -webkit-linear-gradient(
    transparent,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.1)
  );
  background-image: -moz-linear-gradient(
    top,
    rgba(0, 0, 0, 0.05) 0,
    rgba(0, 0, 0, 0.1)
  );
  background-image: -o-linear-gradient(
    transparent,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.1)
  );
  background-image: linear-gradient(
    transparent,
    rgba(0, 0, 0, 0.05) 40%,
    rgba(0, 0, 0, 0.1)
  );
}

.button-success,
.button-error,
.button-warning,
.button-secondary {
  color: white;
  border-radius: 4px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.button-success {
  background: rgb(28, 184, 65);
}

.button-error {
  background: rgb(202, 60, 60);
}

.button-warning {
  background: rgb(223, 117, 20);
}

.button-secondary {
  background: rgb(66, 184, 221);
}

.tools {
  position: absolute;
  bottom: 20px;
  right: 20px;
  text-align: center;
}

.tools .pure-button {
  display: inline-block;
  margin: 5px;
  padding: 10px 0;
  text-align: center;
  width: 50px;
}

.mask {
  -webkit-filter: blur(5px);
  filter: blur(5px);
}

#main {
  -webkit-transition: all 1s;
  transition: all 1s;
}

.result-btn {
  margin-top: 20px;
  text-align: right;
  margin-right: 30px;
}

.tx {
  width: 160px;
  height: 160px;
  padding: 10px;
  box-sizing: border-box;
  // background: ;
  border-radius: 50%;
  color: #fff;
  font-weight: 600;
  // overflow: hidden;
  background: rgba(13, 92, 245, 0.5);
}

.tx img {
  width: 100%;
  height: 100%;
}

img {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  /* border-radius: 10px;
    	overflow: hidden;
    	border: 4px solid #000; */
}

.colorf {
  color: #fff;
}
.cwl {
  display: block;
  position: absolute;
  width: 100%;
  height: 100px;
  line-height: 100px;
  font-size: 30px;
  color: #fff;
  text-align: center;
}
.gengduo {
  display: inline-block;
  padding: 0 15px;
  background: rgba(13, 92, 245, 0.5);
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #fff;
  border-radius: 15px;
  margin: 0 10px;
}
.bgh {
  background: url("../../assets/img/systemImg/icon-wallh.jpg") no-repeat
    center/100%;
}
/* ul li a{
    	font-size: 12px;
    } */
</style>
