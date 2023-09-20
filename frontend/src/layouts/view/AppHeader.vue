<script setup>
import SearchBarAndUser from '../../components/SearchBarAndUser.vue';
import NavigationTabs from '../../components/NavigationTabs.vue';

</script>

<template>
    <div class="app-content-header">
        <navigation-tabs :is_mobile="true"/>
        <search-bar-and-user />
    </div>
</template>