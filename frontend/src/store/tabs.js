import { reactive } from 'vue';
import { ref } from 'vue';
import { defineStore } from "pinia";

// Note to self: using reactive() has its downside (security wise) so:
// TODO: impelement Pinia for global state management. Here's a useful url: https://pinia.vuejs.org/introduction.html

/*
export const store = reactive({

    activeTab: 'schedule',
    addItemToggler_open: false,

    changeTab(tab) {
        this.activeTab = tab;
        // console.log('Hello, from store.js!', tab)
    },

    openAddItemToggler(tab) {
        this.addItemToggler_open = true;
    },

});
*/

export const useTabs = defineStore('tabs', () => {
    const activeTab = ref('schedule');
    const changeTab = tab => {
        activeTab.value = tab;
    }
    const getActiveTab = () => {
        return activeTab.value;
    }

    return { activeTab, changeTab, getActiveTab }
})