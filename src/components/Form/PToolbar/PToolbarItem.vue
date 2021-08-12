<template>
  <btn-icon :disabled="disabled"
            :icon="icon"
            :icon-color="iconColor"
            :data-value="name">{{ value }}</btn-icon>
</template>

<script>
import BtnIcon from '@/components/Form/Btn/BtnIcon.vue';

export default {
  name: 'PToolbarItem',
  components: {
    BtnIcon,
  },
  props: {
    value: { type: String, default: '' },
    name: { type: String, default: '' },
    icon: { type: String, default: '' },
    iconColor: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
};
</script>
