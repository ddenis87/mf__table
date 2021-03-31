<template>
  <div class="form-edit-field">
    <el-field :field-type="fieldProperties.type"></el-field>
  </div>
</template>

<script>
import ElField from '@/components/Elememnts/ElFields/ElField.vue';

export default {
  name: 'FormEditField',
  components: {
    ElField,
  },
  props: {
    fieldProperties: Object,
  },
  computed: {

  },
}
</script>

<style lang="scss" scoped>
// .form-edit-field {}
</style>