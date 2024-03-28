<script setup>
/* Store */
import { onMounted, ref, watch } from 'vue';
import { usePopups } from './store/popups';
import { useCookies } from './store/cookies';

/* GraphQL */
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

/* Deps */
import Cookies from 'js-cookie';
import _ from 'lodash';

/* Components */
import SettingsMenu from './components/popups/SettingsMenu/SettingsMenu.vue';
import AddItem from './components/popups/AddItem/AddItem.vue'
import EditItem from './components/popups/EditItem/EditItem.vue';
import Toast from './components/popups/Toasts/Toast.vue';
import { useMainApp } from './store/mainApp';
import { useWeek } from './store/userWeek';

let main_app = useMainApp();
let user_week = useWeek();
let settings_menu_popup = usePopups().settingsMenu;
let add_subject_popup = usePopups().addSubjectPopup;
let edit_subject_popup = usePopups().editSubjectPopup;
let toast_popup = usePopups().toastPopup;
// Store Auth Token on Pinia Store for global access
let cookies = useCookies();

cookies.setToken(Cookies.get('accessToken') ?? Cookies.get('refreshToken'));
main_app.setUser(JSON.parse(decodeURIComponent(`${Cookies.get('userSession')}`)));

let active_schedule = main_app.getActiveSchedule().value;

console.log('This is the user: ', JSON.parse(decodeURIComponent(`${Cookies.get('userSession')}`))) // Testing
console.log("This is the active schedule: ", active_schedule);


/*
   ===========================
      GraphQL Main Entry Point
   ===========================
*/
try {

  const GET_USER_QUERY = gql`
        query getUser($id: ID!) {
          user(id: $id) {
            id
            userName
            schedules {
              id
              title
              description
              date
              week
            }
          }
        }`;

  const { result } = useQuery(GET_USER_QUERY, {
    id: `${main_app.getUser().value.id}`
  });


  watch(result, value => {
    
    let schedules = {};

    value.user.schedules.forEach(schedule => {
      

      // schedules.push(schedule.week);
      schedules[schedule.id] = schedule.week;

      localStorage.setItem('schedules', JSON.stringify(schedules));
      
    })

    // console.log('This is the result: ', value); // Testing
    main_app.setSchedules(value.user.schedules);

    // console.log('This is the week to update: ', JSON.parse(main_app.getWeekbySchedule(active_schedule)));
    user_week.updateWeek(JSON.parse(main_app.getWeekbySchedule(active_schedule)));

    // console.log('Updated, ', JSON.parse(main_app.getWeekbySchedule(active_schedule)))

    localStorage.setItem('activeSchedule', active_schedule);

  })

  // main_app.setSchedules(result.value.schedules);

} catch (error) {

  console.log('Something went wrong with the GraphQL data fetching, the error is: ', error);

}

</script>

<template>
  <!-- Main App Body -->

  <div class="app-main-container">

    <RouterView />

  </div>

  <settings-menu v-if="settings_menu_popup.isSettingsMenuOpen()" />
  <add-item v-if="add_subject_popup.isAddSubjectOpen()" />
  <edit-item v-if="edit_subject_popup.isEditSubjectOpen()" />
  <toast v-if="toast_popup.isToastOpen()" />
</template>
