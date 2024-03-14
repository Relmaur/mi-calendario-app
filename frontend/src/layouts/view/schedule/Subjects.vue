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

/* Node backend */
const USER_ID = 1;
const SCHEDULE_ID = 1;
// const GET_USER_WEEK_URL_NODE = `http://localhost:3000/api/v1/${USER_ID}/${SCHEDULE_ID}`;

/* Java Backend */
// const tkn = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtbGl6YXJkbyIsImlhdCI6MTcwMDc3NzY5MCwiZXhwIjoxNzAwODY0MDkwfQ.q7txz12Y2yjWKMAoESuXvLhi3iaOsfgT1Ft8z_bKQ38';
const cookies = useCookies();
const tkn = useCookies().getToken();
const GET_USER_WEEK_URL_JAVA = `http://192.168.1.31:8080/api/v1/schedules/by-user`;

let week_store = useWeek();
let userWeek = week_store.getWeek();
let main_app = useMainApp();

const WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// const getTimeInMinutes = timeStr => {
//     const [hours, minutes] = timeStr.split('_').map(Number);
//     return hours * 60 + minutes;
// }
// const subjectsOverlap = (start1, duration1, start2, duration2) => {

//     const start1InMinutes = getTimeInMinutes(start1);
//     const end1InMinutes = start1InMinutes + getTimeInMinutes(duration1);

//     const start2InMinutes = getTimeInMinutes(start2);
//     const end2InMinutes = start2InMinutes + getTimeInMinutes(duration2);

//     return !(end1InMinutes <= start2InMinutes || end2InMinutes <= start1InMinutes);
// }
// // /* Check for overlapping subjects */
// for (let day in userWeek) {

//     /* For the array userWeek[day], of length n, we need iterate subsequent pair of items (starting from the first and the second) i, i+1, until we have the pair n-1, n (the second-to-last and the last)*/
//     userWeek[day].forEach((subject, index, array) => {
//         console.log(array)

//         /* For this, we need to make sure we're not taking the pair n, n+1, since n+1 would be undefined */
//         if (index < array.length - 1) {

//             /* Once we're sure we're inside of the limits userWeek[day] poses, we extract the pair of items, -starting from the first item (i=0)- i, i+1... We use slice to get subarrays for this two items (that's why we say index, index + 2), and then we assign them using the destructuring assignment*/
//             let [subject_1, subject_2] = array.slice(index, index + 2);

//             // console.log('Subject 1: ', subject_1); // Testing
//             // console.log('Subject 2: ', subject_2); // Testing

//             // console.log('Subject 1 starts: ', subject_1.starts); // Testing
//             // console.log('Subject 2 starts: ', subject_2.starts); // Testing

//             /* Once we get a hold of that pair of items, which represent subjects in a given weekday, then we compare them using the subjectsOverlap helper function to see if they overlap... Then we can do all kinds of neat stuff with this data. */
//             if (subjectsOverlap(subject_1.starts, subject_1.duration, subject_2.starts, subject_2.duration)) {
//                 console.log('There are overlapping subjects!')
//             }
//         }
//     });
// }

/* Use this to test reactivity */
// watch(userWeek, (newVal) => {
//     console.log('something changed: ', newVal);
// })

/* Lifecycle Hooks */
onMounted(() => {

    /*
       ===============
          Node Backend
       ===============
    */

    const get_week_from_db = async () => {
        
        try {
            const GET_WEEK_QUERY = gql`
                query getWeek($id: ID!) {
                    week(id: $id)
                }
            `;

            const { result } = await useQuery(GET_WEEK_QUERY, {
                id: `${SCHEDULE_ID}`
            });

            console.log('This is the GraphQL week data: ', result.value); // Testing

            let incoming_week_subjects = result.value.week ?? {};

            console.log('Incoming week subjects', JSON.parse(incoming_week_subjects))

            week_store.updateWeek(JSON.parse(incoming_week_subjects));

            // for (const day in incoming_week_subjects) {
            //     week_store.addSubject(day, incoming_week_subjects[day])   
            // }

            // incoming_week_subjects.forEach(day => {

            //     // console.log(day); // Testing

            //     let day_name = day.day.toLowerCase();
            //     incoming_week_subject_object[day_name] = day.subjects;

            //     // console.log(day_name)
            //     day.subjects.forEach(subject => {
            //         week_store.addSubject(day_name, subject)
            //     });
            // });


            localStorage.setItem('week', incoming_week_subjects);

        } catch (error) {
            console.log('Something went wrong with the GraphQL data fetching, the error is: ', error);
        }
    }

    get_week_from_db();

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