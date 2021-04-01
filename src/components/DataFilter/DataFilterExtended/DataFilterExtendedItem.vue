<template>
  <div class="item">
    <template v-if="!isTitle">
      <div class="item-checkbox">
        <v-checkbox v-model="isFilterOn" @change="toggleFilter"></v-checkbox>
      </div>
      <div class="item-compare">
        <st-field-compare :input-properties="inputProperties"
                          v-model="valueCompare"
                          @next-element="eventNextElement"></st-field-compare>
      </div>
      <div class="item-data">
        <component :is="componentField"
                   :is-required-off="true"
                   :is-disabled="isDisabledData || !valueCompare"
                   :input-properties="inputProperties"
                   :selected-item="selectedItem"
                   :is-show="isShow"
                   v-model="valueData"
                   @input-value="eventInputData"
                   @next-element="eventNextElement"
                   @clear-value="resetComponent"></component>
      </div>
    </template>
    <template v-else>
      <div class="item-compare">{{ inputTitle[0] }}</div>
      <div class="item-data">{{ inputTitle[1] }}</div>
    </template>
  </div>
</template>

<script>
import ElFieldCheckbox from '@/components/Elements/ElField/ElFieldCheckbox.vue';
import StFieldCompare from '@/components/Elements/StField/StFieldCompare.vue';

export default {
  name: 'DataFilterExtendedItem',
  components: {
    ElFieldCheckbox,
    StFieldCompare,
  },
  props: {
    tableName: { type: String, default: null, },
    guid: { type: String, default: null },
    isTitle: { type: Boolean, default: false },
    inputTitle: { type: Array, default:() => ['', ''] },
    inputProperties: { type: Object, default() { return { type: null, key: null } } },
  },
  data() {
    return {
      isShow: false,
      isDisabledData: true,
      valueCompare: null,
      valueCompareArray: {
        'equally': '=',
        // 'more': '__gte=',
        'moreOrEqually': '__gte=',
        // 'less': '__lte=',
        'lessOrEqually': '__lte=',
        'inList': '__in=',
        'between': ['__gte=', '__lte='],
      },
      valueData: null,
      selectedItem: null,
      isFilterOn: false,
    }
  },
  computed: {
    eventFilterExtendedReset() {
      if (this.$store.getters['DataTable/GET_MARK_EVENTS_FILTER_EXTENDE_RESET']({tableName: this.tableName, guid: this.guid}))
        return true;
      return null;
    },
    eventFilterExtendedOff() {
      if (this.$store.getters['DataTable/GET_MARK_EVENTS_FILTER_EXTENDE_OFF']({tableName: this.tableName, guid: this.guid}))
        return true;
      return null;
    },
    componentField() {
      this.valueData = null;
      let valueDefault = {key: this.inputProperties.key, value: (this.inputProperties.type == 'boolean') ? 
        `${this.computedLineCompare(this.valueCompare)}false` : null};
      // console.log(valueDefault);
      this.$emit('input-filter', valueDefault); //  EMIT ---------------<<<<<<<<<<<<
      switch(this.valueCompare) {
        case 'inList': {
          return () => import('@/components/Elements/ElField/ElFieldDialogListBox/ElFieldDialogListBox.vue');
        }
        case 'between': {
          this.isDisabledData = false;
          switch(this.inputProperties.type) {
            case 'integer': return () => import('@/components/Elements/ElField/ElFieldRange/ElFieldRangeNumber.vue');
            case 'date': return () => import('@/components/Elements/ElField/ElFieldRange/ElFieldRangeDate.vue');
            case 'datetime': return () => import('@/components/Elements/ElField/ElFieldRange/ElFieldRangeDateTime.vue');
          }
          break;
        }
        default: {
          this.isDisabledData = false;
          return this.componentByTypeDefault(this.inputProperties.type);
        }
      }
    },
  },
  watch: {
    eventFilterExtendedReset() {
      if (this.eventFilterExtendedReset) {
        // this.isFilterOn = false;
        this.valueData = null;
        // this.valueCompare = null;
        this.resetComponent();
        // this.$emit('input-filter', {key: this.inputProperties.key, value: null});
      }
    },
    eventFilterExtendedOff() {
      if (this.eventFilterExtendedOff) {
        // this.isFilterOn = false;
        this.resetComponent();
        // this.$emit('input-filter', {key: this.inputProperties.key, value: null});
      }
    },
    valueCompare() {
      if (this.valueCompare == 'inList') {
        // console.log(this.valueCompare);
        this.isShow = true;
        return;
      }
      this.isShow = false;
    },
  },
  methods: {
    toggleFilter(value) {
      console.log(value);
      if (value) this.eventInputData();
      else this.$emit('input-filter', {key: this.inputProperties.key, value: null});
    },
    eventNextElement(option) {
      // console.log(option);
      let thisComponent = option.event.target.closest('.item');
      let eventClick = new Event('click');
      thisComponent.dispatchEvent(eventClick);
      if (option.event.target.closest('.item-compare')) {
        setTimeout(() => {
          if (this.valueCompare != 'inList') {
            thisComponent.querySelector('.item-data input').focus();
          } else {
            setTimeout(() => {thisComponent.querySelector('.item-data input').focus()}, 500);
          }
        }, 100);
        return;

        // setTimeout(() => {
        //   if (thisComponent.querySelector('.item-data input')) {
        //     thisComponent.querySelector('.item-data input').focus();
        //   } else {
        //     console.log(document.activeElement);
        //   }
        // },500);
        // return;
        // if (thisComponent.querySelector('.item-data input'))
        //   console.log(thisComponent.querySelector('.item-data input'));
        //   setTimeout(() => thisComponent.querySelector('.item-data input').focus(), 10);
        // // console.log(document.activeElement);
        // return;
      }
      // let eventClick = new Event('click');
      // thisComponent.dispatchEvent(eventClick);
      setTimeout(() => this.$emit('next-element', thisComponent), 10);
    },
    componentByTypeDefault(type) {
      switch(type) {
        case 'string': return () => import('@/components/Elements/ElField/ElFieldString.vue');
        case 'integer': return () => import('@/components/Elements/ElField/ElFieldNumber.vue');
        case 'boolean': return () => import('@/components/Elements/ElField/ElFieldSwitch.vue');
        case 'choice': return () => import('@/components/Elements/ElField/ElFieldChoice.vue');
        case 'date': return () => import('@/components/Elements/ElField/ElFieldDate.vue');
        case 'datetime': return () => import('@/components/Elements/ElField/ElFieldDateTime.vue');
        case 'field': return () => import('@/components/Elements/ElField/ElFieldDialog.vue');
      }
    },
    computedLineCompare(option) {
      let key = this.inputProperties.key;
      this.valueCompare = option;
      switch(option) {
        case 'equally': return `&${key}=`;
        // case 'more': return `${key}__gte=`;
        case 'moreOrEqually': return `&${key}__gte=`
        // case 'less': return `${key}__lte=`;
        case 'lessOrEqually': return `&${key}__lte=`;
        case 'inList': return `&${key}__in=`;
        case 'contains': return `&${key}__contains=`;
        case 'between': return [`&${key}__gte=`, `${key}__lte=`];
        default: return null;
      }
    },
    resetComponent() {
      this.isFilterOn = false;
      this.$emit('input-filter', { key: this.inputProperties.key, value: null }); // EMIT -----------------<<<<<<<<<<
    },

    eventInputData () {
      let emitValue = {};
      switch(this.valueCompare) {
        case 'equally':
        case 'contains': 
        case 'moreOrEqually':
        case 'lessOrEqually': {
          switch(this.inputProperties.type) {
            case 'string':
            case 'integer':
            case 'date': 
            case 'datetime': {
              if (!this.valueData) emitValue = { key: this.inputProperties.key, value: null };
              else emitValue = { key: this.inputProperties.key, value: `${this.computedLineCompare(this.valueCompare)}${this.valueData}` };
              break;
            }
            case 'boolean': {
              emitValue = { key: this.inputProperties.key, value: `${this.computedLineCompare(this.valueCompare)}${(this.valueData) ? 'true' : 'false'}`};
              break;
            }
            case 'choice': {
              if (!this.valueData) emitValue = { key: this.inputProperties.key, value: null };
              else emitValue = { key: this.inputProperties.key, value: `${this.computedLineCompare(this.valueCompare)}${this.valueData.value}` };
              break;
            }
            case 'field': {
              if (!this.valueData) emitValue = { key: this.inputProperties.key, value: null };
              else emitValue = { key: this.inputProperties.key, value: `${this.computedLineCompare(this.valueCompare)}${this.valueData.id}` };
              break;
            }
          }
          break;
        }
        case 'between': {
          if (!this.valueData.start || !this.valueData.end) {
            emitValue = { key: this.inputProperties.key, value: null };
            break;
          }
          let newValueData = [];
          newValueData.push(`${this.computedLineCompare(this.valueCompare)[0]}${this.valueData.start.split('.').reverse().join('-')}`);
          newValueData.push(`${this.computedLineCompare(this.valueCompare)[1]}${this.valueData.end.split('.').reverse().join('-')}`);
          emitValue = { key: this.inputProperties.key, value: newValueData.join('&')};
          break;
        }
        case 'inList': {
          if (!this.valueData) emitValue = { key: this.inputProperties.key, value: null };
          else emitValue = { key: this.inputProperties.key, value: `${this.computedLineCompare(this.valueCompare)}${this.valueData}` };
          break;
        }
      }
      // console.log(emitValue);
      this.selectedItem = emitValue;
      // console.log(emitValue.value);
      (emitValue.value) ? this.isFilterOn = true : this.isFilterOn = false;
      this.$emit('input-filter', emitValue); // EMIT -----------------<<<<<<<<<<
    },
  },
}
</script>

<style lang="scss" scoped>
.item {
  display: grid;
  grid-template-areas: "checkbox compare data";
  grid-template-columns: 34px 180px 1fr;
  grid-template-rows: 40px;
  align-items: flex-end;
  gap: 0px 15px;
  margin-bottom: 12px;
  &:last-child { margin-bottom: 0px; }
  &-checkbox {
    grid-area: checkbox;
    margin-bottom: -16px;
  }
  &-compare {
    grid-area: compare;
    margin-bottom: -16px;
  }
  &-data {
    grid-area: data;
    margin-bottom: -16px;
  }
}
</style>