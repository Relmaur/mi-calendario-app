<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Subject from '../../../components/subject/Subject.vue';
import { useWeek } from '../../../store/userWeek.js'; // Global State Management

const USER_ID = 1;
const GET_USER_WEEK_SUBJECTS = `http://localhost:3000/api/users/${USER_ID}/week`;

let week_store = useWeek();
let userWeek = week_store.getWeek();

watch(userWeek, (newVal) => {
    console.log('something changed: ', newVal);
})

/* Lifecycle Hooks */
onMounted(() => {

    console.log('The store is: ', week_store.getWeek()); // Testing

    // let db_week = fetch(GET_USER_WEEK_SUBJECTS, {
    //     method: 'GET',
    // });
    // db_week.then((response) => {

    //     // This parses the weird format the response comes in
    //     return response.json();

    // }).then((data) => {

    //     /* Parse response data into a good ol', usable object notation */
    //     let week_subjects = JSON.parse(data.user_week);

    //     /* Update Pinia Store */
    //     week_store.updateWeek(week_subjects);
    //     /* Update component value */
    //     userWeek.value = week_subjects;

    //     /* Apparently, Vue's v-for unwraps the ref() properties sot that it makes their .value property available... So instead of doing: userWeek.value['sunday'] you just type userWeek['sunday'] */

    //     localStorage.setItem('week', JSON.stringify(week_subjects));

    // }).catch(error => {

    //     console.log('Something went wrong with the data fetchin, the error is: ', error);
    //     // console.log('Hello from the catch block: ', week_store.getWeek()); // Testing
        
    // });
});


</script>
<template>
    <div class="table-container">
        <div class="day-1 sunday">
            <div class="subject-wrapper" v-for="subject in userWeek['sunday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-2 monday">
            <div class="subject-wrapper" v-for="subject in userWeek['monday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-3 tuesday">
            <div class="subject-wrapper" v-for="subject in userWeek['tuesday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-4 wednesday">
            <div class="subject-wrapper" v-for="subject in userWeek['wednesday']" :key="subject.id">
                <subject :subjectObject="subject"/>
            </div>
        </div>
        <div class="day-5 thursday">
            <div class="subject-wrapper" v-for="subject in userWeek['thursday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-6 friday">
            <div class="subject-wrapper" v-for="subject in userWeek['friday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-7 saturday">
            <div class="subject-wrapper" v-for="subject in userWeek['saturday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
    </div>
</template>