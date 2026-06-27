import { defineStore } from "pinia";
import { ref } from 'vue';

export const useMainApp = defineStore('mainApp', () => {

    const user = ref({});
    const userSchedules = ref([]);
    const isSidebarOpen = ref(true);
    const selected_day = ref(null);
    const isDaySubjectsOpen = ref(false);
    const activeSchedule = ref(localStorage.getItem('activeSchedule') || '1');

    // Schedules and users
    const setUser = (user_object) => {
        user.value = user_object;
    }
    const getUser = () => {
        return user;
    }
    const setSchedules = (schedules) => {
        userSchedules.value = schedules;
    }
    const getSchedules = () => {
        return userSchedules;
    }
    const addSchedule = (schedule) => {
        userSchedules.value.push(schedule);
    }
    const setActiveSchedule = (scheduleId) => {
        activeSchedule.value = scheduleId;
        localStorage.setItem('activeSchedule', scheduleId);
    }
    const getActiveSchedule = () => {
        return activeSchedule;
    }
    const getWeekbySchedule = (scheduleId) => {
        const schedule = userSchedules.value.find(schedule => String(schedule.id) === String(scheduleId));
        return schedule?.week ?? null;
    }

    const openSelected = (day) => {
        selected_day.value = day;
        // console.log('The selected day is: ',selected_day.value) // Testing
    }
    const openDaySubjects = () => {
        isDaySubjectsOpen.value = true;
    }
    const closeSelected = () => {
        selected_day.value = null;
    }
    const getSelected = () => {
        return selected_day;
    }
    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value;
    }
    const isOpened = () => {
        return isSidebarOpen.value;
    }

    return { setUser, getUser, user, userSchedules, isSidebarOpen, setSchedules, getSchedules, addSchedule, setActiveSchedule, getActiveSchedule, getWeekbySchedule, activeSchedule, toggleSidebar, isOpened, isDaySubjectsOpen, openSelected, closeSelected, selected_day, getSelected, openDaySubjects }

});