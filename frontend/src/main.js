import { createApp, watch } from 'vue'
// import './style.css'
import './styles/main.scss';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue);
app.use(pinia);

app.mount('#app');

