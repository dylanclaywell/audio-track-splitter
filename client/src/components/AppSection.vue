<script setup lang="ts">
interface Props {
  heading: string
  subheadings?: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <section class="section">
    <h2 class="heading">{{ props.heading }}</h2>
    <p
      v-for="subheading in props.subheadings"
      :key="subheading"
      class="subheading"
    >
      {{ subheading }}
    </p>
    <slot />
  </section>
</template>

<style scoped>
.section {
  margin: 2rem 0;
}

.heading {
  margin-bottom: 1rem;
}

.subheading {
  margin-bottom: 1rem;
}
</style>
