import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import CadEquipamento from '../views/CadEquipamento.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
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
})

export default router
