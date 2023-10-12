import { defineStore } from "pinia";
import { ref } from 'vue';

export const useMainApp = defineStore('mainApp', () => {

    const isSidebarOpen = ref(true);
    const selected_day = ref(null);

    const openSelected = (day) => {
        selected_day.value = day;
    }
    const closeSelected = () => {
        selected_day.value = '';
        console.log('I got clicked!')
    }

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
    const isOpened = () => {
        return isSidebarOpen.value;
    }

    return { isSidebarOpen, toggleSidebar, isOpened, openSelected, closeSelected, selected_day }

});