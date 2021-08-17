import Vue from 'vue';
import VirtualList from 'vue-virtual-scroll-list';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueMask from './plugins/vmask';

Vue.component('virtual-list', VirtualList);

Vue.config.productionTip = false;
Vue.config.performance = true;

new Vue({
  router,
  store,
  vuetify,
  VueMask,
  render: (h) => h(App),
}).$mount('#app');
