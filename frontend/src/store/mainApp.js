import { defineStore } from "pinia";
import { ref } from 'vue';

export const useMainApp = defineStore('mainApp', () => {

    const isSidebarOpen = ref(true);
    const selected_day = ref(null);
    const isDaySubjectsOpen = ref(false);

    const openSelected = (day) => {
        selected_day.value = day;
        // console.log('The selected day is: ',selected_day.value) // Testing
    }
    const openDaySubjects = () => {
        isDaySubjectsOpen.value = true;
    }
    const closeSelected = () => {
        selected_day.value = '';
    }
    const getSelected = () => {
        return selected_day.value;
    }

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
    const isOpened = () => {
        return isSidebarOpen.value;
    }

    return { isSidebarOpen, toggleSidebar, isOpened, isDaySubjectsOpen, openSelected, closeSelected, selected_day, getSelected, openDaySubjects }

});