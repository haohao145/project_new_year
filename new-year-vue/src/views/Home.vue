<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" />
    <div>{{data}}</div>
    <HelloWorld msg="Welcome to Your Vue.js App" />-->
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
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  data() {
    return {
      data: ""
    };
  },
  components: {
    HelloWorld
  },
  created() {
    this.axiosNav();
    //  vuex  请求 所有用户数据
    this.$store.dispatch("checkUser");
    console.log(process.env.NODE_ENV);
  },
  methods: {
    //async await 异步处理 https://blog.csdn.net/zhaoxiang66/article/details/81017373  请求路由表
    async axiosNav() {
      //备份this
      let _this = this;
      //   console.log(process.env.NODE_ENV);
      // console.log(this.$api);
      // 这里用try catch包裹，请求失败的时候就执行catch里的  try执行错误的时候 就走下面的
      try {
        //定义传参内容
        // let params  = {
        // }
        //await 是和 async  结合
        // let res = await this.$api.Interface.axiosNav();
        // _this.data = res;
        // console.log("​getMatches -> res", res);
      } catch (err) {
        //TODO handle the exception
        console.log(err);
      }
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
</style>