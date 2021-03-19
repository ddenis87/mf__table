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

const factory = (option = {}) => {
  return mount(AppBar, {
    localVue,
    vuetify,
    store,
    ...option
  })
}

describe('AppBar', () => {

  it('Mount component', () => {
    const wrapper = factory();
    expect(wrapper.html()).toContain('<span class="app-bar__title">Демострационное приложение универсальной таблицы</span>');
  });
  it('Child component Profile - getter', () => {
    const wrapper = factory();
    expect(wrapper.find('.profile-user-bar__user-name').html()).toContain('Denis');
  })
})