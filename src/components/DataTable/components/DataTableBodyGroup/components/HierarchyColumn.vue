<template>
  <div>
    <div class="group-item">
      <data-table-btn-icon class="action-btn" v-if="isGroup" @click="eventToggleGroup">mdi-menu-right</data-table-btn-icon>
    </div>
    <div class="group-item">
      <v-icon small v-if="isGroup">mdi-folder</v-icon>
    </div>
    <div class="group-item">
      <v-icon small v-if="!isGroup">mdi-window-minimize</v-icon>
    </div>
  </div>
</template>

<script>
import DataTableBtnIcon from '../../DataTableBtnIcon.vue';

export default {
  name: 'HierarchyActions',
  components: {
    DataTableBtnIcon,
  },
  props: {
    itemRow: { type: Object, default() { return null } },
    isOpen: { type: Boolean, default: false },
  },
  data() {
    return {

    }
  },
  computed: {
    isGroup() {
      if (typeof(this.itemRow) == 'object') {
        return ('is_group' in this.itemRow) ? this.itemRow.is_group : false;
      } else return false;
    },
  },
  methods: {
    eventToggleGroup(event) {
      this.$emit('toggle-group', event);
    }
  }
}
</script>

<style lang="scss" scoped>
// .body-group-column__group {
//   grid-area: group;
//   display: flex;
//   justify-content: flex-end;
//   // gap: 3px;
//   align-items: flex-start;
  .action-btn {
    margin-right: 5px;
    transform: rotate(90deg);
    &_action {
      transform: rotate(90deg);
    }
  }
// }
</style>