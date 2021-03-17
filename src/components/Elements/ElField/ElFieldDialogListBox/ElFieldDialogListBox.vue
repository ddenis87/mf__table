<template>
  <div class="el-field el-field-dialog-list-box" :class="{'el-field_single-line': isSingleLine, 'el-field_hide-message': isHideMessage}">
    <v-text-field class="el-field__item"
                  dense
                  append-icon="mdi-dots-horizontal"
                  tabindex="1"
                  :single-line="isSingleLine"
                  :hide-details="isHideMessage"
                  :disabled="isDisabled"
                  :label="fieldLabel"
                  :clearable="isBtnClear"
                  :solo="isHideUnderline"
                  :flat="isHideUnderline"
                  v-model="fieldValueText"
                  @click:append="eventOpenDialog"
                  @click:clear="eventClearValue"
                  @keydown.enter="eventKeyEnter">
      <!-- <template v-slot:append>
        <el-btn-icon-small tabindex="2" icon="mdi-dots-horizontal" no-tooltip @click="eventOpenDialog"></el-btn-icon-small>
      </template> -->
      <!-- <template v-slot:append-outer v-if="isBtnClear">
        <el-btn-icon-small tabindex="3" icon="mdi-close" no-tooltip @click="eventClearValue"></el-btn-icon-small>
      </template> -->
    </v-text-field>
    <dialog-bar-right :is-dialog-name="`Список значений - ${inputProperties.label}`"
                      :is-dialog-show="isDialogShow"
                      width="586"
                      @close-dialog="eventCloseDialog">
      <el-field-dialog-list-box-item :input-properties="inputProperties"
                                     :count-select-value="countSelectValue"
                                     @accept-list="eventAcceptList"></el-field-dialog-list-box-item>
      <!-- <component :is="fieldListBoxComponent"
                 :input-properties="inputProperties"
                 :count-select-value="countSelectValue"
                 @accept-list="eventAcceptList"></component> -->
    </dialog-bar-right>
  </div>
</template>

<script>
import DialogBarRight from '@/components/Dialogs/DialogBarRight.vue';
import ElFieldDialogListBoxItem from './ElFieldDialogListBoxItem.vue';
import ElBtnIconSmall from '@/components/Elements/ElBtn/ElBtnIconSmall.vue';

export default {
  name: 'ElFieldDialogListBox',
  components: {
    ElFieldDialogListBoxItem,
    DialogBarRight,
    ElBtnIconSmall,
  },
  model: {
    prop: 'inputValue',
    event: 'input-value'
  },
  props: {
    isShow: { type: Boolean, default: false, },
    isSingleLine: { type: Boolean, default: false, },  // show or hide label
    isHideMessage: { type: Boolean, default: false },  // hidden or show validation error
    isHideLabel: { type: Boolean, dafault: false },    // hidden or show label
    isHideUnderline: { type: Boolean, dafault: false },
    isDisabled: { type: Boolean, default: false },     // 
    isBtnClear: { type: Boolean, default: true },     // hidden or show button clear

    inputProperties: Object,
    selectedItem: null,
  },
  data() {
    return {
      isDialogShow: false,
      fieldValue: this.inputValue,
      fieldValueText: null,
      // fieldListBoxComponent: null,
      countSelectValue: 0,
    }
  },
  computed: {
    fieldLabel() { if (!this.isHideLabel) return this.inputProperties.label; return; },

  },
  mounted() {
    this.isDialogShow = this.isShow;
    console.log(document.activeElement);
    setTimeout(() => {
      document.activeElement.closest('.item').querySelector('.body-column__item').firstChild.querySelector('input').focus();
    }, 1000);
    
  },
  methods: {
    // EVENT ------------------------
    eventOpenDialog() {
      this.isDialogShow = false;
      // this.fieldListBoxComponent = () => import('./ElFieldDialogListBoxItem.vue');
      setTimeout(() => this.isDialogShow = true, 100);
    },
    eventCloseDialog() {
      this.isDialogShow = false;
      this.fieldListBoxComponent = null;
      // console.log(this.countSelectValue);
      if (this.countSelectValue == 0) {
      //   this.fieldListBoxComponent = null;
        this.eventClearValue();
      }
    },
    eventAcceptList(tableValue) {
      console.log(tableValue);
      this.isDialogShow = false;
      this.fieldValueText = this.buildingStringDisplay(tableValue);
      // let elementField = document.getElementById(`el-field-list-${this.inputProperties.key}`);
      // setTimeout(() => elementField.blur(), 10) ;
      this.$emit('input-value', this.buildingStringEmit(tableValue));
    },
    eventClearValue() {
      this.fieldValue = null;
      this.fieldValueText = null;
      this.countSelectValue = 0;
      this.emitInputValue();
      this.emitClearValue();
    },
    eventKeyEnter(event) {
      let sendOption = {
        key: event.key,
        value: this.fieldValue,
        event: event,
      }
      this.emitKeyEnter(sendOption);
    },

    // EMIT ------------------------
    emitInputValue() { this.$emit('input-value', this.fieldValue); },
    emitClearValue() { this.$emit('clear-value'); },
    emitKeyEnter(option = null) { console.log('enter'); this.$emit('keydown-enter', option); },

    // FUNCTION --------------------
    buildingStringDisplay(valueArray) {
      // console.log(valueArray);
      if (!valueArray.length) return;
      let newString = '';
      if (this.inputProperties.type == 'field') {
        let relatedModelView = this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({tableName: this.inputProperties['related_model_name']});
        if (relatedModelView != '{id}') {
          let templateValue = relatedModelView.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
          valueArray.forEach(element => {
            let newValue = '';
            newValue = relatedModelView;
            templateValue.forEach(item => {
              newValue = newValue.replace(`{${item}}`, element[item]);
            });
            newString += `${newValue}; `;
          });
          return newString;
        } 
      } else if (this.inputProperties.type == 'choice') {
          // console.log(valueArray);
          valueArray.forEach(element => {
            newString += `${element['display_name']}; `;
          });
          // console.log(newString);
          return newString;
      }
    },
    buildingStringEmit(valueArray) {
      this.countSelectValue = valueArray.length;
      if (!valueArray.length) return;
      let newString = '';
      if (this.inputProperties.type == 'field') {
        valueArray.forEach(element => {
          newString += `${element.id}, `
        });
      } else if (this.inputProperties.type == 'choice') {
        valueArray.forEach(element => {
          newString += `${element.value}, `
        });
      }
      console.log(newString);
      return newString.slice(0, -2);
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../ElField.scss';
</style>