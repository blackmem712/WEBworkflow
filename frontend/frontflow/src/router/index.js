import { createRouter, createWebHashHistory } from 'vue-router'; // Importar createRouter e createWebHashHistory do Vue Router
import store from '@/store';
import Home from '../views/Home.vue';
import CadEquipamento from '../views/CadEquipamento.vue';
import ConCliente from '../views/ConCliente.vue';

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
    beforeEnter: (to, from, next) => {
      // Agora você pode chamar a ação clearCliente usando o store importado
      store.dispatch('clearCliente');
     
      next();
    }
   

  },
  {
    path: '/consultarCliente',
    name: 'Consultar-cliente',
    component: ConCliente,
   

  }
];

const router = createRouter({
  history: createWebHashHistory(), // Usar createWebHashHistory para o modo de hash
  routes
});

export default router;

