<template>
  <div class="el-fields">
    <component :is="importField"
               v-bind="fieldPropertiesView"></component>
  </div>
</template>

<script>

export default {
  name: 'ElField',
  props: {
    fieldType: { type: String, default: 'string' },
  },
  computed: {
    importField() {
      return () => import(`./${this.getFieldName(this.fieldType)}.vue`);
    },
    fieldPropertiesView() {
      return {
        'is-hide-underline': true,
        'is-single-line': true,
        'is-hide-message': true,
        'is-hide-label': true,
        'is-autofocus': true,
      }
    },
  },
  methods: {
    getFieldName(type) {
      let fieldType = '';
      let fieldName = 'ElField';
      switch(type) {
        case 'string': fieldType = `String`; break;
        case 'integer': fieldType = `Number`; break;
        case 'date': fieldType = `Date`; break;
        case 'datetime': fieldType = `Datetime`; break;
        case 'choice': fieldType = `Choice`; break;
        case 'field': fieldType = `Dialog`; break;
      }
      return fieldName + fieldType;
    }
  },
}
</script>

<style lang="scss" scoped>
.el-field {
  border: thin solid grey;
}
</style>