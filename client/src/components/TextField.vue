<script setup lang="ts">
interface Props {
  onChange: () => void
  value: string
  label: string
  type?: 'file'
}

const props = defineProps<Props>()
</script>

<template>
  <input
    :type="props.type"
    :placeholder="props.label"
    class="input"
    :value="props.value"
    @input="props.onChange"
  />
</template>

<style scoped>
.input {
  padding: 0.5rem;
  border-radius: 4px;
  border-color: var(--border-gray);
  outline: none;
  border-style: solid;
}

.input:focus {
  border-color: var(--blue);
}
</style>
