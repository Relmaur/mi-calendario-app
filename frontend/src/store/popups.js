import { add } from "lodash";
import { defineStore } from "pinia";
import { ref } from 'vue';

export const usePopups = defineStore("popups", () => {
    
    const addItem_open = ref(false);

    const addItemOpen = () => {
        addItem_open.value = true;
    }
    const addItemClose = () => {
        addItem_open.value = false;
    }
    const isAddItemOpen = () => {
        return addItem_open.value;
    }

    return {addItem_open, addItemOpen, addItemClose, isAddItemOpen}

});