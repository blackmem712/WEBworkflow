import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import CadEquipamento from '../views/CadEquipamento.vue'

const routes = [
  {
    path: '/',
    name: 'home-main',
    component: Home
  },
  {
    path: '/cadastro',
    name: 'cad-equip',
    component: CadEquipamento
  }

  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
