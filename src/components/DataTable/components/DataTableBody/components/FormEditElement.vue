<template>
  <div class="form-edit-element" :class="{'form-edit-element_padding-group' : isHierarchyMode}" ref="FormEditElement">
    <div class="element" :class="`element_${typeRow}`" :style="styleForm">
      <el-field-wrapper v-for="(item, index) in itemsHeader"
                        :key="index"
                        class="element__item"
                        in-use="form"
                        :is-dense="true"
                        :is-hide-label="true"
                        :is-hide-underline="true"
                        :style="item.position_in_template"
                        :field-type="item.type"
                        :field-option="item"
                        @event-keydown-escape="editingCanceled"
                        @event-keydown-enter="eventKeydown"
                        @event-keydown-tab="eventKeydown"
                        @event-blur="eventBlur"></el-field-wrapper>
    </div>
    <div class="element line-required" :style="styleForm">
      <div v-for="(item, index) in itemsHeader"
           :key="index"
           class="line-required"
           :class="`line-required_${item.required}`"></div>
    </div>
    <v-snackbar content-class="snack" v-model="isShowError"
                color="red darken-3">{{ 'Не заполнены все обязательные поля' }}</v-snackbar>
  </div>
</template>

<script>
import ElFieldWrapper from '@/components/Elements/ElFields/ElFieldWrapper.vue';
export default {
  name: 'FormEditElement',
  components: {
    ElFieldWrapper,
  },
  props: {
    propertiesComponent: { type: Object, default: () => { return { tableName: '', guid: '' }}},
    itemsHeader: null,
    styleForm: Object,
    typeRow: { type: String, default: 'fixed' },
    isHierarchyMode: {type: Boolean, default: false},
  },
  data() {
    return {
      fieldsElement: {},
      isShowError: false,
    }
  },
  computed: {
    getListGroup() {
      return this.$store.getters['DataTable/GET_DATA_GROUP']({
        tableName: this.propertiesComponent.tableName,
        guid: this.propertiesComponent.guid,
      });
    },
  },
  mounted() {
    // console.log(this.propertiesComponent);
    // console.log(this.itemsHeader);
    console.log(this.styleForm);
    setTimeout(() => {
      this.$refs.FormEditElement.querySelectorAll('.el-field > .el-field__item')[0].querySelector('input').focus();
    }, 400);
    this.$store.commit('DataTable/MARK_MODE_ADDING', {
      tableName: this.propertiesComponent.tableName,
      guid: this.propertiesComponent.guid,
      status: true,
    });
  },
  beforeDestroy() {
    console.log('destroy');
  },
  methods: {
    eventKeydown(option) {
      // console.log(option.event);
      if (option.event.key == 'Tab' && option.event.shiftKey == true) {
        if (!option.event.target.closest('.el-field').parentElement.previousElementSibling) {
          option.event.preventDefault();
        }
      }
      if (option.event.key == 'Tab' && option.event.shiftKey == false) {
        if (!option.event.target.closest('.el-field').parentElement.nextElementSibling) {
          option.event.preventDefault();
        }
      }
      if (option.event.key == 'Enter' || (option.event.key == 'Tab' && option.event.shiftKey == false)) {
        this.fieldsElement[option.fieldKey] = option.value;
        if (!option.event.target.closest('.el-field').parentElement.nextElementSibling) {
          option.event.preventDefault();
          option.event.target.focus();
          if (this.checkRequiredElementFields()) {
            // send server
            // console.log('send server');
            this.editingAccepted();
            // console.log(this.fieldsElement);
          } else {
            option.event.target.focus();
            // show error
            // console.log('error');
            this.isShowError = true;
            // setTimeout(() => this.isShowError = false, 5000);
          }
        }
      }
      if (option.event.key == 'Enter') {
        this.nextElement(option.event.target.closest('.el-field'));
      }
      
    },
    eventBlur(option) {
      this.fieldsElement[option.fieldKey] = option.value;
      if (option.event.relatedTarget) {
        if (!option.event.relatedTarget.closest('.form-edit-element')) {
          if (this.checkRequiredElementFields()) {
            // send server
            // console.log('send server');
            this.editingAccepted();
            console.log(this.fieldsElement);
          } else {
            setTimeout(() => option.event.target.focus(), 300);
            // show error
            // console.log(option.event);
            this.isShowError = true;
            // setTimeout(() => this.isShowError = false, 5000);
          }
        }
      }
    },
    async editingAccepted() {
      
      let formData = this.buildForm();
      let sendOption = {
        ...this.propertiesComponent,
        formData,
        previous: true,
      }
      document.querySelector('.form-edit-element').remove();
      this.$emit('clear-formEditrElement')
      await this.$store.dispatch('DataTable/ADDING_NEW_ELEMENT', sendOption)
        .then((id) => {
          let addingElement = document.querySelectorAll(`.${this.propertiesComponent.guid} .body [data-rowId="${id}"]`)[0];
          let eventClick = new Event('click', {bubbles: false});
          setTimeout(() => {
            addingElement.focus();
            addingElement.dispatchEvent(eventClick);
          }, 1000);
        })
        .catch(() => this.addingModeOff())
        .finally(() => {
          this.addingModeOff();
        })
    },

    editingCanceled() {
      this.addingModeOff();
      document.querySelector('.form-edit-element').remove();
    },
    
    addingModeOff() {
      this.$store.commit('DataTable/MARK_MODE_ADDING', {
        tableName: this.propertiesComponent.tableName,
        guid: this.propertiesComponent.guid,
        status: null,
      });
      this.$store.commit('DataTable/SET_ACTIVE_ELEMENT', {
        tableName: this.propertiesComponent.tableName,
        guid: this.propertiesComponent.guid,
        value: null,
      });
    },

    buildForm() {
      let newFormData = new FormData();
      for (let keyValue of Object.entries(this.fieldsElement)) {
        let element = {key: keyValue[0], value: keyValue[1]};
        if (element.value != '') 
          newFormData.set(element.key, this.computedValueField(element.value));
      }
      if (this.getListGroup.length) {
        let valueGroup = this.computedValueField(this.getListGroup[this.getListGroup.length - 1]);
        newFormData.set('parent', valueGroup);
      }
      return newFormData;
    },

    computedValueField(value) {
      let newValue = null;
      if (typeof(value) == 'object' && value != null) {
        if ('id' in value)
          newValue = value.id;
        else
          newValue = value.value;
      }
      else 
        newValue = (value != null) ? value : '';
      return newValue;
    },

    checkRequiredElementFields() {
      for (let key of Object.keys(this.itemsHeader)) {
        let field = this.itemsHeader[key];
        if (field.required) {
          if (!Object.keys(this.fieldsElement).includes(field.value)) {
            return false;
          } else {
            if (!this.fieldsElement[field.value]) return false;
          }
        }
      }
      return true;
    },

    nextElement(currentElement) {
      if (currentElement.className.indexOf('form-edit-element') != -1) return null;
      if (currentElement.parentElement.nextElementSibling) {
        let nextElement = currentElement.parentElement.nextElementSibling;
        if (nextElement.querySelector('.el-field > .el-field__item')) {
          nextElement = nextElement.querySelector('.el-field > .el-field__item');
          if (nextElement.parentElement.getAttribute('tabindex') == -1) {
            this.nextElement(nextElement.parentElement);
            return;
          }
          if (nextElement.querySelector('input'))
            return nextElement.querySelector('input').focus();
          if (nextElement.querySelector('textarea'))
            return nextElement.querySelector('textarea').focus();
        }
      }
      this.nextElement(currentElement.parentElement);
    },
  }
}
</script>

<style lang="scss" scoped>
.form-edit-element {
  padding-top: 2px;
  background-color: white;
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
  &_padding-group {
    padding-left: 40px;
  }
  .element {
    display: grid;
    overflow: hidden;
    
    &_fixed { grid-template-rows: calc(43px - 6px); }
    &_dense { grid-template-rows: 22px; }
    &_auto { grid-template-rows: auto; }
    &__item {
      margin-top: -19px;
      padding: 2px;
    }
  }
  .line-required {
    grid-template-rows: 3px;
    &_false {
      margin: 0px 2px;
      background-color: rgba(21,101,192, .3);
    }
    &_true {
      margin: 0px 2px;
      background-color: rgba(255, 0, 0,.6);
    }
  }
  // .snack  -- in App
}
</style>