<template>
  <div class="logout">
    <v-card width="500" flat class="logout__window">
      <dialog-toolbar is-dialog-name="Выход из системы" :is-close="false"></dialog-toolbar>
      <v-form class="form-logout" ref="FormLogout">
        <span class="form-logout__error">Вы вышли из системы</span>
        <v-card-actions class="form-logout__action">
          <v-spacer></v-spacer>
          <v-btn dark
                 color="blue darken-3"
                 height="30"
                 @click="goLogin">Войти
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import DialogToolbar from '@/components/Dialogs/DialogToolbar.vue';

export default {
  name: 'Logout',
  components: {
    DialogToolbar,
  },
  mounted() {
    console.log(this.$store.state);
    console.log(localStorage.getItem('Token'));
  },
  methods: {
    goLogin() {
      this.$router.push('/Login');
    },
  },
};
</script>

<style lang="scss" scoped>
.logout {
  display: flex;
  height: 50vh;
  justify-content: center;
  align-items: center;
  &__window {
    border: thin solid rgba(0, 0, 0, .12);
    border-radius: 4px;
  }
  .form-logout {
    padding: 15px 15px;
    &__label {
      display: inline-flex;
      align-items: center;
      height: 22px;
      margin-left: -17px;
      overflow: hidden;
    }
  }
}
</style>
