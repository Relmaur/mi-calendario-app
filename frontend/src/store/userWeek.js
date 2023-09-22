import { defineStore } from "pinia";
import { ref } from 'vue';
import _ from 'lodash';

export const useWeek = defineStore("userWeek", () => {
    const WEEK = ref(
        {
            'sunday': [
                // {
                //     'name': 'Algebra',
                //     'starts': '6_0',
                //     'duration': '2_0',
                //     'color': '#FF8C19'
                // },
                // {
                //     'name': 'Calculus',
                //     'starts': '9_0',
                //     'duration': '2_0',
                //     'color': '#FF8C19'
                // },
            ],
            'monday': [
                // {
                //     'name': 'Calculus',
                //     'starts': '7_0',
                //     'duration': '3_0',
                //     'color': '#D36B00'
                // },
                // {
                //     'name': 'Calculus',
                //     'starts': '7_0',
                //     'duration': '3_0',
                //     'color': '#D36B00'
                // },
            ],
            'tuesday': [
                // {
                //     'name': 'Educacion Fisica',
                //     'starts': '20_0',
                //     'duration': '4_0',
                //     'color': '#00A2D4'
                // },
                // {
                //     'name': 'Español',
                //     'starts': '10_0',
                //     'duration': '2_0',
                //     'color': 'salmon'
                // },
            ],
            'wednesday': [],
            'thursday': [
                // {
                //     'name': 'Español',
                //     'starts': '10_0',
                //     'duration': '2_0',
                //     'color': 'salmon'
                // },
            ],
            'friday': [],
            'saturday': [],
        }
    );
    const addSubject = (day, subject) => {
        WEEK.value[day].push(subject);
    }
    const updateSubject = (day, subject) => {

        // console.log('updateSubject day: ', day);
        // console.log('updateSubject subject: ', subject);
        // console.log('Week from Pinia: ', week);

        let foundIndex = _.findIndex(WEEK.value[day], {id: subject.id });

        // console.log('Found Subject', foundSubject);

        if(foundIndex !== -1) {
            WEEK.value[day][foundIndex] = {...WEEK.value[day][foundIndex], ...subject}
        }

        console.log(foundIndex)

        // console.log('From Piniaz', WEEK.value[day]);

        // let foundSubject = WEEK.value[day].find(subj => {
        //     return subj.id == subject.id;
        // });
        // if(foundSubject) {
        //     foundSubject.raw = subject.raw;
        //     foundSubject.name = subject.name;
        //     foundSubject.starts = subject.starts;
        //     foundSubject.duration = subject.duration;
        //     foundSubject.color = subject.color;
        //     foundSubject.info = subject.info;
        //     foundSubject.info_delta = subject.info_delta;
        // }
    }
    const getWeek = () => {
        return WEEK.value;
    }
    const updateWeek = (new_week) => {
        WEEK.value = new_week;
    } 

    return { WEEK, addSubject, getWeek, updateWeek, updateSubject}
    
});
