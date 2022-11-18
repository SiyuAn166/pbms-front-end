import Vue from 'vue';
import Router from 'vue-router';
import Home from '../components/common/Home.vue'


import systemRouter from "./modules/system"
import monitorCenter from "./modules/monitorCenter";
// import deviceCenter from "./modules/deviceCenter";
import projectRouter from "./modules/project";

Vue.use(Router);

export const constantRoutes = [
    {
        path: '/login',
        component: resolve => require(['../components/page/Login.vue'], resolve),
        meta: {title: "系统登录"},
        hidden: true
    },
    {
        path: '/',
        component: Home,
        meta: {},
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                meta: {title: "系统首页", icon: 'el-icon-s-home', root: true}   //root :是否为菜单树的根，即顶级菜单,true 表示显示在菜单最顶级
            }
        ]
    },
    {
        path: '/404',
        component: resolve => require(['../components/page/404.vue'], resolve),
        meta: {title: '404'},
        hidden: true
    },
    {
        path: '/user-settings',
        component: Home,
        redirect: '/user-settings',
        meta: {title: '个人设置'},
        children: [
            {
                path: '',
                component: resolve => require(['../components/common/UserSettings.vue'], resolve),
                meta: {title: '个人设置'},
            }
        ],
        hidden: true
    }
]
export const asyncRoutes = [
    monitorCenter,
    // deviceCenter,
    projectRouter,


    systemRouter,

    {path: '*', redirect: '/404', hidden: true}
]


export default new Router({
    base: '/dist/',  // 路由前缀，伪装为项目根路径
    mode: 'history',  // 部署时加上,
    routes: constantRoutes
})

//测试用
// let rout = constantRoutes.concat(asyncRoutes)
// export default new Router({
//     base: '/dist/',  // 路由前缀，伪装为项目根路径
//     mode: 'history',  // 部署时加上
//     routes: rout
// })



