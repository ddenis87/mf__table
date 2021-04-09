<template>
  <div class="group-element">
    <div v-for="i in level - 1"
         :key="i"
         class="group-element__item">
    </div>
    <row-btn-icon v-if="isGroup"
                  :data-row-group-number="rowNumber"
                  :data-row-group="rowGroupCount">mdi-plus-box-outline</row-btn-icon>
  </div>
</template>

<script>
import RowBtnIcon from './components/RowBtnIcon.vue';

export default {
  name: 'GroupElement',
  components: {
    RowBtnIcon,
  },
  props: {
    rowNumber: { type: Number },
    rowGroupCount: null,
    level: { type: Number, default: 0 },
    isGroup: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
.group-element {
  position: relative;
  display: flex;
  align-items: center;
  &__item {
    width: 16px;
  }
}
</style>
