<script setup>
// Deps
import { defineProps } from 'vue';

// Stores
import { useMainApp } from '../../store/mainApp';
import { useWeek } from '../../store/userWeek';

const main_app = useMainApp();

// Props
const props = defineProps(['day']);

// Vars
const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// Functions
const isToday = (day) => {
    const today = week[new Date().getDay()];
    return day === today;
}

const icons_classes = "w-7 h-7 text-general_blue_1 hover:text-general_blue_2";

// console.log(props.day);

</script>
<template>
    <div class="header-day-1 gap-3"
        :class="{ 'active': isToday(props.day), 'selected': main_app.selected_day === props.day }"
        @click="main_app.openSelected(props.day)">
        <h6>{{ props.day.substring(0, 3).toUpperCase() }}</h6>
        <div class="icons p-1 border border-general_green_3 rounded-md hidden md:flex justify-center items-center relative"
            v-show="main_app.selected_day === props.day">
            <!-- <div class="icon edit">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                :class="icons_classes">
                    <path
                        d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                    <path
                        d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
                </svg>
            </div> -->
            <div class="icon unselect" @click.stop="main_app.closeSelected()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" :class="icons_classes">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
            </div>
        </div>
    </div>
</template>
