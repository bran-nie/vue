import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'

//开启debug模式
Vue.config.debug = true;

Vue.use(VueRouter);
Vue.use(VueResource);


//定义组件， 也可以像教程之前教的方法   从别的文件引入
const First = {
	template: '<div><h2>我是第一个子页面</h2></div>'
}
import secondcomponent from './component/secondcomponent.vue'

// 创建一个路由器实例
// 并且配置路由规则
const router = new VueRouter ({
	mode: 'history',
	base: __dirname,
	routes: [{
		path: '/first',
		component: First
	},{
		path: '/second',
		component: secondcomponent
	}]
})


new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
