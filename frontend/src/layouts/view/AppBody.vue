<script setup>
import ScheduleView from './schedule/ScheduleView.vue';
import CalendarView from './calendar/CalendarView.vue'

// Global State Management (for alternating the app views)
import { store } from '../../store/store.js';

</script>
<template>
    <!-- <transition name="fade">
        <calendar-view v-show="store.activeTab === 'calendar'"/>
    </transition>
    <transition name="fade">
        <schedule-view v-show="store.activeTab === 'schedule'"/>
    </transition> -->
    <calendar-view v-show="store.activeTab === 'calendar'"/>
    <schedule-view v-show="store.activeTab === 'schedule'"/>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 100ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>