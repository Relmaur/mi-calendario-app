<script setup>
/* Deps */
import { onMounted, onUnmounted, watch } from 'vue';
import { gsap } from 'gsap';

/* Stores */
import { usePopups } from '../../../store/popups.js';
const toast_data = usePopups().toastPopup.getToastData();

/* Animations */
const toast_entry_timeLine = gsap.timeline({});
const toast_leave_timeLine = gsap.timeline({});

onMounted(() => {

    /* Animations */
    toast_entry_timeLine
        .fromTo('.toast-container', {
            bottom: '100px',
            opacity: 0
        }, {
            opacity: 1,
            bottom: '15px',
            duration: 1.5,
            ease: 'expo.out'
        });
});

const handleToastClick = () => {
    toast_leave_timeLine
        .to('.toast-container', {
            opacity: 0,
            bottom: '100px',
            duration: 1.5,
            ease: 'expo.out',
            onComplete: () => {
                usePopups().toastPopup.closeToast();
            }
        }).play();
}

</script>
<template>
    <div class="toast-container border border-general_gray_2 flex items-center gap-3 " @click="handleToastClick">
        <div class="icon p-[15px] " :class="[toast_data.type === 'success' ? 'bg-general_green_2' : toast_data.type === 'failure' ? 'bg-red-500' : '']">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-white"
                v-if="toast_data.type === 'success'">
                <path fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clip-rule="evenodd" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-12 h-12 text-white"
                v-if="toast_data.type === 'failure'">
                <path fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd" />
            </svg>

        </div>
        <div class="text px-[10px]">
            <p>{{ toast_data.message }}</p>
        </div>
    </div>
</template>