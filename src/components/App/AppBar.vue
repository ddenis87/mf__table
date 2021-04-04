<template>
  <v-app-bar class="app-bar"
             dense
             flat
             dark
             height="30"
             color="blue darken-3">
    <v-btn class="app-bar__btn" icon x-small @click="routeHome"><v-icon>mdi-menu</v-icon></v-btn>
    <span class="app-bar__title">Демонстрационное приложение универсальной таблицы</span>
    <v-spacer></v-spacer>
    <profile-user></profile-user>
  </v-app-bar>
</template>

<script>
import ProfileUser from '@/components/Profile/ProfileUser.vue';

export default {
  name: 'AppBar',
  components: {
    ProfileUser,
  },
  methods: {
    routeHome() {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="scss" scoped>
.app-bar {
  padding-left: 12px;
  &__btn {
    margin: 0px 10px;
    // margin-left: 20px;
  }
  &__title {
    font-size: 0.9em;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

</style>
