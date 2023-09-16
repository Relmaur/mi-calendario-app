<script setup>
import { ref } from 'vue';
// Date Pickers
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const time = ref({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
});

const props = defineProps(['subjectName', 'subjectStarts', 'subjectDuration', 'assignedColor']);

const formatTime = () => {

}

// Format strings with spaces
const formatSpaces = (string) => {
    let new_string = string.includes(' ') ? string.replace(' ', '_') : string;
    return new_string.toLowerCase();
}

let subjectClasses = `${formatSpaces(props.subjectName)} subject_starts-${props.subjectStarts} subject_duration-${props.subjectDuration}`;

</script>
<template>
    <div class="subject" :class="subjectClasses" :style="{backgroundColor: props.assignedColor, borderColor: props.assignedColor}">
        <div class="subject-container">
            <div class="subject-name">
                <p>{{props.subjectName}}</p>
            </div>
            <!-- <vue-date-picker v-model="time" time-picker></vue-date-picker> -->
            <!-- <p>{{ time.hours }}</p> -->
            <div class="subject-menu"> 
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM5 12C6.10457 12 7 11.1046 7 10C7 8.89543 6.10457 8 5 8C3.89543 8 3 8.89543 3 10C3 11.1046 3.89543 12 5 12ZM10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12ZM17 10C17 11.1046 16.1046 12 15 12C13.8954 12 13 11.1046 13 10C13 8.89543 13.8954 8 15 8C16.1046 8 17 8.89543 17 10Z"
                        fill="white" />
                </svg>
            </div>
        </div>
    </div>
</template>