import { defineStore } from "pinia";
import { ref } from 'vue';

export const usePopups = defineStore("popups", () => {

    /* Add Subject */
    const addSubject_open = ref(false);
    /* Edit Subject */
    const editSubject_open = ref(false);
    const subjectObject = ref({});

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
            console.log('From Pinia: ', subjectObject.value); // Testing
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
        }
    }

    return { addSubjectPopup, editSubjectPopup }

});