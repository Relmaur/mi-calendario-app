<script setup>
import { ref } from 'vue';
import { onMounted, onBeforeMount } from 'vue';
import Subject from '../../../components/subject/Subject.vue';
import { useWeek } from '../../../store/userWeek.js'; // Global State Management

let week_store = useWeek();
let local_storage_week = localStorage.getItem('week') ? JSON.parse(localStorage.getItem('week')) : week_store.getWeek();
let userWeek = ref({});
userWeek.value = local_storage_week;

// console.log('Local Storage: ', localStorage.getItem('week')); // Testing 
// console.log('Local Storage (parsed): ', JSON.parse(JSON.parse(localStorage.getItem('week')))); // Testing

/* Lifecycle Hooks */
onMounted(() => {

    let db_week = fetch('http://localhost:3000/user_week', {
        method: 'GET',
    });
    db_week.then((response) => {
        // This parses the weird format the response comes in
        return response.json();

    }).then((data) => {

        /* Parse response data into a good ol', usable object notation */
        let week_subjects = JSON.parse(data.data[0].user_week);
        // console.log('The data object is this: ', data.data[0].user_week); // Testing

        /* Update Pinia Store */
        week_store.updateWeek(week_subjects);
        /* Update component value */
        userWeek.value = week_subjects;
        // console.log('The store is: ', week_store.getWeek()); // Testing
        // console.log('The new user week ref is: ', userWeek); // Testing 

        /* Apparently, Vue's v-for unwraps the ref() properties sot that it makes their .value property available... So instead of doing: userWeek.value['sunday'] you just type userWeek['sunday'] */

        localStorage.setItem('userId', JSON.stringify(data.data[0].id));
        localStorage.setItem('week', JSON.stringify(data.data[0].user_week));

    }).catch(error => {

        console.log('Something went wrong with the data fetchin');
        // console.log('Hello from the catch block: ', week_store.getWeek()); // Testing
        
    });
})


</script>
<template>
    <div class="table-container">
        <div class="day-1 sunday">
            <div class="subject-wrapper" v-for="subject in userWeek['sunday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
        <div class="day-2 monday">
            <div class="subject-wrapper" v-for="subject in userWeek['monday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
        <div class="day-3 tuesday">
            <div class="subject-wrapper" v-for="subject in userWeek['tuesday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
        <div class="day-4 wednesday">
            <div class="subject-wrapper" v-for="subject in userWeek['wednesday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
        <div class="day-5 thursday">
            <div class="subject-wrapper" v-for="subject in userWeek['thursday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
        <div class="day-6 friday">
            <div class="subject-wrapper" v-for="subject in userWeek['friday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
        <div class="day-7 saturday">
            <div class="subject-wrapper" v-for="subject in userWeek['saturday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration"
                    :assignedColor="subject.color" />
            </div>
        </div>
    </div>
</template>