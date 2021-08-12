<template>
  <div class="catalog">
    <div class="catalog__header"></div>
    <div class="catalog__control">
      <p-toolbar v-bind="toolbarProps"
                 @click="catalogToolbar.evtClickToolbar"></p-toolbar>
    </div>
    <div class="catalog__body">
      <catalog-table-organization @row-focused="catalog.setFocusedElement"
                                  @component-mounted="catalog.mountedTable"
                                  @component-blur="catalog.blurTable"></catalog-table-organization>
    </div>
  </div>
</template>

<script>
import Catalog from '@/logics/views/Catalog/Catalogs';
import CatalogToolbar from '@/logics/views/Catalog/CatalogsToolbar';

import PToolbar from '@/components/Form/PToolbar/PToolbar.vue';
import CatalogTableOrganization from '@/components/CatalogTable/CatalogTableOrganization.vue';

export default {
  name: 'Organization',
  components: {
    PToolbar,
    CatalogTableOrganization,
  },
  data() {
    return {
      catalog: null,
    };
  },
  computed: {
    toolbarProps() {
      return this.catalogToolbar.toolbarProps();
    },
  },
  created() {
    this.catalog = new Catalog('organization');
    this.catalogToolbar = new CatalogToolbar(this.catalog);
    this.catalog.createTableSpace();
  },
  methods: {
  },
};
</script>
