<template>
  <div class="home">
    <!-- <h1>这里是首页</h1> -->
    <router-link class="homebat" to="/prize">抽奖</router-link>
    <br />
    <router-link class="homebat" to="/barragepc">左侧弹幕</router-link>
    <br />
    <router-link class="homebat" to="/barragepcr">右侧弹幕</router-link>
    <br />
    <router-link class="homebat" to="/barrageapp">手机弹幕+发弹幕</router-link>
    <br />
    <router-link class="homebat" to="/barrageadd">现场发弹幕</router-link>
    <br />
    <router-link class="homebat" to="/useradd">录入信息</router-link>
    <br />
    <router-link class="homebat" to="/prizeControl">控制器</router-link>
    <br />
    <div class="imgload" v-show="imgLoadShow">{{imgLoadNum}}</div>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
//获取 ws 的请求地址
import serverConfig from "../../public/serverConfig.json";
export default {
  name: "home",
  data() {
    return {
      data: "",
      numm: 0, //计数器 表示资源加载完成
      imgLoadNum: "",
      imgLoadShow: false
    };
  },
  components: {
    HelloWorld
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
    }
  },
  created() {
    //  vuex  请求 所有用户数据
    this.$store.dispatch("userFindScene");
    console.log(process.env.NODE_ENV);

    function show() {
      alert("body is loaded");
    }
    window.οnlοad = show;
  },
  mounted() {
  },
  methods: {
    imgLoad(callback) {
      let _this = this;
      //读取资源
      let R = {};
      //开始预加载
      this.userData.forEach((item, index) => {
        //设置键名
        let img_id = item.id.replace(/-/g, "")
        R[img_id] = new Image();

        //加上 src属性
        R[img_id].src = serverConfig.imgpath + item.imgpath;
        R[img_id].onerror = function() {
          console.log("加载失败");
        };
        //判断是否已经有这个缓存了  有了就不往下执行了
        if (R[item.id.replace(/-/g, "")].complete) {
          //这张图片已经缓存到浏览器了
          console.log("缓存到浏览器");
          this.numm++; //进度++
          this.imgLoadShow = true; //显示进度框
          this.imgLoadNum = this.numm + "/" + this.userData.length;
          //完成时候
          if (this.numm == this.userData.length) {
            console.log("跳转");
            callback();
          }
          // 直接返回，不用再处理onload事件
          return;
        }
        
        //判断当前这张照片是否加载完成
        R[ img_id].addEventListener('load', function () { // 这里没有考虑error，实际上要考虑
          console.log(img_id+"缓存到浏览器");
          _this.numm++; //进度++
          _this.imgLoadShow = true; //显示进度框
          _this.imgLoadNum = _this.numm + "/" + _this.userData.length;
          //完成时候
          if (_this.numm == _this.userData.length) {
            console.log("跳转");
            callback();
          }
          // 直接返回，不用再处理onload事件
          return;
        }, false);
        // // 当前这张加载完成;
        // R[img_id].οnlοad = function() {
        //   console.log("进来一次");
        //   _this.numm++;
        //   // 检测到所有都加载完成
        //   if (_this.numm == _this.userData.length) {
        //     callback();
        //   }
        // };
        //设置 src
        R[img_id].src = serverConfig.imgpath + item.imgpath;
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    let _this = this;
    if(_this.userData.length == 0){
      _this.$message.error("数据库中好像一个人都没有,快点扫二维码抢沙发吧！！！");
    }
    if (to.path == "/prize") {
      console.log(1);
      _this.imgLoad(function() {
        next();
      });
    }else{
      next();
    }
  }
};
</script>
<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  background: url("../assets/img/systemImg/icon-wall.jpg");
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
}
.homebat {
  display: inline-block;
  width: 160px;
  height: 160px;
  background: #ddd;
  border-radius: 50%;
  line-height: 160px;
  text-align: center;
  color: #fff;
  background: rgba(7, 71, 253, 0.5);
  text-decoration: none;
}
.homebat:hover {
  text-decoration: none;
}
.imgload {
  width: 300px;
  height: 100px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: rgba(7, 71, 253, 0.5);
  color: #fff;
  line-height: 100px;
  font-size: 30px;
  text-align: center;

}
</style>