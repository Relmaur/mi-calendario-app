<script setup>
/* Store */
import { usePopups } from './store/popups';
/* Deps */
import _ from 'lodash';

/* Components */
import LeftSide from './layouts/LeftSide.vue';
import RightSide from './layouts/RightSide.vue';
import AddItem from './components/popups/AddItem/AddItem.vue'
import EditItem from './components/popups/EditItem/EditItem.vue';

let add_subject_popup = usePopups().addSubjectPopup;
let edit_subject_popup = usePopups().editSubjectPopup;

</script>

<template>
  <!-- Main App Body -->
  <div class="app-main-container">
    <left-side />
    <right-side />
  </div>
  <add-item v-if="add_subject_popup.isAddSubjectOpen()" />
  <edit-item v-if="edit_subject_popup.isEditSubjectOpen() "/>
</template>
