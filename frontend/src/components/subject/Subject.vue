<script setup>
import { onMounted, ref, computed, watch, defineProps, toRef } from 'vue';
import { usePopups } from '../../store/popups';
import { useWeek } from '../../store/userWeek';

const edit_subject_popup = usePopups().editSubjectPopup;

const props = defineProps(['subjectObject']);


const week_store = useWeek();

console.log('Subject Object from Store: ', week_store.getSubject(props.subjectObject.day.toLowerCase(), props.subjectObject)); // Testing

const subjectColor = week_store.getSubject(props.subjectObject.day.toLowerCase(), props.subjectObject)['color'];

// Format strings with spaces
const formatSpaces = (string) => {
    let new_string = string.includes(' ') ? string.replace(' ', '_') : string;
    return new_string.toLowerCase();
}

</script>
<template>
    <div class="subject rounded-md"
        :class="`${formatSpaces(props.subjectObject.name)} subject_starts-${props.subjectObject.starts} subject_duration-${props.subjectObject.duration}`"
        :style="{ backgroundColor: props.subjectObject.color, borderColor: props.subjectObject.color }">
        <div class="subject-container flex flex-col items-start gap-1 relative p-[5px] md:p-[10px]">
            <div class="subject-name">
                <p class="hidden md:inline">{{ props.subjectObject.name }}</p>
            </div>
            <div class="subject-time px-2 py-1 bg-[rgba(255,255,255,0.2)] rounded-md hidden md:inline-block">
                <p class="text-white">{{ `${parseInt(props.subjectObject.starts.split('_')[0]) < 10 ? '0' +
                    props.subjectObject.starts.split('_')[0] : props.subjectObject.starts.split('_')[0]
                    }:${parseInt(props.subjectObject.starts.split('_')[1]) < 10 ? '0' +
                        props.subjectObject.starts.split('_')[1] : props.subjectObject.starts.split('_')[1]}` }}</p>
            </div>
            <div class="subject-menu absolute top-[5px] right-[5px]"
                @click="edit_subject_popup.editSubjectOpen(props.subjectObject)">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM5 12C6.10457 12 7 11.1046 7 10C7 8.89543 6.10457 8 5 8C3.89543 8 3 8.89543 3 10C3 11.1046 3.89543 12 5 12ZM10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12ZM17 10C17 11.1046 16.1046 12 15 12C13.8954 12 13 11.1046 13 10C13 8.89543 13.8954 8 15 8C16.1046 8 17 8.89543 17 10Z"
                        fill="white" />
                </svg>
            </div>
        </div>
    </div>
</template>