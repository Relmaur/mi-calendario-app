import { createApp } from 'vue'
// import './style.css'
import './styles/main.scss';
import App from './App.vue'
import PrimeVue from 'primevue/config';

const app = createApp(App);

app.use(PrimeVue)
app.mount('#app')

