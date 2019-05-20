import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Log from './components/Log.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/log',
      name: 'log',
      component: Log
    },
    {
      path: '*',
      redirect: '/log'
    }
    
    
  ]
})
