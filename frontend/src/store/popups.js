import { defineStore } from "pinia";
import { ref } from 'vue';

export const usePopups = defineStore("popups", () => {

    /* Add Subject */
    const addSubject_open = ref(false);
    /* Edit Subject */
    const editSubject_open = ref(false);
    /* The Subject Object */
    const subjectObject = ref({});
    /* Toast Ref */
    const toast_open = ref(false);
    const toast_data = ref({});

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

    return { addSubjectPopup, editSubjectPopup, toastPopup }

});