<template>
  <v-app class="app">
    <!-- <div class="app__bar">
      <app-bar></app-bar>
    </div>
    
    <div class="app__bar-nav">
      <app-bar-nav></app-bar-nav>
    </div>

    <div class="app__content">
      <router-view/>
    </div> -->
    <component :is="layout">
      <router-view/>
    </component>
    
  </v-app>
</template>

<script>

import LayoutEmpty from '@/layout/LayoutEmpty.vue';
import LayoutMain from '@/layout/LayoutMain.vue';
export default {
  name: 'App',
  components: {
    LayoutEmpty,
    LayoutMain,
  },
  computed: {
    layout() { return 'Layout' + (this.$route.meta.layout || 'Main') },
  },
};
</script>

<style lang="scss">
html, body {
  overflow: hidden;
  height: 100%;
  box-sizing: border-box;
  a { text-decoration: none; }
}
.app {
  overflow: hidden;
}
.tooltip-text {
  display: block;
  padding: 2px 6px;
  width: 100%;
  height: 100%;
  border: thin solid rgba(0, 0, 0, .87);
  border-radius: 4px;
  font-size: .875rem;
  line-height: 1.5;
  
  &-control {
    background-color: rgba(0, 0, 0, .87);
    color: rgba(255, 255, 255, 1);
  }
  &-body {
    color: rgba(0, 0, 0, .87);
    background-color: rgba(255, 255, 255, 1);
  }
}
.snack {
    display: flex;
    justify-content: center;
    // text-align: center;
    // font-size: 1.2em;
  }
</style>