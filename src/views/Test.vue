<template>
  <div class="test">
    <div class="field">
      <field-wrapper field-type="string"></field-wrapper>
    </div>
  </div>
</template>

<script>
import FieldWrapper from '../components/SpreadSheetEditing/FieldWrapper.vue';

export default {
  name: 'Test',
  components: {
    FieldWrapper,
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 500px;
  .field {
    padding: 29px 0px;
    width: 210px;
    height: 80px;
    border: thin solid lightcoral;
  }
}
</style>
