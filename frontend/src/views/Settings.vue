<script setup>
import { RouterLink } from 'vue-router';
</script>
<template>
    <h1>Im the settings page, motherfucker...</h1>
    <RouterLink :to="{ name: 'home'}">Go Back to home</RouterLink>
</template>