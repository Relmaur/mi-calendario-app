<script setup>
/* Store */
import { usePopups } from './store/popups';
import { useCookies } from './store/cookies';
import { onMounted } from 'vue';


/* Deps */
import Cookies from 'js-cookie';
import _ from 'lodash';

/* Components */
// import Home from './views/Home.vue';
// import Settings from './views/Settings.vue';
// import LeftSide from './layouts/LeftSide.vue';
// import RightSide from './layouts/RightSide.vue';
import SettingsMenu from './components/popups/SettingsMenu/SettingsMenu.vue';
import AddItem from './components/popups/AddItem/AddItem.vue'
import EditItem from './components/popups/EditItem/EditItem.vue';
import Toast from './components/popups/Toasts/Toast.vue';

let settings_menu_popup = usePopups().settingsMenu;
let add_subject_popup = usePopups().addSubjectPopup;
let edit_subject_popup = usePopups().editSubjectPopup;
let toast_popup = usePopups().toastPopup;

// Store Auth Token on Pinia Store for global access
let cookies = useCookies();
cookies.setToken(Cookies.get('accessToken') ?? Cookies.get('refreshToken'));

/* Close All Popups at once */
// onMounted(() => {
//   document.addEventListener('keydown', e => {
//     if (e.key === 'Escape') {
//       usePopups().closeAllPopups();
//     }
//   });
// });

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
