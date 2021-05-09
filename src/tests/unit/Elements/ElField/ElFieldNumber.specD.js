import '@/tests/setup.js';

import Vuetify from 'vuetify';
// components
import ElFieldNumber from '@/components/Elements/ElFields/ElFieldNumber.vue';
// Utilities
import { mount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();
const vuetify = new Vuetify();
const factory = (props) => {
    return mount(ElFieldNumber, {
      localVue,
      vuetify,
      propsData: {
        ...props
      }
    });
  }

// describe('Test ElFieldNumber', () => {
 
//   it('Mount component', () => {
//     const wrapper = factory();
//     expect(wrapper.classes('el-field')).toBe(true);
//     expect(wrapper.find('.v-text-field').classes('el-field__item')).toBe(true);
//     expect(wrapper.find('.v-text-field').classes('v-text-field')).toBe(true);
//   });
//   describe('Input properties', () => {
//     it('Properties display view', () => {
//       const props = { isDense: true };
//       const wrapper = factory(props);
//       expect(wrapper.find('.v-text-field').classes('v-input--dense')).toBe(true);
//     })
  
//     it('Input properties, input value', () => {
//       const props = {
//         inputProperties: {
//           label: 'Код подразделения'
//         },
//         inputValue: '10',
//       };
//       const wrapper = factory(props);
//       expect(wrapper.find('label').text()).toBe('Код подразделения');
//       expect(wrapper.vm.fieldValue).toBe('10');
//     });
//     it('Event input', async () => {
//       const props = {
//         inputValue: '',
//       };
//       const wrapper = factory(props);
//       await wrapper.find('input').trigger('keydown', {key: 'q'});
//       wrapper.vm.$nextTick(() => {
//         expect(wrapper.vm.fieldValue).toBe('q');
//         console.log(wrapper.vm.fieldValue);
//       });
      
//     });
//   })
// });