<script setup>
// Deps
import { ref, onMounted, computed, watch } from 'vue';
import _ from 'lodash';

/* GraphQL */
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

// Components
import Subject from '../../../components/subject/Subject.vue';

// Stores
import { useWeek } from '../../../store/userWeek.js'; // Pinia Store    
import { useMainApp } from '../../../store/mainApp.js'; // Pinia Store    
import { useCookies } from '../../../store/cookies.js'; // Pinia Store

/* Java Backend */
// const tkn = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtbGl6YXJkbyIsImlhdCI6MTcwMDc3NzY5MCwiZXhwIjoxNzAwODY0MDkwfQ.q7txz12Y2yjWKMAoESuXvLhi3iaOsfgT1Ft8z_bKQ38';
const cookies = useCookies();
const tkn = useCookies().getToken();
const GET_USER_WEEK_URL_JAVA = `http://192.168.1.31:8080/api/v1/schedules/by-user`;

let week_store = useWeek();
let userWeek = week_store.getWeek();
let main_app = useMainApp();

let active_schedule = main_app.getActiveSchedule();
let active_week = ref(week_store.getWeek());

watch(active_schedule, (newVal) => {

    console.log('(updated) This is the new value: ', newVal); // Testing
    active_week.value = JSON.parse(main_app.getWeekbySchedule(newVal));
    
});

/* Lifecycle Hooks */
onMounted(() => {
    console.log('(on Mount) This is the previous value: ', active_schedule.value); // Testin
    // console.log('This is the selected week: ', JSON.parse(main_app.getWeekbySchedule(active_schedule.value))); // Testing
    

    /*
       ===============
          Node Backend
       ===============
    */
   // Don' need to fetch anythin' just yet, all data is being pulled from App.vue

    /*
       ===============
          Java Backend
       ===============
    */
    // let db_week = fetch(GET_USER_WEEK_URL_JAVA, {
    //     method: 'GET',

    //     // For Java backend
    //     headers: {
    //         'Authorization': `Bearer ${tkn}`,
    //     }
    // });
    // db_week.then((response) => {


    //     // console.log('Node response is: ', response.json()); // Node backend testing

    //     // This parses the weird format the response comes in 
    //     return response.json();

    // }).then((data) => {

    //     let incoming_week_subjects = data.week ?? [];
    //     let incoming_week_subject_object = {
    //         'sunday': [],
    //         'monday': [],
    //         'tuesday': [],
    //         'wednesday': [],
    //         'thursday': [],
    //         'friday': [],
    //         'saturday': [],
    //     };

    //     incoming_week_subjects.forEach(day => {
    //         console.log(day); // Testing 
    //         let day_name = day.day.toLowerCase();
    //         incoming_week_subject_object[day_name] = day.subjects;

    //         // console.log(day_name)
    //         day.subjects.forEach(subject => {
    //             week_store.addSubject(day_name, subject)
    //         });
    //     });

    //     week_store.updateWeek(incoming_week_subject_object);

    //     // /* Update Pinia Store */
    //     // week_store.updateWeek(week_subjects);

    //     // /* Apparently, Vue's v-for unwraps the ref() properties sot that it makes their .value property available... So instead of doing: userWeek.value['sunday'] you just type userWeek['sunday'] */
    //     // localStorage.setItem('week', JSON.stringify(incoming_week_subject_object));

    // }).catch(error => {

    //     console.log('Something went wrong with the data fetchin, the error is: ', error);
    //     // console.log('Hello from the catch block: ', week_store.getWeek()); // Testing

    // });
});


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