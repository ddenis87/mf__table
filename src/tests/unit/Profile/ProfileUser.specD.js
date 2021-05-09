import '@/tests/setup.js';

import Vuetify from 'vuetify';
// components
import AppBar from '@/components/App/AppBar.vue';
// Utilities
import { mount, createLocalVue } from '@vue/test-utils';
// store
import Store from '@/store/index.js';
import Router from '@/router/index.js';

const localVue = createLocalVue();
const vuetify = new Vuetify();
const store = Store;
const router = Router;

store.state.Login.userName = 'Denis';

const factory = (option = {}) => {
  return mount(AppBar, {
    localVue,
    vuetify,
    store,
    router,
    ...option
  })
}

// describe('ProfileUser', () => {
  // it('Mount component', () => {
  //   const wrapper = factory();
  //   expect(wrapper.html()).toContain('profile-user-bar__user-name');
  //   expect(wrapper.html()).toContain('v-btn');
  // });
  // it('Stor, getter', () => {
  //   const wrapper = factory();
  //   expect(wrapper.html()).toContain('Denis');
  // });
  // it('Snapshot html', () => {
  //   const wrapper = factory();
  //   expect(wrapper.html()).toMatchSnapshot();
  // })
  // it('Click logout', async () => {
  //   const wrapper = factory();
  //   const event = jest.fn();
  //   // wrapper.vm.$on('action-btn:clicked', event);
  //   // expect(event).toHaveBeenCalledTimes(0)
  //   // await wrapper.vm.$nextTick();
  //   await wrapper.find('button').trigger('click');
  //   // wrapper.vm.$nextTick();
  //   // expect(event).toHaveBeenCalledTimes(1)
  //   // router.push('/Logout');
    
  //   // console.log(router.currentRoute);
  //   console.log(wrapper.html());
  //   // expect(wrapper.html()).toContain('Войти');
  // });
// })