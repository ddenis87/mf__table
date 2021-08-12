<template>
  <div class="p-toolbar">
    <v-toolbar class="toolbar"
               height="48"
               flat
               @click="evtClick">
      <v-overlay :value="isDisabled" opacity="0.5" z-index="999" color="white" :absolute="true"></v-overlay>

      <template v-for="(item, itemIndex) in items">
        <v-spacer v-if="!item.name" :key="itemIndex"></v-spacer>
        <p-toolbar-item v-else
                        :key="itemIndex"
                        :disabled="(item.active && isActive !== true)"
                        :value="(isRecycleBin && item.alterValue) ? item.alterValue : item.value"
                        :icon-color="(isRecycleBin && item.alterIconColor) ? item.alterIconColor : ''"
                        v-bind="item"></p-toolbar-item>
      </template>
    </v-toolbar>
  </div>
</template>

<script>
import PToolbarItem from './PToolbarItem.vue';

const TOOLBAR_MODE = {
  DEFAULT: 'default',
  RECYCLE: 'recycle',
};

export default {
  name: 'PToolbar',
  components: {
    PToolbarItem,
  },
  props: {
    items: {
      type: Array,
      default: () => [
        { name: 'create', value: 'Добавить элемент', icon: 'mdi-plus' },
        { name: 'create-inline', value: 'Добавить строку', icon: 'mdi-table-row-plus-after' },
        { name: 'create-group', value: 'Добавить группу', icon: 'mdi-folder-plus-outline' },
        {
          name: 'edit',
          value: 'Изменить',
          icon: 'mdi-pencil',
          active: true,
        },
        {
          name: 'mark-delete',
          value: 'Установить пометку на удаление',
          icon: 'mdi-text-box-remove-outline',
          active: true,
          alterValue: 'Снять пометку на удаление',
        },
        {
          name: 'recycle',
          value: 'Показать помеченные на удаление',
          icon: 'mdi-delete-variant',
          alterValue: 'Выйти из корзины',
          alterIconColor: 'blue',
        },
        { name: 'refresh', value: 'Обновить', icon: 'mdi-refresh' },
        { name: null },
        { name: 'filter', value: 'Фильтр', icon: 'mdi-filter-outline' },
      ],
    },
    mode: { type: String, default: TOOLBAR_MODE.DEFAULT },
    isActive: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
  },
  data() {
    return {
    };
  },
  computed: {
    isRecycleBin() {
      console.log(this.mode);
      return (this.mode !== TOOLBAR_MODE.DEFAULT);
    },
  },
  methods: {
    evtClick(evt) {
      const btn = evt.target.closest('button');
      if (!btn) return;
      const btnName = btn.getAttribute('data-value');
      this.$emit('click', btnName);
    },
  },
};
</script>
