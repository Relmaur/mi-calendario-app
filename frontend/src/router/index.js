import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import Home from '../views/Home.vue';
import Settings from '../views/Settings.vue';

/*===== Without js-cookies =====*/
// function getCookie(name) {

//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);

//     if (parts.length === 2) return parts.pop().split(';').shift();

//     return null;
// }

function isAuthenticated() {

    // const token = getCookie('accessToken');

    // With js-cookies
    
    // TODO: Not checking token expiration: need to check token expiration
    const token = Cookies.get('accessToken') ?? Cookies.get('refreshToken');

    // return false;
    // return true;
    return token;

}

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                window.location.href = import.meta.env.VITE_LOGIN_URL ?? 'http://localhost:4321/login';
            }
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        beforeEnter: (to, from, next) => {
            if (isAuthenticated()) {
                next();
            } else {
                window.location.href = import.meta.env.VITE_LOGIN_URL ?? 'http://localhost:4321/login';
            }
        }
    }
    // Other Routes...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;