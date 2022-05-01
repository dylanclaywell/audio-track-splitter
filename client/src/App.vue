<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
:root {
  --border-gray: #e4e4e4;
  --dark-blue: #2f4794;
  --blue: #5192e2;
  --red: #b73939;

  --breakpoint-sm: max-width(375px);
  --breakpoint-md: max-width(768px);
}

*,
*::before,
*::after {
  font-family: Roboto, sans-serif;
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-weight: normal;
}
</style>
