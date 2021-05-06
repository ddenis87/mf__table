<template>
  <div class="test">
    <v-card class="test__card">
      <v-row>
        <v-col>
          <field-string></field-string>
        </v-col>
      </v-row>
    </v-card>
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
}
</style>
