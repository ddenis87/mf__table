<template>
  <div class="test">
    <div class="field">
      <input-field-wrapper field-type="string"></input-field-wrapper>
    </div>
  </div>
</template>

<script>
import InputFieldWrapper from '../components/Form/InputFieldWrapper.vue';

export default {
  name: 'Test',
  components: {
    InputFieldWrapper,
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
