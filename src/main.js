import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import Vue from 'vue';
import VueVirtualScroller from 'vue-virtual-scroller';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueMask from './plugins/vmask';

Vue.use(VueVirtualScroller);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  VueMask,
  VueVirtualScroller,
  render: (h) => h(App),
}).$mount('#app');
