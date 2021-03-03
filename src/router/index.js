import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login';
import LayoutAuth from '@/layouts/Auth';
import Register from '@/views/Register';
import VerifyEmail from '@/views/VerifyEmail';
import ForgotPassword from '@/views/ForgotPassword';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login', component: LayoutAuth,
    children: [
      { path: '', name: 'login', component: Login },
    ],
  },
  {
    path: '/registrar', component: LayoutAuth,
    children: [
      { path: '', name: 'register', component: Register },
    ],
  },
  {
    path: '/verificar-email', component: LayoutAuth,
    children: [
      { path: '', name: 'verifyEmail', component: VerifyEmail },
    ],
  },
  {
    path: '/recuperar-senha', component: LayoutAuth,
    children: [
      { path: '', name: 'forgotPassword', component: ForgotPassword },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
