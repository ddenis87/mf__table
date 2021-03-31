<template>
  <div class="el-field el-field-dialog" 
       :class="{'el-field_single-line': isSingleLine, 
                'el-field_hide-message': isHideMessage,
                'el-field_hide-underline': isHideUnderline}">
    <div class="el-field__anchor" tabindex="-1"></div>
    <v-autocomplete class="el-field__item"
                    
                    
                    append-icon="mdi-dots-horizontal"

                    v-bind="propsField"
                    :items="fieldList"
                    :item-text="fieldListText"
                    :item-value="'id'"
                    
                    v-model="fieldValue"
                    @click.stop
                    @click:append="eventOpenDialog"
                    @click:clear="eventClearValue"
                    @input="eventInputValue"
                    @change="eventChangeValue"
                    @keydown.stop.enter="eventKeydownEnter"
                    @blur="eventBlurField">
    </v-autocomplete>
    <dialog-full-page :is-dialog-name="dialogTableName" 
                      :is-dialog-show="isDialogShow" 
                      @close-dialog="eventCloseDialog">
      <component :is="componentTable"
                 :isEditableInline="false"
                 :default-filters="filters"
                 @row-selected="eventSelectedRowDialog"></component>
    </dialog-full-page>
  </div>
</template>

<script>
import { ElField } from './ElField.js';
import { ElFieldProps } from './ElFieldProps.js';

import DialogFullPage from '@/components/Dialogs/DialogFullPage.vue';
export default {
  name: 'ElFieldDialog',
  components: {
    DialogFullPage,
  },
  mixins: [
    ElField,
    ElFieldProps,
  ],
  props: {
    filters: null,
  },
  data() {
    return {
      isDialogShow: false,
      isChange: false,
      fieldElementDOM: null,

      relatedModelName: this.inputProperties['related_model_name'],
      relatedModelView: this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({ tableName: this.inputProperties['related_model_name']}),
    }
  },
  computed: {
    fieldListText() { 
      return (this.relatedModelView != '{id}') ? 'text' : 'id'; },
    fieldList() {
      console.log();
      let fieldListStore = this.$store.getters[`DataTable/GET_LIST_DATA`]({
        tableName: this.relatedModelName,
      });
      if (this.relatedModelView != '{id}') {
        let fieldList = [];
        let templateValue = this.relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
        fieldListStore.forEach(element => {
          let newValue = '';
          newValue = this.relatedModelView;
          templateValue.forEach(item => {
            newValue = newValue.replace(`{${item}}`, element[item]);
          });
          fieldList.push(Object.assign(element, {text: newValue}));
        });
        return fieldList;
      }
      return fieldListStore;

      // return (this.isItemGroup) ? fieldListStore.filter(item => item.is_group) : fieldListStore;
    },
    dialogTableName() { return this.$store.getters[`DataTable/GET_DESCRIPTION`]({ tableName: this.relatedModelName }); },
    componentTable() {
      if (!this.isDialogShow) return null;
      if (!this.relatedModelName) return null;
      return () => import(`@/components/TheTable/TheTable${this.relatedModelName[0].toUpperCase() + this.relatedModelName.slice(1)}`);
    }
  },
  methods: {

    eventOpenDialog(event) {
      console.log(event);
      this.fieldElementDOM = event.target.closest('.el-field').querySelector('.v-select__slot input');
      console.log(this.fieldElementDOM);
      this.isDialogShow = true;
    },
    async eventSelectedRowDialog(option) {
      console.log('select element');
      await this.$store.dispatch('DataTable/ADDING_DATA_LINK', {
        tableName: this.relatedModelName,
        value: option
      })
        .then(() => {
          this.fieldValue = option;
          this.isChange = true;
          this.isDialogShow = false;
          this.emitInputValue();
          setTimeout(() => {
            this.fieldElementDOM.focus();
            this.fieldElementDOM.select();
          }, 10);
        });
      // console.log(option);
      
    },
    eventChangeValue(event) {
      // console.log('change');
      this.isChange = true;
      this.emitInputValue();
    },
    // eventKeydown(event) { // ???????
    //   if (event.key == 'Delete' || event.key == 'Backspace') {
    //     this.fieldValue = null;
    //     this.emitInputValue();
    //   }
    //   this.emitKeydown(event);
    // },

    eventInputValue() { this.emitInputValue(); },

    eventKeydownEnter(event) {
      if (this.fieldValue) {
        setTimeout(() => { this.emitKeydown(event); }, 100);
        let newEvent = new Event('click');
        event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
        return;
      }
      if (this.checkRequiredField(event)) return;
      let newEvent = new Event('click');
      event.target.closest('.el-field').firstChild.dispatchEvent(newEvent);
      setTimeout(() => {
        if (this.isChange == true) {
          this.isChange = false;
          event.target.focus();
        } else {
          this.emitInputValue();
          this.emitKeydown(event); // this.$emit('event-keydown', {event: event, value: this.fieldValue});
        }
      }, 100);

      // if (this.isChange) {
      //   let sendOption = {
      //     key: event.key,
      //     value: this.fieldValue,
      //     event: event,
      //   }
      //   this.isEmit = true;
      //   this.emitKeyEnter(sendOption);
      //   this.$emit('next-element', sendOption);
      //   return;
      // }
      // if (this.fieldValue == null) {
      //   this.isEmit = true;
      //   this.$emit('next-element', {event: event});
      // }
    },
    eventCloseDialog() {
      this.isDialogShow = false;
    },

    eventBlurField() {
      if (!this.isDialogShow  && !this.isEmit) {
        this.emitBlurField();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';
.el-field-dialog {
  z-index: 9999;
}
</style>