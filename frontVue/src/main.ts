import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/js-cookie'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

import router from '@/router/index'

const app = createApp(App)
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);
app.use(router);

app.mount('#app')
