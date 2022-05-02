<script setup lang="ts">
interface Props {
  isOpen: boolean
  onClose?: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <div class="app-dialog" :class="{ 'app-dialog--open': props.isOpen }">
    <div class="app-dialog__backdrop" />
    <div class="app-dialog__content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.app-dialog {
  z-index: 10;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  opacity: 0;
  visibility: hidden;
}

.app-dialog--open {
  opacity: 1;
  visibility: visible;
}

.app-dialog__backdrop {
  width: 100%;
  height: 100%;
  background-color: rgba(52, 52, 52, 0.75);
}

.app-dialog__content {
  min-width: 20rem;
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
