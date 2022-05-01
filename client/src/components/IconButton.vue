<script setup lang="ts">
interface Props {
  isDisabled: boolean
  onClick: () => void
}

const props = defineProps<Props>()
</script>

<template>
  <button :disabled="props.isDisabled" @click="props.onClick" class="button">
    <span class="material-icons">remove</span>
  </button>
</template>

<style scoped>
.button {
  color: gray;
  cursor: pointer;
  background: none;
  border: none;
}
</style>
