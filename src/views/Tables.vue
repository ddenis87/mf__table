<template>
  <v-container fluid>
      <v-row>
      <v-col>
        <v-list class="app-bar-nav"
                nav
                width="240">
          <v-list-item-group v-model="selectedTable">
            <v-list-item class="app-bar-nav__item"
                         dense
                         v-for="item in listTable"
                         :key="item.path"
                         :value="item">
              <v-list-item-title>{{ item.value }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>

</template>

<script>
export default {
  name: 'Tables',
  data() {
    return {
      selectedTable: null,
      listTable: [
        { value: 'Организации', path: 'TableOrganization', tableName: 'organization' },
        { value: 'Главные распорядители', path: 'TableBudgetclassification', tableName: 'budgetclassification' },
        // {value: 'Actual descs', path: 'TableActualdesc', tableName: 'actualdesc'},
      ],
    };
  },
  watch: {
    selectedTable() {
      if (this.selectedTable) { this.$router.push({ path: '/TablesPage', query: { tableName: this.selectedTable.tableName } }); }
    },
  },
};
</script>
