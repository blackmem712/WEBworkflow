import { createRouter, createWebHashHistory } from 'vue-router'; // Importar createRouter e createWebHashHistory do Vue Router

import Home from '../views/Home.vue';
import CadEquipamento from '../views/CadEquipamento.vue';

const routes = [
  {
    path: '/',
    name: 'home-main',
    component: Home,

  },
  {
    path: '/cadastro',
    name: 'cad-equip',
    component: CadEquipamento,
   

  }
];

const router = createRouter({
  history: createWebHashHistory(), // Usar createWebHashHistory para o modo de hash
  routes
});

export default router;

