import '@/tests/setup.js';

import Vuetify from 'vuetify';
// components
import AppBar from '@/components/App/AppBar.vue';
// Utilities
import { mount, createLocalVue } from '@vue/test-utils';
// store
import Store from '@/store/index.js';
const localVue = createLocalVue();

const store = Store;

describe('AppBar', () => {
  
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('Mount component', () => {
    const wrapper = mount(AppBar, {
      localVue,
      vuetify,
      store,
    });
    console.log(wrapper.html());
    expect(wrapper.html()).toContain('<span class="app-bar__title">Демострационное приложение универсальной таблицы</span>');

  })
})