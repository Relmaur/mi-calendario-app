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

const userSessionRaw = Cookies.get('userSession');
const userSession = userSessionRaw ? JSON.parse(decodeURIComponent(userSessionRaw)) : null;
main_app.setUser(userSession);

// let active_schedule = main_app.getActiveSchedule().value;

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

  const { result } = useQuery(
    GET_USER_QUERY,
    () => ({ id: String(main_app.user?.id) }),
    () => ({ enabled: !!main_app.user?.id })
  );


  watch(result, value => {
    const schedules = value.user.schedules;

    // build localStorage cache
    const cache = {};
    schedules.forEach(s => { cache[s.id] = s.week; });
    localStorage.setItem('schedules', JSON.stringify(cache));

    main_app.setSchedules(schedules);

    // Resolve which schedule to activate — prefer stored ID, fall back to first
    const storedId = localStorage.getItem('activeSchedule');
    const match = schedules.find(s => String(s.id) === String(storedId));
    const target = match ?? schedules[0];

    if (target) {
      main_app.setActiveSchedule(target.id);
      user_week.updateWeek(JSON.parse(target.week));
    }
  });

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
