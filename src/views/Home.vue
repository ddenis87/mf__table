<template>
  <div class="home">
    <h1 class="home-title">Универсальная таблица mf-Table</h1>
    <div class="home-table">
      <v-btn class="home-table__btn"
             dark
             x-large
             min-width="160"
             color="blue darken-3"
             @click="getStarted">Начать</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    getStarted() {
      this.$router.push('/TablesPage?tableName=organization');
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  padding-top: 56px;
  // border: thin solid black;
  &-title {
    color: #1565C0
  }
  &-table {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 60%;
    max-height: 490px;
    background-image: url('../assets/images/home__table.png');
    background-repeat: no-repeat;
    background-size: cover;
    border: thin solid rgba(0, 0, 0, .4);
    border-radius: 5px;
  }
}
@media screen and (max-width: 850px) {
  .home {
    padding-top: 36px;
    &-title {
      font-size: 1.5em;
    }
  }
}
@media screen and (max-width: 400px) {
  .home {
    padding-top: 36px;
    &-title {
      font-size: 1em;
    }
  }
}
</style>
