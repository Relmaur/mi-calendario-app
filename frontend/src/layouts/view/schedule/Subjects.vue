<script setup>
// Deps
import { ref, onMounted, computed, watch } from 'vue';

// Components
import Subject from '../../../components/subject/Subject.vue';

// Stores
import { useWeek } from '../../../store/userWeek.js'; // Pinia Store    
import { useMainApp } from '../../../store/mainApp.js'; // Pinia Store    

const USER_ID = 1;
const GET_USER_WEEK_SUBJECTS = `http://localhost:3000/api/users/${USER_ID}/week`;

let week_store = useWeek();
let userWeek = week_store.getWeek();
let main_app = useMainApp();

const getTimeInMinutes = timeStr => {
    const [hours, minutes] = timeStr.split('_').map(Number);
    return hours * 60 + minutes;
}
const subjectsOverlap = (start1, duration1, start2, duration2) => {

    const start1InMinutes = getTimeInMinutes(start1);
    const end1InMinutes = start1InMinutes + getTimeInMinutes(duration1);

    const start2InMinutes = getTimeInMinutes(start2);
    const end2InMinutes = start2InMinutes + getTimeInMinutes(duration2);

    return !(end1InMinutes <= start2InMinutes || end2InMinutes <= start1InMinutes);
}
// /* Check for overlapping subjects */
for (let day in userWeek) {

    /* For the array userWeek[day], of length n, we need iterate subsequent pair of items (starting from the first and the second) i, i+1, until we have the pair n-1, n (the second-to-last and the last)*/
    userWeek[day].forEach((subject, index, array) => {
        console.log(array)

        /* For this, we need to make sure we're not taking the pair n, n+1, since n+1 would be undefined */
        if (index < array.length - 1) {

            /* Once we're sure we're inside of the limits userWeek[day] poses, we extract the pair of items, -starting from the first item (i=0)- i, i+1... We use slice to get subarrays for this two items (that's why we say index, index + 2), and then we assign them using the destructuring assignment*/
            let [subject_1, subject_2] = array.slice(index, index + 2);

            // console.log('Subject 1: ', subject_1); // Testing
            // console.log('Subject 2: ', subject_2); // Testing

            // console.log('Subject 1 starts: ', subject_1.starts); // Testing
            // console.log('Subject 2 starts: ', subject_2.starts); // Testing
            
            /* Once we get a hold of that pair of items, which represent subjects in a given weekday, then we compare them using the subjectsOverlap helper function to see if they overlap... Then we can do all kinds of neat stuff with this data. */
            if (subjectsOverlap(subject_1.starts, subject_1.duration, subject_2.starts, subject_2.duration)) {
                console.log('There are overlapping subjects!')
            }
        }
    });
}

/* Use this to test reactivity */
// watch(userWeek, (newVal) => {
//     console.log('something changed: ', newVal);
// })

/* Lifecycle Hooks */
onMounted(() => {

    // console.log('The store is: ', week_store.getWeek()); // Testing

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
        <div class="day-1 sunday" :class="main_app.selected_day === 'sunday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['sunday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-2 monday" :class="main_app.selected_day === 'monday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['monday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-3 tuesday" :class="main_app.selected_day === 'tuesday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['tuesday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-4 wednesday" :class="main_app.selected_day === 'wednesday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['wednesday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-5 thursday" :class="main_app.selected_day === 'thursday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['thursday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-6 friday" :class="main_app.selected_day === 'friday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['friday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
        <div class="day-7 saturday" :class="main_app.selected_day === 'saturday' ? ' selected' : ''">
            <div class="subject-wrapper" v-for="subject in userWeek['saturday']" :key="subject.id">
                <subject :subjectObject="subject" />
            </div>
        </div>
    </div>
</template>