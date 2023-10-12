<script setup>
/* Deps */
import { ref } from 'vue';

/* Components */
import Subjects from './Subjects.vue';
// import AddItem from '@components/popups/AddItem/AddItem.vue';
import HeaderDay from '../../../components/micro-frontend/HeaderDay.vue';

/* Stores */
import { usePopups } from '../../../store/popups.js';

const add_subject_popup = usePopups().addSubjectPopup;

const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

</script>
<template>
    <div class="view-body view-schedule">
        <div class="app-content-table">
            <div class="week-header">
                <div class="left-column arrows">
                    <div class="arrows-container">
                        <!-- <div class="prev group/prev">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-8 h-8 text-general_blue_1 group-hover/prev:scale-105 group-hover/prev:text-general_blue_2">
                                <path fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-4.28 9.22a.75.75 0 000 1.06l3 3a.75.75 0 101.06-1.06l-1.72-1.72h5.69a.75.75 0 000-1.5h-5.69l1.72-1.72a.75.75 0 00-1.06-1.06l-3 3z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="next group/next">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                class="w-8 h-8 text-general_blue_1 group-hover/next:scale-105 group-hover/next:text-general_blue_2">
                                <path fill-rule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div> -->
                    </div>
                </div>
                <div class="week-days">
                    <header-day :day="weekday" v-for="(weekday, index) in week" :key="index" />
                </div>
            </div>
            <div class="week-table">
                <div class="left-column hours">
                    <div class="2h-1">
                        <p>00:00</p>
                    </div>
                    <div class="2h-2">
                        <p>02:00</p>
                    </div>
                    <div class="2h-3">
                        <p>04:00</p>
                    </div>
                    <div class="2h-4">
                        <p>06:00</p>
                    </div>
                    <div class="2h-5">
                        <p>08:00</p>
                    </div>
                    <div class="2h-6">
                        <p>10:00</p>
                    </div>
                    <div class="2h-7">
                        <p>12:00</p>
                    </div>
                    <div class="2h-8">
                        <p>14:00</p>
                    </div>
                    <div class="2h-9">
                        <p>16:00</p>
                    </div>
                    <div class="2h-10">
                        <p>18:00</p>
                    </div>
                    <div class="2h-11">
                        <p>20:00</p>
                    </div>
                    <div class="2h-12">
                        <p>22:00</p>
                        <p>00:00</p>
                    </div>
                </div>
                <div class="week-schedule-table">
                    <div class="horizontal-guides">
                        <div class="2h-1"></div>
                        <div class="2h-2"></div>
                        <div class="2h-3"></div>
                        <div class="2h-4"></div>
                        <div class="2h-5"></div>
                        <div class="2h-6"></div>
                        <div class="2h-7"></div>
                        <div class="2h-8"></div>
                        <div class="2h-9"></div>
                        <div class="2h-10"></div>
                        <div class="2h-11"></div>
                        <div class="2h-12"></div>
                    </div>
                    <subjects />
                </div>
            </div>
        </div>
        <div class="app-content-footer">
            <div class="plus-icon group/plus_icon" @click="add_subject_popup.addSubjectOpen()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    class="w-10 h-10 text-general_gray_2 transition group-hover/plus_icon:text-general_gray_1">
                    <path fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                        clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </div>
</template> 