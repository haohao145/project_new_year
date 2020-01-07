import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
        // children: [
        // ]
    },
    {
        path: '/barrageadd',
        name: 'barrageAdd',
        component: () => import( /* webpackChunkName: "about" */ '../views/barrage/barrageAdd.vue')
    },
    {
        path: '/useradd',
        name: 'userAdd',
        component: () => import( /* webpackChunkName: "about" */ '../views/userAdd.vue')
    },
    {
        path: '/prizecontrol',
        name: 'prizeControl',
        component: () => import( /* webpackChunkName: "about" */ '../views/prizeControl.vue')
    },
    {
        path: '/prize',
        name: 'prize',
        component: () => import( /* webpackChunkName: "about" */ '../views/prize/prize.vue')
    },
    {
        path: '/prizelist',
        name: 'prizeList',
        component: () => import( /* webpackChunkName: "about" */ '../views/prize/prizeList.vue')
    },
    {
        path: '/barragepc',
        name: 'barragePc',
        component: () => import( /* webpackChunkName: "about" */ '../views/barrage/barragePc.vue')
    },
    {
        path: '/barragepcr',
        name: 'barragePcR',
        component: () => import( /* webpackChunkName: "about" */ '../views/barrage/barragePcR.vue')
    },
    {
        path: '/barrageapp',
        name: 'barrageApp',
        component: () => import( /* webpackChunkName: "about" */ '../views/barrage/barrageApp.vue')
    },
    {
        path: '/barrageadd',
        name: 'barrageAdd',
        component: () => import( /* webpackChunkName: "about" */ '../views/barrage/barrageAdd.vue')
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router
