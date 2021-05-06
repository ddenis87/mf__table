<template>
  <div class="test">
    <field-wrapper>
      <field-string></field-string>
    </field-wrapper>
  </div>
</template>

<script>
import FieldWrapper from '@/components/Fields/FieldWrapper.vue';
import FieldString from '@/components/Fields/FieldString.vue';

export default {
  name: 'Test',
  components: {
    FieldWrapper,
    FieldString,
  },
};
</script>

<style lang="scss" scoped>
.test {}
</style>
