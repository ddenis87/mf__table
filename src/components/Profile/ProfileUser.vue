<template>
  <div class="profile-user-bar">
    <span class="profile-user-bar__user-name">{{ userName }}</span>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon x-small v-on="on" @click="logout"><v-icon>mdi-logout</v-icon></v-btn>
      </template>
      <span class="tooltip-text tooltip-text-control">Выйти</span>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  name: 'ProfileUser',
  computed: {
    userName() {
      return this.$store.getters['Login/GET_USER_NAME_PASSWORD'].userName;
    },
  },
  methods: {
    logout() {
      this.$store.commit('Login/SET_LOGOUT');
      this.$router.push('/Logout');
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-user-bar {
  display: inline-flex;
  align-items: center;

  &__user-name {
    font-size: 0.9em;
    margin: 0px 5px;
    color: white;
  }
}
</style>
