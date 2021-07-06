<template>
  <div class="edit-element" :class="{'edit-element_padding-group' : isHierarchyMode}" ref="FormEditElement">
    <div class="element" :class="`element_${typeRow}`" :style="styleForm">
      <field-wrapper v-for="(item, index) in itemsHeader"
                    :key="index"
                    :field-options="item"
                    :type-row="typeRow"
                    v-model="fieldValue[item.value]"
                    @control:esc="editingCanceled"
                    @keydown:control="eventKeydown"
                    @blur:wrapper="evtBlur"></field-wrapper>
    </div>
    <v-snackbar content-class="snack"
                color="red darken-3"
                v-model="isShowError">{{ 'Не заполнены все обязательные поля' }}</v-snackbar>
  </div>
</template>

<script>
import FieldWrapper from './FieldWrapper.vue';
export default {
  name: 'EditElement',
  components: {
    FieldWrapper,
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
      fieldValue: {},
      isShowError: false,
    };
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
    setTimeout(() => {
      this.$refs.FormEditElement.firstChild.firstChild.querySelector('.field-item input').focus();
    }, 400);
    this.itemsHeader.forEach((item) => {
      // console.log(item);
      this.fieldValue[item.value] = '';
    });
    this.$store.commit('DataTable/MARK_MODE_ADDING', {
      tableName: this.propertiesComponent.tableName,
      guid: this.propertiesComponent.guid,
      status: true,
    });
  },
  methods: {
    async editingAccepted() {
      let formData = this.buildForm();
      let sendOption = {
        ...this.propertiesComponent,
        formData,
        previous: true,
      }
      document.querySelector('.edit-element').remove();
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
      document.querySelector('.edit-element').remove();
    },
    eventKeydown(option) {
      option.event.preventDefault();
      this.fieldsElement[option.fieldKey] = this.fieldValue[option.fieldKey];
      if (option.event.code === 'Tab' && option.event.shiftKey === false) {
        const nextElement = option.event.target.closest('.field-wrapper').nextElementSibling;
        if (nextElement) nextElement.querySelector('.field-item input').focus();
      }
      if (option.event.code === 'Tab' && option.event.shiftKey === true) {
        const nextElement = option.event.target.closest('.field-wrapper').previousElementSibling;
        if (nextElement) nextElement.querySelector('.field-item input').focus();
      }
      console.log(option.event.code);
      if (option.event.code === 'Enter' || (option.event.code === 'Tab' && option.event.shiftKey === false)) {
        const nextElement = option.event.target.closest('.field-wrapper').nextElementSibling;
        if (nextElement) {
          nextElement.querySelector('.field-item input').focus();
          return;
        }
        if (this.checkRequiredElementFields()) {
          this.editingAccepted();
        } else {
          option.event.target.focus();
          this.isShowError = true;
        }

      }
    },

    evtBlur(option) {
      this.fieldsElement[option.fieldKey] = this.fieldValue[option.fieldKey];
      if (option.event.relatedTarget) {
        if (!option.event.relatedTarget.closest('.edit-element')) {
          if (this.checkRequiredElementFields()) {
            this.editingAccepted();
          } else {
            setTimeout(() => option.event.target.focus(), 300);
            this.isShowError = true;
          }
        }
      }
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
      let condition = true;
      this.itemsHeader.forEach((element) => {
        if (element.required) {
          console.log(this.fieldsElement[element.value]);

          if (['', undefined, null].includes(this.fieldsElement[element.value])) condition = false;
        }
      });
      // for (let key of Object.keys(this.itemsHeader)) {
      //   let field = this.itemsHeader[key];
      //   if (field.required) {
      //     if (!Object.keys(this.fieldsElement).includes(field.value)) {
      //       return false;
      //     } else {
      //       if (!this.fieldsElement[field.value]) return false;
      //     }
      //   }
      // }
      return condition;
    },

    nextElement(currentElement) {
      if (currentElement.className.indexOf('edit-element') != -1) return null;
      if (currentElement.parentElement.nextElementSibling) {
        let nextElement = currentElement.parentElement.nextElementSibling;
        if (nextElement.querySelector('.field > .el-field__item')) {
          nextElement = nextElement.querySelector('.field > .el-field__item');
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
  },
};
</script>

<style lang="scss" scoped>
.edit-element {
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
    // &__item {
    //   margin-top: -19px;
    //   padding: 2px;
    // }
  }
  // .line-required {
  //   grid-template-rows: 3px;
  //   &_false {
  //     margin: 0px 2px;
  //     background-color: rgba(21,101,192, .3);
  //   }
  //   &_true {
  //     margin: 0px 2px;
  //     background-color: rgba(255, 0, 0,.6);
  //   }
  // }
  // .snack  -- in App
}
</style>
