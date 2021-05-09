import '@/tests/setup.js';

import Vuetify from 'vuetify';
// components
import StFieldCompare from '@/components/Elements/StField/StFieldCompare.vue';
// Utilities
import { mount, createLocalVue } from '@vue/test-utils';

// describe('Test StFieldCompare', () => {
//   let vuetify

//   beforeEach(() => {
//     vuetify = new Vuetify()
//   })
//   const factory = (props) => {
//     return mount(StFieldCompare, {
//       vuetify,
//       propsData: {
//         ...props
//       }
//     });
//   }
//   const inputProps = {
//     isLabel: true,
//     inputProperties: {
//       label: 'Условие',
//       type: 'string',
//     }
//   }
//   it('Mount', () => {
//     const wrapper = factory();
//     expect(wrapper.classes('el-field')).toBe(true);
//   });

//   it('Input properties', () => {
//     const wrapper = factory(inputProps);
//     expect(wrapper.html()).toContain('el-field__item');
//     expect(wrapper.html()).toContain('Условие');
//   });

//   it('Event click open menu', async () => {
//     const wrapper = factory(inputProps);
//     await wrapper.find('.v-select__slot').trigger('click', { button: 0 });
//     expect(wrapper.html()).toContain('aria-expanded="true"');
//   })
// })