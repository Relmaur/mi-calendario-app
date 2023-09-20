<script setup>
import ScheduleView from './schedule/ScheduleView.vue';
import CalendarView from './calendar/CalendarView.vue'

// Global State Management (for alternating the app views)
import { useTabs } from '../../store/tabs.js';
// import { store } from '../../store/tabs.js';
const tabs = useTabs();

</script>
<template>
    <!-- <transition name="fade">
        <calendar-view v-show="store.activeTab === 'calendar'"/>
    </transition>
    <transition name="fade">
        <schedule-view v-show="store.activeTab === 'schedule'"/>
    </transition> -->
    <calendar-view v-show="tabs.getActiveTab() === 'calendar'"/>
    <schedule-view v-show="tabs.getActiveTab() === 'schedule'"/>
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