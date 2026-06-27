<script setup>

import { ref, watch } from 'vue';
import { useMainApp } from '../store/mainApp.js';
import { useCookies } from '../store/cookies.js';
import { usePopups } from '../store/popups.js';
import { useWeek } from '../store/userWeek.js';

import NavigationTabs from './NavigationTabs.vue';

const cookies = useCookies();
const main_app = useMainApp();
const userWeek = useWeek();
const settings_menu = usePopups().settingsMenu;
const schedules = main_app.getSchedules();

const userSession = ref({})
userSession.value = cookies.getUserSession();

const userName = userSession.value.userName;

let menuOpened = ref(true);

const menu_toggler = () => {

    main_app.toggleSidebar();
    menuOpened.value = !menuOpened.value;
}

const switchSchedule = (schedule) => {
    main_app.setActiveSchedule(schedule.id);
    userWeek.updateWeek(JSON.parse(schedule.week));
    console.log('This is the schedule: ', schedule);
};

</script>

<template>
    <div class="search-bar-and-user">

        <navigation-tabs :is_mobile="true" />

        <div class="toggle-sidebar-and-schedule-tabs">
            <div class="close-sidebar hidden lg:block p-1 border self-center rounded-md hover:cursor-pointer"
                :class="menuOpened ? 'border-general_green_3' : 'border-general_gray_2'" @click="menu_toggler">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"  
                    stroke="currentColor" class="w-7 h-7 flex justify-center items-center"
                    :class="menuOpened ? 'text-general_blue_1' : 'text-black'">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </div>
            <div class="schedule-tabs">

                <div class="schedule-tab hover:cursor-pointer" v-for="schedule in schedules"
                    :class="{ 'active': main_app.getActiveSchedule().value === schedule.id }"
                    @click="switchSchedule(schedule)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        class="w-8 h-8 text-general_green_1 borderborder-general_green_1 group-hover/schedule:scale-105">
                        <path
                            d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                        <path
                            d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                        <path
                            d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                    </svg>
                    <p>{{ schedule.title }}</p>
                </div>
            </div>
            <div class="add-schedule p-[2px] border border-general_gray_2 rounded-md hover:cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd"
                        d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                        clip-rule="evenodd" />
                </svg>
            </div>

        </div>

        <div class="search-and-user flex justify-end w-auto gap-5">
            <div
                class="search flex justify-between items-center gap-2 px-2 py-1 border border-general_gray_2 rounded-lg self-center hover:cursor-pointer">
                <div class="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <p class="text-md lg:text-md">Search</p>
            </div>
            <div class="user flex items-center justify-center gap-3">
                <div class="user-name flex items-center justify-center gap-2 hover:cursor-pointer">
                    <p class="text-general_gray_2 font-[500]" v-text="userName"></p>
                </div>
                <div class="user-image relative group/user_image" @click="settings_menu.toggleSettings()">
                    <div
                        class="settings-icon absolute z-[999] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center transition group-hover/user_image:backdrop-brightness-75">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-8 h-8 text-white opacity-0 transition rotate-12 group-hover/user_image:opacity-100 group-hover/user_image:rotate-0">
                            <path fill-rule="evenodd"
                                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <img src="../assets/img/user-pic.png" alt="User Image" class="">
                </div>
            </div>

        </div>
    </div>
</template>