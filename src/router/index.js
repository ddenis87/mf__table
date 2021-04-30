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
    path: '/TablesPage',
    name: 'TablesPage',
    meta: { layout: 'Main' },
    component: () => import('@/views/TablesPage.vue'),
  },
  {
    path: '/Test',
    name: 'Test',
    meta: { layout: 'Main' },
    component: () => import('@/views/Test.vue'),
  },
  {
    path: '/SpreadSheet',
    name: 'SpreadSheet',
    meta: { layout: 'Main' },
    component: () => import('@/views/SpreadSheet.vue'),
  },
  {
    path: '/SpreadSheetPrint',
    name: 'SpreadSheetPrint',
    meta: { layout: 'Print' },
    component: () => import('@/views/SpreadSheet.vue'),
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
