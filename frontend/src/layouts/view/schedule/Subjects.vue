<script setup>
import Subject from '../../../components/subject/Subject.vue';


const week = {
    'sunday': {
        'subject-1': {
            'name': 'Algebra',
            'starts': '6_0',
            'duration': '2_0',
            'color': '#FF8C19'
        },
        'subject-2': {
            'name': 'Calculus',
            'starts': '9_0',
            'duration': '2_0',
            'color': '#FF8C19'
        },
    },
    'monday': {
        'subject-1': {
            'name': 'Calculus',
            'starts': '7_0',
            'duration': '3_0',
            'color': '#D36B00'
        },
        'subject-1': {
            'name': 'Calculus',
            'starts': '7_0',
            'duration': '3_0',
            'color': '#D36B00'
        },
    },
    'tuesday': {
        'subject-1': {
            'name': 'Educacion Fisica',
            'starts': '20_0',
            'duration': '4_0',
            'color': '#00A2D4'
        },
    },
    'wednesday': {},
    'thursday': {},
    'friday': {},
    'saturday': {},
}

</script>
<template>
    <div class="table-container">
        <div class="day-1 sunday">
            <div class="subject-wrapper" v-for="subject in week['sunday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-2 monday">
            <subject subjectName="Calculus" subjectStarts="7_0" subjectDuration="3_0" assignedColor="#D36B00" />
        </div>
        <div class="day-3 tuesday">
            <subject subjectName="Educacion Fisica" subjectStarts="20_0" subjectDuration="4_0" assignedColor="#00A2D4" />
        </div>
        <div class="day-4 wednesday"></div>
        <div class="day-5 thursday"></div>
        <div class="day-6 friday"></div>
        <div class="day-7 saturday"></div>
    </div>
</template>