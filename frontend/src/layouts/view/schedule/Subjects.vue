<script setup>
// Deps
import { onMounted, ref, watch } from 'vue';
import _ from 'lodash';

// Components
import Subject from '../../../components/subject/Subject.vue';

// Stores
import { useWeek } from '../../../store/userWeek.js'; // Pinia Store
import { useMainApp } from '../../../store/mainApp.js'; // Pinia Store

let week_store = useWeek();
let main_app = useMainApp();

const active_week = ref(week_store.getWeek().value);

watch(
    () => week_store.getWeek().value,
    (newWeek) => { active_week.value = newWeek; }
);


</script>
<template>
    <div class="table-container">
        <div class="day-1 sunday" :class="main_app.getSelected().value === 'sunday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['sunday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-2 monday" :class="main_app.getSelected().value === 'monday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['monday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-3 tuesday" :class="main_app.getSelected().value === 'tuesday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['tuesday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-4 wednesday" :class="main_app.getSelected().value === 'wednesday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['wednesday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-5 thursday" :class="main_app.getSelected().value === 'thursday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['thursday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-6 friday" :class="main_app.getSelected().value === 'friday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['friday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-7 saturday" :class="main_app.getSelected().value === 'saturday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in active_week['saturday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
    </div>
</template>