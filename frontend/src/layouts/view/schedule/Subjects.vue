<script setup>
import Subject from '../../../components/subject/Subject.vue';
import { useWeek } from '../../../store/userWeek.js'; // Global State Management


const week = useWeek().getWeek();

</script>
<template>
    <div class="table-container">
        <div class="day-1 sunday">
            <div class="subject-wrapper" v-for="subject in week['sunday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-2 monday">
            <div class="subject-wrapper" v-for="subject in week['monday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-3 tuesday">
            <div class="subject-wrapper" v-for="subject in week['tuesday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-4 wednesday">
            <div class="subject-wrapper" v-for="subject in week['wednesday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-5 thursday">
            <div class="subject-wrapper" v-for="subject in week['thursday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-6 friday">
            <div class="subject-wrapper" v-for="subject in week['friday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
        <div class="day-7 saturday">
            <div class="subject-wrapper" v-for="subject in week['saturday']">
                <subject :subjectName="subject.name" :subjectStarts="subject.starts" :subjectDuration="subject.duration" :assignedColor="subject.color"/>
            </div>
        </div>
    </div>
</template>