<template>
  <div class="layout-main">
    <div class="layout-main__bar">
      <app-bar></app-bar>
    </div>
    <div class="layout-main__bar-nav">
      <app-bar-nav></app-bar-nav>
    </div>
    <div class="layout-main__content">
      <router-view/>
    </div>
  </div>
</template>

<script>
import AppBar from '@/components/App/AppBar.vue';
import AppBarNav from '@/components/App/AppBarNav.vue';
export default {
  name: 'LayoutMain',
  components: {
    AppBar,
    AppBarNav
  },
  created() {
    if (localStorage.getItem('Token') == null) this.$router.push('/Login');
  },
}
</script>

<style lang="scss" scoped>
.layout-main {
  display: grid;
  grid-template-areas: "layout-main__bar" "layout-main__bar-nav" "layout-main__content";
  grid-template-columns: 100%;
  grid-template-rows: 28px 36px 1fr;
  min-height: 100%;
  width: 100%;
  &__bar {
    grid-area: layout-main__bar;
    display: flex;
    align-items: center;
    border-bottom: thin solid rgba(0, 0, 0, .6);
    overflow: hidden;
  }
  &__bar-nav {
    grid-area: layout-main__bar-nav;
    display: flex;
    align-items: center;
    border-bottom: thin solid rgba(0, 0, 0, .6);
    overflow: hidden;
  }

  &__content {
    grid-area: layout-main__content;
    height: 100%;
    overflow: hidden;
    // border: thin solid red;
  }
}
  
</style>