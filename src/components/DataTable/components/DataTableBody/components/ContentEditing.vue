<template>
  <div class="content-editing"
       :class="{'content-editing_required': this.properties.columnProperties.required}">
    <component :is="editingComponent"
               :input-properties="propertiesComponent"
               :input-value="propertiesComponent.text"
               :is-hide-underline="true"
               :is-single-line="true"
               :is-hide-message="true"
               :is-hide-label="true"
               :is-selected="true"
               :is-btn-clear="false"
               @keydown-enter="editingAccepted"
               @keydown-tab="editingAccepted"
               @keydown-esc="editingCanceled"
               @blur-field="editingAccepted"></component>
  </div>
</template>

<script>
export default {
  name: 'ContentEditing',
  props: {
    properties: Object,
  },
  data() {
    return {
      isComponentNull: false,
    }
  },
  computed: {
    editingComponent() {
      // console.log(this.properties);
      if (this.properties.columnProperties && !this.isComponentNull) {
        switch(this.properties.columnProperties.type) {
          case 'string': return () => import('@/components/Elements/ElField/ElFieldString.vue');
          case 'integer': return () => import('@/components/Elements/ElField/ElFieldNumber.vue');
          case 'date': return () => import('@/components/Elements/ElField/ElFieldDate.vue');
          case 'datetime': return () => import('@/components/Elements/ElField/ElFieldDateTime.vue');
          case 'choice': return () => import('@/components/Elements/ElField/ElFieldChoice.vue');
          case 'field': return () => import('@/components/Elements/ElField/ElFieldDialog.vue');
        }
      } else return null;
    },
    propertiesComponent() {
      let propertiesComponent = {};
      Object.assign(propertiesComponent, this.properties.columnProperties);
      propertiesComponent.text = this.properties.columnValue;
      // console.log(propertiesComponent.text);
      return propertiesComponent;
    },
    // isAddingMode() {
    //   console.log(this.$store.getters['DataTable/GET_ADDING_MODE']({
    //     tableName: this.properties.tableName,
    //     guid: this.properties.guid,
    //   }).id);
    //   return (this.$store.getters['DataTable/GET_ADDING_MODE']({
    //     tableName: this.properties.tableName,
    //     guid: this.properties.guid,
    //   }).id) ? false : true;
    // },
  },
  methods: {
    editingCanceled() {
      let editableElement = document.querySelector('.body-column_editing');
      let eventEditingCanceled = new CustomEvent('editing-canceled')
      editableElement.dispatchEvent(eventEditingCanceled);
      this.isComponentNull = true;
      if (document.querySelector('.content-editing')) document.querySelector('.content-editing').remove();
      if (this.$store.getters['DataTable/GET_ADDING_MODE']({tableName: this.properties.tableName, guid: this.properties.guid}).index)
        this.editingCanceledStore();
    },

    editingCanceledStore() {
      let sendOption = {
        tableName: this.properties.tableName,
        guid: this.properties.guid,
      };
      this.$store.dispatch('DataTable/DELETING_NEW_ELEMENT_INLINE', sendOption);
    },

    async editingAccepted(option) {
      // option.event.preventDefault();
      console.log(option);
      if (this.$store.getters['DataTable/GET_ADDING_MODE']({tableName: this.properties.tableName, guid: this.properties.guid}).index) {
        console.log('in line');
        if (option.ev == 'blur') { this.editingCanceled(); return; }
        this.editingAcceptedStore(option);
        return;
      }
      let sendOption = {
        tableName: this.properties.tableName,
        guid: this.properties.guid,
        id: this.properties.itemRow.id,
      };
      
      let newValue = this.computedValue(option);

      let bFormData = new FormData();

      for (let key of Object.keys(this.properties.itemRow)) {
        let currentValue = this.properties.itemRow[key];
        let newCurrentValue = null;
        if (currentValue != null) {
          if (typeof(currentValue) == 'object' && currentValue != null) {
            if ('id' in currentValue) newCurrentValue = currentValue.id;
            else newCurrentValue = currentValue.value;
          } else {
            newCurrentValue = currentValue;
          }
          bFormData.set(key, newCurrentValue);
        }
      }
      bFormData.set(this.properties.columnProperties.value, newValue);
      
      sendOption.formData = bFormData;

      let editableElement = document.querySelector('.body-column_editing');
// --------------------------------
      this.saveDataStore(option, 'field');
// --------------------------------
      this.$store.dispatch('DataTable/UPDATE_ELEMENT_FIELD', sendOption);
      let eventEditingAccepted = new CustomEvent('editing-accepted', { detail: { key: option.key, keyShift: option.shift } });
      editableElement.dispatchEvent(eventEditingAccepted);
      this.isComponentNull = true;
      if (document.querySelector('.content-editing')) document.querySelector('.content-editing').remove();
    },

    editingAcceptedStore(option) {
      this.saveDataStore(option, 'item');
      let editableElement = document.querySelector('.body-column_editing');
      let eventEditingAccepted = new CustomEvent('editing-accepted', { detail: { key: 'Tab', keyShift: option.shift } });
      editableElement.dispatchEvent(eventEditingAccepted);
      this.isComponentNull = true;
      if (document.querySelector('.content-editing')) document.querySelector('.content-editing').remove();
    },

    computedValue(option) {
      // console.log(option);
      let newValue = null;
      if (!option) return '';
      if (typeof(option.value) == 'object' && option.value != null) {
        if ('id' in option.value) newValue = option.value.id;
        else newValue = option.value.value;
      } else {
        newValue = (option.value == undefined) ? '' : option.value;
      }
      return newValue;
    },

    saveDataStore(option, flag) {
      let sendOption = {
        tableName: this.properties.tableName,
        guid: this.properties.guid,
        fieldName: this.properties.columnProperties.value,
        id: this.properties.itemRow.id,
        value: option.value,
      }
      console.log(sendOption);
      console.log(flag);
      if (option.value == null && this.properties.columnProperties.required == true) return;
      if (flag == 'element') {
        // this.$store.dispatch('DataTable/ADDING_INLINE_ELEMENT', sendOption);
      } else {
        this.$store.dispatch('DataTable/ADDING_NEW_ELEMEN_INLINE_FIELD', sendOption);
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.content-editing {
  display: flex;
  margin-top: -9.5px;
  &_required {
    border-bottom: thin dashed red;
  }
}
</style>