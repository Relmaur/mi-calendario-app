import { createApp } from 'vue';

import './styles/main.scss';
import App from './App.vue';
import router from './router/index.js';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';

/* Custom Directives */
import clickOutside from './directives/click-outside.js';

import apolloClient from './apolloClient.js';
import { provideApolloClient } from '@vue/apollo-composable';

const app = createApp(App);

provideApolloClient(apolloClient)

const pinia = createPinia();

app.directive('click-outside', clickOutside)

app.use(PrimeVue);
app.use(pinia);
app.use(router);

app.mount('#app');

