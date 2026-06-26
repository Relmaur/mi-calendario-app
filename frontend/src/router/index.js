import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import Home from '../views/Home.vue';
import Settings from '../views/Settings.vue';
import Login from '../views/Login.vue';

function isAuthenticated() {
    // TODO: decode the JWT and check `exp` to also catch expired tokens
    return !!(Cookies.get('accessToken') ?? Cookies.get('refreshToken'));
}

const requireAuth = (to, from, next) => {
    if (isAuthenticated()) {
        next();
    } else {
        next({ name: 'login' });
    }
};

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        beforeEnter: (to, from, next) => {
            // Already logged in — skip the login page
            if (isAuthenticated()) {
                next({ name: 'home' });
            } else {
                next();
            }
        }
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        beforeEnter: requireAuth,
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        beforeEnter: requireAuth,
    },
    // Other Routes...
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;