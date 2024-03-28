import { defineStore } from "pinia";
import { ref, watch } from 'vue';
import _ from 'lodash';

export const useWeek = defineStore("userWeek", () => {
    
    const WEEK = ref(
    {
        'sunday': [],
        'monday': [],
        'tuesday': [],
        'wednesday': [],
        'thursday': [],
        'friday': [],
        'saturday': [],
    }
    );

    /* This gets called from the AddSubject form from ScheduleView.vue popup component */
    const addSubject = (day, subject) => {

        console.log('incoming addSubject data: ', day, subject);
        console.log('current Pinia object', WEEK.value);

        WEEK.value[day].push(subject);

    }
    /* This gets called from the EditSubject form from the EdiItem.vue component */
    const updateSubject = (day, subject) => {

        let foundIndex = _.findIndex(WEEK.value[day], { id: subject.id });

        // console.log('Found Subject Index (From Pinia)', foundIndex);

        /* If the subject's day don't change, update the subject on the same day */
        if (foundIndex !== -1) {

            WEEK.value[day][foundIndex] = { ...WEEK.value[day][foundIndex], ...subject }

        } else {
            /* If the subject's day changes, then remove the subject from the previous day, and add it on the new day */

            /* 1. Search the whole WEEK object for the subject with id of subject.id */
            for (let day_i in WEEK.value) {

                let dayIndex = _.findIndex(WEEK.value[day_i], { id: subject.id });

                if (dayIndex !== -1) {

                    /* 2. Remove the subject from its previous day */
                    _.pull(WEEK.value[day_i], WEEK.value[day_i][dayIndex]);
                }
            }

            /* Add the subject to the specified day */ 
            WEEK.value[day].push(subject);

        }
        // console.log('Sot the corresponding week day is: ', WEEK.value[day][foundIndex]);  
    }
    const deleteSubject = (day, subject) => {

        console.log('(from Pinia) incoming deletion data: ', day, subject);
        console.log('This is the week object day: ', WEEK.value[day]);

        let foundIndex = _.findIndex(WEEK.value[day], { id: subject });

        console.log('Found index: ', foundIndex);

        if (foundIndex !== -1) {
            WEEK.value[day].splice(foundIndex, 1);
        } else {
            console.log('Subject not found!');
        }
    }

    const getWeek = () => {
        return WEEK;
    }

    /* Subjects */
    const getSubject = (day, subject) => {
        let foundIndex = _.findIndex(WEEK.value[day], { id: subject.id });
        return WEEK.value[day][foundIndex];
    }
    const updateWeek = (new_week) => {
        WEEK.value = new_week;
    }
    const getDaySubjects = (day) => {
        console.log(WEEK.value[day]);
        return WEEK.value[day];
    }

    return { WEEK, addSubject, getWeek, updateWeek, updateSubject, getSubject, deleteSubject, getDaySubjects }

});
