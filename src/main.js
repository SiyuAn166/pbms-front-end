import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import store from './store/index'
import API from './interface/index'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题


// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';

import './components/common/directives';
import "babel-polyfill";
import './permControl'  //权限校验

//自定义指令
import './directive/hasPermission'

import ElAMap from 'vue-amap'
Vue.use(ElAMap) //高德地图
ElAMap.initAMapApiLoader({
    key: '03c1e11c309eb898b8a50d0a99874466',
    plugin: ['AMap.Geocoder','AMap.Geolocation','AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','MarkerClusterer'],
    uiVersion: '1.0' ,// ui库版本，不配置不加载,
    v: '1.4.4'
})


Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
Vue.prototype.$Api = API; //挂载后台api接口配置


new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
})
