<template>
  <v-app class="app">
    <component :is="layout">
      <router-view/>
    </component>
  </v-app>
</template>

<script>
import LayoutEmpty from '@/layout/LayoutEmpty.vue';
import LayoutMain from '@/layout/LayoutMain.vue';
import LayoutPrint from '@/layout/LayoutPrint.vue';

export default {
  name: 'App',
  components: {
    LayoutEmpty,
    LayoutMain,
    LayoutPrint,
  },
  computed: {
    layout() { return `Layout${this.$route.meta.layout || 'Empty'}`; },
  },
  mounted() {
    console.log('mounted app');
  },
};
</script>

<style lang="scss">
@import './scss/tooltip.scss';

$scrollWidth: 8px;
$scrollHeight: 8px;
$scrollBorderRadius: 4px;
$scrollThumbBorderRadius: 3px;
$scrollThumbBackgroundColor: rgba(0,0,0,0.2);

html, body {
  box-sizing: border-box;
  font-size: 16px;
  a { text-decoration: none; }
  &::-webkit-scrollbar {
    display: none;
    width: $scrollWidth;
    height: $scrollHeight;
    border-radius: $scrollBorderRadius;
    &-thumb {
      border-radius: $scrollThumbBorderRadius;
      background-color: $scrollThumbBackgroundColor;
    }
  }
}

.snack {
    display: flex;
    justify-content: center;
    white-space: pre-line;
  }

  @media print {
    html, body {
      overflow: auto !important;
    }
  }
</style>
