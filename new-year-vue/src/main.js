import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//使用element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import '@/assets/sass/index.scss';

//使用vuex  状态管理
import Vuex from 'vuex'
Vue.use(Vuex)

//使用 弹幕插件
import {
    vueBaberrage,
    MESSAGE_TYPE
} from 'vue-baberrage'
Vue.use(vueBaberrage)


//使用axios 请求数据
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

//使用裁图软件
import VueCropper from 'vue-cropper'
Vue.use(VueCropper);

// 使用datav
import dataV from '@jiaminghi/data-view'
Vue.use(dataV)


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
