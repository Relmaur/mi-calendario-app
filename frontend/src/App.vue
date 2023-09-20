<script setup>
import _ from 'lodash';
import LeftSide from './layouts/LeftSide.vue';
import RightSide from './layouts/RightSide.vue';
import AddItem from './components/popups/AddItem/AddItem.vue';

</script>

<template>
  <!-- Main App Body -->
  <div class="app-main-container">
    <left-side />
    <right-side />
  </div>
  <add-item />
</template>
