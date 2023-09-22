import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSubjectsColorTheme = defineStore('subjectsColorTheme', () => {

    const theme = ref(['#874400', '#D36B00', '#FF8C19', '#006787', '#00A2D4']);

    const updateTheme = (colorTheme) => {
        subjectsColorTheme.value = colorTheme;
    }

    return { theme, updateTheme }
});
