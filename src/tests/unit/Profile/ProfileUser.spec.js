import '@/tests/setup.js';

import Vuetify from 'vuetify';
// components
import AppBar from '@/components/App/AppBar.vue';
// Utilities
import { mount, createLocalVue } from '@vue/test-utils';
// store
import Store from '@/store/index.js';

const localVue = createLocalVue();
const vuetify = new Vuetify();
const store = Store;

store.state.Login.userName = 'Not Denis';

const factory = (option = {}) => {
  return mount(AppBar, {
    localVue,
    vuetify,
    store,
    ...option
  })
}

describe('ProfileUser', () => {
  it('Mount component', () => {
    const wrapper = factory();
    expect(wrapper.html()).toContain('profile-user-bar__user-name');
    expect(wrapper.html()).toContain('v-btn');
  });
  // it('Stor, getter', () => {
  //   const wrapper = factory();
  //   expect(wrapper.html()).toContain('Denis');
  // });
  it('Snapshot html', () => {
    const wrapper = factory();
    expect(wrapper.html()).toMatchSnapshot();
  })
  // it('Click logout', async () => {
    // const wrapper = factory();
    // const event = jest.fn();
    // wrapper.vm.$on('action-btn:clicked', event);

    // await wrapper.find('button').trigger('click');
    // wrapper.vm.$nextTick;
    // console.log(wrapper.html());
    // expect(wrapper.html()).toContain('Войти');
  // });
})