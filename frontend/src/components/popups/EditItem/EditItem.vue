<script setup>
/* Deps */
import { onMounted, ref } from 'vue';
import { useForm, useField } from 'vee-validate'; // Form Helper
import * as yup from 'yup'; // Form Validation
import DOMPurify from 'dompurify'; // Sanitize HTML
import interact from 'interactjs';

/* Components */
import Calendar from 'primevue/calendar'; // Calendar
import quillEditor from 'primevue/editor'; // Editor
import FormError from '../../FormError.vue'; // Form Error

/* Store */
import { usePopups } from '../../../store/popups';
import { useWeek } from '../../../store/userWeek';
import { useSubjectsColorTheme } from '../../../store/subjectsColorTheme';
// import { useTabs } from '../../../store/tabs';

/* Refs and Stores */
const week = useWeek();
const edit_subject_popup = usePopups().editSubjectPopup;
const edit_subject_object = edit_subject_popup.getSubjectObject();
const toast = usePopups().toastPopup;

const color_picker = ref(null); // Color - Colors Picker
const color_theme = useSubjectsColorTheme().theme;
const editor_content = ref(null); // Editor - Subject Info
const editor_content_delta = ref(edit_subject_object.info_delta); // Editor - Subject Info delta

/* Props */
const props = defineProps(['subjectObject']);

/* API URLs */
const USER_ID = 1;
const PUT_USER_WEEK_URL = `http://127.0.0.1:3000/api/users/${USER_ID}/week`;

const colorPicker = () => {
    color_picker.value.click();
}

/* Vee-validate Form Context, validation and stuff' (either we use this or use Vue's ref() Reactivity API)*/
const schema = yup.object({
    subject_name: yup.string().required('Required'),
    color_picked: yup.string(),
    start_hour: yup.date().required('Required'),
    end_hour: yup.date().required('Required'),
    day: yup.date().required('Required'),
});

let starts_date_object = new Date(edit_subject_object.raw.starts);
let ends_date_object = new Date(edit_subject_object.raw.ends);
let subject_day_object = new Date(edit_subject_object.raw.day);

/* Start and end Datetimes with Trailing zeros */
// const s_hours = new Date(starts_date_object).getUTCHours() > 9 ? new Date(starts_date_object).getUTCHours() : `0${new Date(starts_date_object).getUTCHours()}`;
// const s_minutes = new Date(starts_date_object).getUTCMinutes() < 10 ? `0${new Date(starts_date_object).getUTCMinutes()}` : new Date(starts_date_object).getUTCMinutes();
// const e_hours = new Date(ends_date_object).getUTCHours() > 9 ? new Date(ends_date_object).getUTCHours() : `0${new Date(ends_date_object).getUTCHours()}`;
// const e_minutes = new Date(ends_date_object).getUTCMinutes() < 10 ? `0${new Date(ends_date_object).getUTCMinutes()}` : new Date(ends_date_object).getUTCMinutes();
// const starts = `${s_hours}:${s_minutes}`;
// const ends = `${e_hours}:${e_minutes}`;
// const starts = `${starts_date_object.getUTCHours()}:${starts_date_object.getUTCMinutes()}`;
// const ends = `${ends_date_object.getUTCHours()}:${ends_date_object.getUTCHours()}`;

const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/* These default values come from the Pinia Store */
const { values, errorBag, defineInputBinds, defineComponentBinds, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues: {
        subject_name: edit_subject_object.name,
        color_picked: edit_subject_object.color,
        start_hour: starts_date_object,
        end_hour: ends_date_object,
        day: subject_day_object,
    },
});

// Form Values (with vee-validate of course)
const subject_name = defineInputBinds('subject_name');
const color_picked = defineInputBinds('color_picked');
const start_hour = defineComponentBinds('start_hour');
const end_hour = defineComponentBinds('end_hour');
const day = defineComponentBinds('day');

/* To change the form's value externally, via a click event, in this case */
const { value: color, setValue: setColor } = useField('color_picked');

/* Handle submission */
const submitForm = handleSubmit((values) => {

    /* With vee-validate */
    let subjectName = values.subject_name;
    let subjectColor = values.color_picked;
    let subjectDay = weekdays[values.day.getDay()];
    let subjectStartHour = values.start_hour.getHours();
    let subjectStartMinutes = values.start_hour.getMinutes();
    let duration = values.end_hour - values.start_hour;
    let durationHours = Math.floor(duration / 3600000);
    let durationMinutes = Math.floor((duration / 60000) % 60);

    /* With the ref() Reactivity API */
    /* TODO you might want to sanitize this, man! (already did!)*/
    let subjectInfoHTML = editor_content.value;
    let subjectInfoDelta = editor_content_delta.value;

    let subjectId = edit_subject_object.id;

    let subjectObject = {};

    /* Raw values */
    subjectObject['raw'] = {};
    subjectObject['raw']['starts'] = values.start_hour.toISOString();
    subjectObject['raw']['ends'] = values.end_hour.toISOString();
    subjectObject['raw']['day'] = values.day.toISOString();

    subjectObject['id'] = subjectId;
    subjectObject['name'] = subjectName;
    subjectObject['starts'] = `${subjectStartHour}_${subjectStartMinutes}`;
    subjectObject['duration'] = `${durationHours}_${durationMinutes}`;
    subjectObject['day'] = subjectDay;
    subjectObject['color'] = subjectColor;
    subjectObject['info'] = subjectInfoHTML;
    subjectObject['info_delta'] = subjectInfoDelta;

    console.log('The data to be submitted: ', subjectObject);

    // // Update Subject in Pinia Store
    week.updateSubject(subjectObject['day'], subjectObject);
    console.log('The new day is: ', subjectObject['day']);

    // /* Send Data over to the Backend... */
    // try {
    //     fetch(PUT_USER_WEEK_URL, {
    //         method: 'PUT',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(week.getWeek()),
    //     })
    // } catch {

    // }

    /* Open Toast */
    toast.openToast({
        message: `The subject ${subjectObject.name} was updated successfully!`,
        type: 'failure',
    });
    /* Close form */
    edit_subject_popup.editSubjectClose();
});

onMounted(() => {
    // console.log('Edit Item got mounted, and this is the store: ', edit_subject_object.id); // Testing

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            edit_subject_popup.editSubjectClose();
        }
    });
});

/* Testing */
const logValues = () => {

}

const handleEditorLoad = (loadEvent) => {
    loadEvent.instance.setContents(editor_content_delta.value);
    // console.log('Edit Editor Instance: ', loadEvent.instance); // Testing
}
const handleEditorChange = (changeEvent) => {
    editor_content.value = DOMPurify.sanitize(changeEvent.htmlValue); // Sanitized HTML for extra security
    editor_content_delta.value = changeEvent.instance.editor.delta; // the Delta object
}

const position = { x: 0, y: 0 }
interact('.app-popup .draggable')
    .draggable({
        allowFrom: '.drag-handle',
        listeners: {
            start(event) {
                console.log(event.type, event.target)
            },
            move(event) {
                position.x += event.dx
                position.y += event.dy

                event.target.style.transform =
                    `translate(${position.x}px, ${position.y}px)`
            },
        }
    });

</script>
<template>
    <div class="app-popup" :class="edit_subject_popup.isEditSubjectOpen() ? 'opened' : ''">
        <div class="edit-item-container draggable">
            <!-- <button @click="logValues">Im a testing button</button> -->
            <form>
                <div class="title-and-handle flex justify-between items-center">
                    <h5>Edit Subject</h5>
                    <div class="drag-handle p-1 border border-general_gray_2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 -rotate-[45deg]">
                            <path fill-rule="evenodd"
                                d="M15 3.75a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V5.56l-3.97 3.97a.75.75 0 11-1.06-1.06l3.97-3.97h-2.69a.75.75 0 01-.75-.75zm-12 0A.75.75 0 013.75 3h4.5a.75.75 0 010 1.5H5.56l3.97 3.97a.75.75 0 01-1.06 1.06L4.5 5.56v2.69a.75.75 0 01-1.5 0v-4.5zm11.47 11.78a.75.75 0 111.06-1.06l3.97 3.97v-2.69a.75.75 0 011.5 0v4.5a.75.75 0 01-.75.75h-4.5a.75.75 0 010-1.5h2.69l-3.97-3.97zm-4.94-1.06a.75.75 0 010 1.06L5.56 19.5h2.69a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 011.5 0v2.69l3.97-3.97a.75.75 0 011.06 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div class="add-a-title relative">
                    <input type="text" v-bind="subject_name" placeholder="Add a title...">
                    <form-error v-if="errorBag.subject_name" />
                    <!-- <pre>values: {{ values }}</pre> -->
                </div>
                <div class="subject-color flex justify-start items-center gap-5 relative">
                    <div class="color-picker flex justify-start items-center gap-2">
                        <p>Pick a color: </p>
                        <input type="color" class="opacity-0 absolute w-[1px] h-[1px] overflow-hidden -left-5 -z-[1]"
                            ref="color_picker" v-bind="color_picked">
                        <div class="picked-color w-7 h-7 rounded-md hover:cursor-pointer" @click="colorPicker"
                            :style="{ backgroundColor: `${values.color_picked}` }"></div>
                    </div>
                    <div
                        class="color-theme flex justify-end items-center gap-2 p-3 rounded-md bg-white hover:cursor-pointer">
                        <div class="color-theme_color-1 w-7 h-7 rounded-md hover:scale-105"
                            :style="{ backgroundColor: `${color_theme[0]}` }" @click="setColor(color_theme[0])"></div>
                        <div class="color-theme_color-1 w-7 h-7 rounded-md hover:scale-105"
                            :style="{ backgroundColor: `${color_theme[1]}` }" @click="setColor(color_theme[1])"></div>
                        <div class="color-theme_color-1 w-7 h-7 rounded-md hover:scale-105"
                            :style="{ backgroundColor: `${color_theme[2]}` }" @click="setColor(color_theme[2])"></div>
                        <div class="color-theme_color-1 w-7 h-7 rounded-md hover:scale-105"
                            :style="{ backgroundColor: `${color_theme[3]}` }" @click="setColor(color_theme[3])"></div>
                        <div class="color-theme_color-1 w-7 h-7 rounded-md hover:scale-105"
                            :style="{ backgroundColor: `${color_theme[4]}` }" @click="setColor(color_theme[4])"></div>
                    </div>
                </div>
                <div class="date relative">
                    <div class="day hover:cursor-pointer relative">
                        <div class="flex justify-center items-center gap-3">
                            <p>Day</p>
                            <!-- <div class="day-badge">Wed</div> -->
                            <div class="day-badge w-full flex justify-center">
                                <calendar v-bind="day" dateFormat="D" appendTo=".date" showButtonBar />
                            </div>
                        </div>
                        <form-error v-if="errorBag.day" />
                    </div>
                    <div class="starts hover:cursor-pointer relative">
                        <div class="flex justify-center items-center gap-3">
                            <p>Starts</p>
                            <!-- <div class="start_hour-badge">7:00</div> -->
                            <div class="start_hour-badge w-full flex justify-center">
                                <calendar v-bind="start_hour" appendTo=".date .starts" timeOnly />
                            </div>
                        </div>
                        <form-error v-if="errorBag.start_hour" />
                    </div>
                    <div class="ends hover:cursor-pointer relative">
                        <div class="flex justify-center items-center gap-3">
                            <p>Ends</p>
                            <!-- <div class="end_hour-badge">8:00</div> -->
                            <div class="end_hour-badge w-full flex justify-center">
                                <calendar v-bind="end_hour" appendTo=".date .ends" timeOnly />
                            </div>
                        </div>
                        <form-error v-if="errorBag.end_hour" />
                    </div>
                </div>
                <!-- <div class="is-recurring">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M1.71429 17.2727C1.24286 17.2727 0.839144 17.1035 0.503144 16.7649C0.167144 16.4264 -0.000569973 16.0199 1.45525e-06 15.5455V3.45455C1.45525e-06 2.97955 0.168001 2.57277 0.504001 2.23423C0.840001 1.89568 1.24343 1.7267 1.71429 1.72727H2.57143V0H4.28572V1.72727H11.1429V0H12.8571V1.72727H13.7143C14.1857 1.72727 14.5894 1.89655 14.9254 2.23509C15.2614 2.57364 15.4291 2.98012 15.4286 3.45455V8.63636H13.7143V6.90909H1.71429V15.5455H7.71429V17.2727H1.71429ZM13.7143 19C12.6714 19 11.7606 18.6727 10.9817 18.018C10.2029 17.3634 9.71372 16.5392 9.51429 15.5455H10.8429C11.0286 16.1788 11.3823 16.697 11.904 17.1C12.4257 17.503 13.0291 17.7045 13.7143 17.7045C14.5429 17.7045 15.25 17.4095 15.8357 16.8193C16.4214 16.2292 16.7143 15.5167 16.7143 14.6818C16.7143 13.847 16.4214 13.1345 15.8357 12.5443C15.25 11.9542 14.5429 11.6591 13.7143 11.6591C13.3 11.6591 12.9143 11.7345 12.5571 11.8854C12.2 12.0362 11.8857 12.2487 11.6143 12.5227H12.8571V13.8182H9.42857V10.3636H10.7143V11.5943C11.1 11.2201 11.55 10.9213 12.0643 10.6979C12.5786 10.4745 13.1286 10.3631 13.7143 10.3636C14.9 10.3636 15.9109 10.7848 16.7469 11.6271C17.5829 12.4695 18.0006 13.4877 18 14.6818C18 15.8765 17.582 16.895 16.746 17.7374C15.91 18.5797 14.8994 19.0006 13.7143 19Z"
                        fill="#557B83" />
                </svg>
                <p>Rercurring?</p>
            </div> -->
                <div class="info mt-5">
                    <!-- <textarea name="" id="" cols="30" rows="10" placeholder="Info"></textarea> -->
                    <quill-editor editorStyle="height: 250px; width: 100%; background-color: white;"
                        placeholder="Your amazing notes go here:" @text-change="handleEditorChange"
                        @load="handleEditorLoad">
                        <template v-slot:toolbar>
                            <button class="ql-bold"></button>
                            <button class="ql-italic"></button>
                            <button class="ql-underline"></button>
                            <button class="ql-script" value="sub"></button>
                            <button class="ql-script" value="super"></button>
                            <select class="ql-color">
                                <option v-for="color in color_theme" :value="`${color}`"></option>
                                <option value="#ffffff"></option>
                                <option value="#000000"></option>
                            </select>
                            <select class="ql-background">
                                <option v-for="color in color_theme" :value="`${color}`"></option>
                                <option value="#ffffff"></option>
                                <option value="#000000"></option>
                            </select>

                            <select class="ql-header">
                                <option value="1"></option>
                                <option value="2"></option>
                                <option value="3"></option>
                                <option value="4"></option>
                                <option value="5"></option>
                                <option value="6"></option>
                            </select>

                            <button class="ql-link"></button>
                            <button class="ql-code"></button>
                            <!-- <select class="ql-size">
                            <option value="small"></option>
                            <option value="large"></option>
                            <option value="hughe"></option>
                        </select> -->
                        </template>
                    </quill-editor>
                    <!-- <quill-editor v-bind="info" editorStyle="height: 250px; width: 100%; background-color: white;" ></quill-editor> -->
                </div>
                <!-- <div class="alert">
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M5.99812 15C5.60042 15 5.21901 14.842 4.9378 14.5607C4.65658 14.2794 4.49859 13.8978 4.49859 13.5H7.49766C7.49766 13.8978 7.33967 14.2794 7.05845 14.5607C6.77724 14.842 6.39582 15 5.99812 15ZM11.9962 12.75H0V11.25L1.49953 10.5V6.375C1.46003 5.31684 1.69892 4.26685 2.19231 3.33C2.43512 2.90045 2.76621 2.52728 3.16375 2.23511C3.56129 1.94294 4.01624 1.73841 4.49859 1.635V3.12533e-06H7.23224C6.75725 0.531009 6.46246 1.19877 6.39009 1.90763C6.31773 2.61649 6.4715 3.33007 6.82938 3.94616C7.18727 4.56224 7.7309 5.04922 8.3824 5.33732C9.0339 5.62543 9.75984 5.69987 10.4562 5.55C10.4825 5.81775 10.4952 6.09525 10.4952 6.375V10.5L11.9947 11.25V12.75H11.9962ZM9.74695 4.5C9.45157 4.49951 9.15918 4.44082 8.88647 4.3273C8.61376 4.21377 8.36608 4.04762 8.15756 3.83834C7.94904 3.62906 7.78377 3.38075 7.67119 3.10758C7.5586 2.8344 7.50091 2.54173 7.5014 2.24625C7.5019 1.95078 7.56056 1.65829 7.67406 1.3855C7.78755 1.11271 7.95364 0.864945 8.16286 0.656361C8.37207 0.447777 8.62031 0.282457 8.8934 0.169839C9.16648 0.0572211 9.45907 -0.000489336 9.75445 3.12533e-06C10.351 0.000997696 10.9227 0.239004 11.3438 0.661664C11.765 1.08432 12.001 1.65702 12 2.25375C11.999 2.85049 11.7611 3.42239 11.3385 3.84364C10.916 4.2649 10.3435 4.501 9.74695 4.5Z"
                        fill="#557B83" />
                </svg>
                <p>At the time of the event</p>
            </div> -->
                <div class="confirm-options">
                    <div class="error-disclaimer mr-auto flex gap-1 justify-center items-center"
                        v-if="Object.keys(errorBag).length > 0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-8 h-8 text-general_red_1">
                            <path fill-rule="evenodd"
                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                clip-rule="evenodd" />
                        </svg>
                        <p>Errors in form!</p>
                        <!-- <p>{{ errorBag }}</p> -->
                    </div>
                    <div class="cancel hover:cursor-pointer" @click="edit_subject_popup.editSubjectClose()">
                        <p>Cancel</p>
                    </div>
                    <div class="add hover-cursor-pointer group/plus_icon" @click="submitForm">
                        <p>Apply</p>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-10 h-10 text-general_gray_2 transition group-hover/plus_icon:text-general_green_1">
                            <path fill-rule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>