import { defineStore } from "pinia";
import { ref } from 'vue';

export const useMainApp = defineStore('mainApp', () => {

    const isSidebarOpen = ref(true);

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
    const isOpened = () => {
        return isSidebarOpen.value;
    }

    return { isSidebarOpen, toggleSidebar, isOpened}

});