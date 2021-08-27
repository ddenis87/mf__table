<template>
  <v-toolbar flat dense
             dark
             height="40"
             color="blue darken-3">
    <v-toolbar-items>
      <v-list class="app-bar-nav"
              nav
              dark color="blue darken-3"
              height="40">
        <v-list-item-group>
          <v-list-item v-for="item in navigations"
                       :key="item.route"
                       :to="item.route"
                       dense
                       class="app-bar-nav__item"
                       tag="router-link">
            <v-list-item-icon>
              <v-icon small>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ item.value }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
export default {
  name: 'AppBarNav',
  data() {
    return {
      navigations: [
        { value: 'Таблицы', icon: 'mdi-table', route: '/Tables' },
        { value: 'Домашняя страница', icon: 'mdi-home', route: '/' },
        // { value: 'SpreadSheet', icon: 'mdi-file-table-box-outline', route: '/SpreadSheetView' },
        { value: 'Svod', icon: 'mdi-table-large-plus', route: '/Svod' },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.app-bar-nav {
  &__item {
    display: inline-flex;
    margin-right: 8px;
    // height: 30px;
  }
}
::v-deep {
  .v-list {
    padding: 0px;
  }
  .v-list--nav {
    padding-left: 0px;
  }
}
</style>
