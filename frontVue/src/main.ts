import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { Vue } from 'vue';
import { VueCookies } from 'vue-cookies';
// import '@types/node';

import App from './App.vue'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import router from '@/router/index'



// Vue.use(VueCookies);

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueCookies);

app.mount('#app')
