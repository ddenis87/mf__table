<template>
  <div class="test">
    <v-card class="test__card">
      <v-row>
        <v-col>
          <field-string></field-string>
        </v-col>
      </v-row>
    </v-card>
    <div class="test-head"></div>
  </div>
</template>

<script>
// import FieldWrapper from '@/components/Fields/FieldWrapper.vue';
import FieldString from '@/components/Fields/FieldString.vue';

export default {
  name: 'Test',
  components: {
    // FieldWrapper,
    FieldString,
  },
};
</script>

<style lang="scss" scoped>
.test {
  padding: 20px;
  &__card {
    padding: 20px;
    width: 500px;
  }
  &-head {
    width: 1000px;
    height: 100px;
    border: thin solid green;
  }
}
</style>
