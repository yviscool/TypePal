import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Particles from "@tsparticles/vue3"
import { loadSlim } from "@tsparticles/slim"
import App from './App.vue'
import 'virtual:uno.css'

// 路由配置
const routes = [
  { path: '/', name: 'Home', component: () => import('./views/Home.vue') },
  { path: '/practice/:id', name: 'Practice', component: () => import('./views/Practice.vue') },
  { path: '/library', name: 'Library', component: () => import('./views/Library.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)

// 配置 tsParticles
app.use(Particles, {
  init: async engine => {
    await loadSlim(engine)
  }
})

app.use(createPinia())
app.use(router)
app.mount('#app')