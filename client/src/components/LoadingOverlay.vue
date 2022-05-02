<script setup lang="ts">
interface Props {
  isOpen: boolean
  message?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="loading-overlay"
    :class="{ 'loading-overlay--open': props.isOpen }"
  >
    <div class="loading-overlay__backdrop" />
    <div class="loading-overlay__indicator-container">
      <span class="loading-overlay__indicator">Loading</span>
      <span class="loading-overlay__message" v-if="props.message">{{
        props.message
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  z-index: 10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  visibility: hidden;
  transition: 200ms;
}

.loading-overlay--open {
  opacity: 1;
  visibility: visible;
}

.loading-overlay__backdrop {
  width: 100%;
  height: 100%;
  background-color: rgba(52, 52, 52, 0.75);
}

.loading-overlay__indicator-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 5rem;
  height: 5rem;
}

.loading-overlay__indicator {
  display: flex;
  width: 5rem;
  height: 5rem;
  transform: rotate(0deg);
  color: transparent;
  border: 4px solid transparent;
  border-top-color: var(--dark-blue);
  border-right-color: #727272;
  border-left-color: #727272;
  border-bottom-color: #727272;
  border-radius: 9999px;
  animation: spin 1.5s ease infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.loading-overlay__message {
  margin-top: 1rem;
  font-size: 2rem;
  color: #bababa;
  white-space: nowrap;
  width: 5rem;
  display: flex;
  justify-content: center;
}
</style>
