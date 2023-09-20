<script setup>
import { ref } from 'vue';
import { store } from '../../../../../store/store.js'; // Global State Management
import Calendar from 'primevue/calendar'; // Calendar
// import ColorPicker from 'primevue/colorpicker'; // Color Picker
import quillEditor from 'primevue/editor'; // Editor

// Subject Name
const subject_name = ref(null);
// Subject Color
const subject_color = ref(null);
// Date
const start_hour = ref(null);
const end_hour = ref(null);
const value = ref(null);
const day = ref(null);

const submitForm = e => {
    e.preventDefault();
    // alert('Submitted!'); // Testing

    let subjectName = subject_name.value;
    let subjectColor = subject_color.value;
    let subjectDay = day.value.getDay();
    let subjectStartHour = start_hour.value.getHours();
    let subjectStartMinutes = start_hour.value.getMinutes();
    let duration = end_hour.value - start_hour.value;
    let durationHours = Math.floor(duration / 3600000);
    let durationMinutes = Math.floor((duration / 60000) % 60);

    let subjectObject = {};
    subjectObject['name'] = subjectName;
    subjectObject['starts'] = `${subjectStartHour}_${subjectStartMinutes}`;
    subjectObject['duration'] = `${durationHours}_${durationMinutes}`;
    subjectObject['color'] = `#${subjectColor}`;
    // subjectObject['color'] = 'rgb(255, 140, 25)';

    const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // console.log(week[subjectDay]); // Testing
    store.userWeek[week[subjectDay]].push(subjectObject)

    store.addItemToggler_open = false;
}

// Testing
const logValues = () => {
    console.log('Name', subject_name.value);
    console.log('Color', subject_color.value);
    console.log('Day', day.value.getDay());
    console.log('Hours', start_hour.value.getHours());
    console.log('Minutes', start_hour.value.getMinutes());
    console.log('Hours', end_hour.value.getHours());
    console.log('Minutes', end_hour.value.getMinutes());
}

</script>
<template>
    <div class="schedule main-panel-container">
        <button @click="logValues">Im a testing button</button>
        <form>
            <h5>Add a Subject</h5>
            <div class="add-a-title">
                <input type="text" v-model="subject_name" placeholder="Add a title...">
            </div>
            <div class="subject-color flex justify-normal items-center gap-2 relative">
                <p>Pick a color: </p>
                <!-- <color-picker v-model="subject_color" format="hex" appendTo=".main-panel .schedule .subject-color"/> -->
                <input type="color">
            </div>
            <div class="date relative">
                <div class="day hover:cursor-pointer">
                    <p>Day</p>
                    <!-- <div class="day-badge">Wed</div> -->
                    <div class="day-badge">
                        <calendar v-model="day" dateFormat="D" appendTo=".main-panel .schedule .date" showButtonBar/>
                    </div>
                </div>
                <div class="starts hover:cursor-pointer">
                    <p>Starts</p>
                    <!-- <div class="start_hour-badge">7:00</div> -->
                    <div class="start_hour-badge">
                        <calendar v-model="start_hour" timeOnly />
                    </div>
                </div>
                <div class="ends hover:cursor-pointer">
                    <p>Ends</p>
                    <!-- <div class="end_hour-badge">8:00</div> -->
                    <div class="end_hour-badge">
                        <calendar v-model="end_hour" timeOnly />
                    </div>
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
                <quill-editor v-model="value" editorStyle="height: 250px; width: 100%; background-color: white;" />
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
                <div class="cancel hover:cursor-pointer" @click="store.addItemToggler_open = false">
                    <p>Cancel</p>
                </div>
                <div class="add hover-cursor-pointer group/plus_icon" @click="submitForm">
                    <p>Add</p>
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
</template>