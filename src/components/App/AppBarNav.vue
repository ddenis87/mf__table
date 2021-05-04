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
          <v-list-item class="app-bar-nav__item"
                      dense
                      tag="router-link"
                      to="/Tables">
            <v-list-item-icon><v-icon small>mdi-table</v-icon></v-list-item-icon>
            <v-list-item-title>Таблицы</v-list-item-title>
          </v-list-item>
          <v-list-item class="app-bar-nav__item"
                      dense
                      tag="router-link"
                      to="/">
            <v-list-item-icon><v-icon small>mdi-home</v-icon></v-list-item-icon>
            <v-list-item-title>Домашняя страница</v-list-item-title>
          </v-list-item>
          <v-list-item class="app-bar-nav__item"
                      dense
                      tag="router-link"
                      to="/SpreadSheetView">
            <v-list-item-icon><v-icon small>mdi-file-table-box-outline</v-icon></v-list-item-icon>
            <v-list-item-title>SpreadSheet</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
export default {
  name: 'AppBarNav',
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
