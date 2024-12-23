import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAuthStore } from './stores/auth.store'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { Toaster } from 'sonner'
/*App Creation*/
const app = createApp(App)

/*prime vue use*/
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

// Use VueQueryPlugin

app.use(VueQueryPlugin)

// Pinia initialization with persisted state plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Initialize the auth store and permissions after registering Pinia
const authStore = useAuthStore()
authStore.initializePermissions()
/*router use*/
app.use(router)
/*Sonner*/
app.component(Toaster)
app.mount('#app')
