import { defineStore } from "pinia";
import { ref } from 'vue';
import _ from 'lodash';

export const usePopups = defineStore("popups", () => { 
    /* Settings Menu*/
    const settingsMenu_open = ref(false)
    /* Add Subject */
    const addSubject_open = ref(false);
    /* Edit Subject */
    const editSubject_open = ref(false);
    /* The Subject Object */
    const subjectObject = ref({});
    /* Toast Ref */
    const toast_open = ref(false);
    const toast_data = ref({});

    const  closeAllPopups = function () {
        settingsMenu_open.value = false;
        addSubject_open.value = false;
        editSubject_open.value = false;
        toast_open.value = false;
    }

    let settingsMenu = {
        openSettings() {
            settingsMenu_open.value = true;
        },
        closeSettings() {
            settingsMenu_open.value = false;
        },
        toggleSettings() {
            settingsMenu_open.value = !settingsMenu_open.value;
        },
        isSettingsMenuOpen() {
            return settingsMenu_open.value;
        }
    }

    let toastPopup = {
        openToast(data) {
            toast_open.value = true;
            toast_data.value = data;
        },
        closeToast() {
            toast_open.value = false;
        },
        isToastOpen() {
            return toast_open.value
        },
        getToastData() {
            return toast_data.value;
        }
    };

    /* Add Subject Popup */
    let addSubjectPopup = {
        
        addSubjectOpen() {
            addSubject_open.value = true;
        },
        addSubjectClose() {
            addSubject_open.value = false;
        },
        isAddSubjectOpen() {
            return addSubject_open.value;
        }
    }

    /* Edit Subject Popup */
    let editSubjectPopup = {
        
        editSubjectOpen(subject) {
            editSubject_open.value = true;
            subjectObject.value = subject;
            // console.log('From Pinia: ', subjectObject.value); // Testing
        },
        editSubjectClose() {
            editSubject_open.value = false;
        },
        isEditSubjectOpen() {
            return editSubject_open.value;
        },
        getSubjectObject() {
            return subjectObject.value;
        },
        updateSubjectObject(subject) {
            subjectObject.value = subject;
        },
    }

    return { settingsMenu, addSubjectPopup, editSubjectPopup, toastPopup, closeAllPopups }

});