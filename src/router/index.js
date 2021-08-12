import Vue from 'vue';
import VueRouter from 'vue-router';
// import Login from '../views/Login.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/Login',
    name: 'Login',
    meta: { layout: 'Empty' },
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/Logout',
    name: 'Logout',
    meta: { layout: 'Empty' },
    component: () => import('@/views/Logout.vue'),
  },
  {
    path: '/',
    name: '',
    meta: { layout: 'Main' },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/Home',
    name: 'Home',
    meta: { layout: 'Main' },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/Tables',
    name: 'Tables',
    meta: { layout: 'Main' },
    component: () => import('@/views/Tables.vue'),
  },
  {
    path: '/Catalogs/Organization',
    name: 'Organization',
    meta: { layout: 'Main' },
    component: () => import('@/views/Catalogs/Organization.vue'),
  },
  {
    path: '/TablesPage',
    name: 'TablesPage',
    meta: { layout: 'Main' },
    component: () => import('@/views/TablesPage.vue'),
  },
  {
    path: '/SpreadSheetView',
    name: 'SpreadSheetView',
    meta: { layout: 'Main' },
    component: () => import('@/views/SpreadSheetView.vue'),
    props: true,
  },
  {
    path: '/SpreadSheetPrint',
    name: 'SpreadSheetPrint',
    meta: { layout: 'Print' },
    component: () => import('@/views/SpreadSheetPrint.vue'),
    props: true,
  },
  {
    path: '/Catalog',
    name: 'Catalog',
    meta: { layout: 'Main' },
    component: () => import('@/views/Catalog.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
