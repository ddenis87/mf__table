<template>
  <div class="field field-string">
    <v-text-field class="field__item"
                  v-bind="fieldPropsComputed"
                  @input="eventInput"
                  @keydown.stop.enter="eventKeydown"
                  @keydown.stop.tab="eventKeydown"
                  @keydown.stop.escape="eventKeydown"
                  @keydown.stop
                  @blur="eventBlur">

    </v-text-field>
  </div>
</template>

<script>
import props from './FieldProps';
import fieldComputed from './FieldComputed';

export default {
  name: 'FieldString',
  props: {
    ...props,
  },
  computed: {
    ...fieldComputed,
  },
  mounted() {
    console.log(this.fieldPropsComputed);
  },
  methods: {
    eventInput() {},
    eventKeydown() {},
    eventBlur() {},
  },
};
</script>

<style lang="scss" scoped>

</style>
