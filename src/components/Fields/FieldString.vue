<template>
  <div class="field field-string">
    <v-text-field class="field__item"
                  v-bind="fieldProps"
                  v-model="fieldValue"
                  @input="eventInput"
                  @keydown.stop.enter="eventKeydown"
                  @keydown.stop.tab="eventKeydown"
                  @keydown.stop.escape="eventKeydown"
                  @keydown.stop
                  @blur="blurField">

    </v-text-field>
  </div>
</template>

<script>
export default {
  name: 'FieldString',
  props: {
    ...fieldProps,
  },
};
</script>

<style lang="scss" scoped>

</style>
