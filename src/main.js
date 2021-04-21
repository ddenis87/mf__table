import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import Vue from 'vue';
import VueVirtualScroller from 'vue-virtual-scroller';
import VirtualList from 'vue-virtual-scroll-list';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueMask from './plugins/vmask';

Vue.use(VueVirtualScroller);
// Vue.use(VirtualList);
Vue.component('virtual-list', VirtualList);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  VueMask,
  VueVirtualScroller,
  // VirtualList,
  render: (h) => h(App),
}).$mount('#app');
