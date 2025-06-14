import { createRouter, createWebHistory } from 'vue-router'
import LayoutDefault from '@/layouts/LayoutsDefault.vue'
import store from '@/store'

// suas views
import Home from '@/views/Home.vue'
import CadEquipamento from '@/views/CadEquipamento.vue'
import ConCliente from '@/views/ConCliente.vue'
 // importe o componente certo

const routes = [
  {
    path: '/',
    component: LayoutDefault,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: 'consultarCliente',
        name: 'Consultar-cliente',
        component: ConCliente
      },
     
      {
        path: 'cadastro',
        name: 'cad-equip',
        component: CadEquipamento,
        beforeEnter: (to, from, next) => {
          store.dispatch('clearCliente')
          next()
        }
      }
    ]
  },
  // opcional: rota “catch-all” para 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
