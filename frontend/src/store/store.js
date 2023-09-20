import { reactive } from 'vue';

// Note to self: using reactive() has its downside (security wise) so:
// TODO: impelement Pinia for global state management. Here's a useful url: https://pinia.vuejs.org/introduction.html

export const store = reactive({

    activeTab: 'schedule',
    addItemToggler_open: false,
    userWeek: {
        'sunday': [
             {
                'name': 'Algebra',
                'starts': '6_0',
                'duration': '2_0',
                'color': '#FF8C19'
            },
             {
                'name': 'Calculus',
                'starts': '9_0',
                'duration': '2_0',
                'color': '#FF8C19'
            },
        ],
        'monday': [
             {
                'name': 'Calculus',
                'starts': '7_0',
                'duration': '3_0',
                'color': '#D36B00'
            },
             {
                'name': 'Calculus',
                'starts': '7_0',
                'duration': '3_0',
                'color': '#D36B00'
            },
        ],
        'tuesday': [
             {
                'name': 'Educacion Fisica',
                'starts': '20_0',
                'duration': '4_0',
                'color': '#00A2D4'
            },
            {
                'name': 'Español',
                'starts': '10_0',
                'duration': '2_0',
                'color': 'salmon'
            },
        ],
        'wednesday': [],
        'thursday': [
            {
                'name': 'Español',
                'starts': '10_0',
                'duration': '2_0',
                'color': 'salmon'
            },
        ],
        'friday': [],
        'saturday': [],
    },

    changeTab(tab) {
        this.activeTab = tab;
        console.log('Hello, from store.js!', tab)
    },

    openAddItemToggler(tab) {
        this.addItemToggler_open = true;
    },

})