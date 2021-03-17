<template>
  <div class="el-field-switch">
    <v-switch v-model="fieldValue"
              @change="emitInputValue">
      <template v-slot:label>
        <span :style="`color: ${(fieldValue) ? '#1565C0' : ''}`">{{ fieldLabel }}</span>
      </template>
    </v-switch>
  </div>
</template>

<script>
import { ElField } from './ElField.js';

export default {
  name: 'ElFieldSwitch',
  mixins: [
    ElField,
  ],
  computed: {
    labelValue() { return (this.fieldValue) ? 'Установлена' : 'Снята'; },
  },
}
</script>

<style lang="scss" scoped>
@import './ElField.scss';

</style>