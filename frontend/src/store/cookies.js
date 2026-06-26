import { defineStore } from 'pinia';
import { ref } from 'vue';
import Cookies from 'js-cookie';

export const useCookies = defineStore('cookies', () => {

    // User Name Cookie
    const userName = ref('');
    
    const getUserName = () => {
        return userName.value;
    }
    const setUserName = (userName) => {
        Cookies.set('userName', userName);
        userName.value = userName;
    }

    // Access token Cookie
    const token = ref('');
    const getToken = () => {
        return token.value;
    }
    const setToken = (tkn) => {
        token.value = tkn;
    }

    // Access a Cookie
    const getCookie = (cookieName) => {
        return Cookies.get(cookieName);
    }

    // Parse the URL-encoded userSession cookie into an object
    const getUserSession = () => {
        const raw = Cookies.get('userSession');
        if (!raw) return null;
        try {
            return JSON.parse(decodeURIComponent(raw));
        } catch {
            return null;
        }
    }

    /* Logout */
    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('userSession');
        token.value = '';
        userName.value = '';
        window.location.href = import.meta.env.VITE_LOGIN_URL ?? 'http://localhost:5173/login';
    }

    return { token, getToken, setToken, getCookie, getUserSession, logout }

});