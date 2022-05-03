<script setup lang="ts">
import TextField from '@/components/TextField.vue'
import IconButton from '@/components/IconButton.vue'
import type { Track } from '@/interfaces/track.interface'

interface Props {
  track: Track
  onTrackChange: (id: string, fieldName: keyof Track, event: Event) => void
  onRemoveTrack: (id: string) => void
  canRemoveTrack: boolean
}

const props = defineProps<Props>()
</script>

<template>
  <li class="track-row">
    <div class="track-row__fields">
      <TextField
        label="Name"
        class="track-row__field"
        :value="props.track.name"
        :onChange="
          (event) => props.onTrackChange(props.track.id, 'name', event)
        "
      />
      <TextField
        label="Start Time"
        class="track-row__field"
        :value="props.track.startTime"
        :onChange="
          (event) => props.onTrackChange(props.track.id, 'startTime', event)
        "
      />
      <TextField
        label="End Time"
        class="track-row__field"
        :value="props.track.endTime"
        :onChange="
          (event) => props.onTrackChange(props.track.id, 'endTime', event)
        "
      />
    </div>
    <IconButton
      :isDisabled="!props.canRemoveTrack"
      :onClick="() => props.onRemoveTrack(props.track.id)"
      class="track-row__delete-button"
    />
  </li>
</template>

<style scoped>
.track-row {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.track-row__fields {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  grid-gap: 1rem;
}

.track-row__field {
  grid-column: span 5;
}

.track-row__delete-button {
  grid-column: span 1;
}

.track-row__delete-button:hover {
  color: var(--red);
}

.track-row__delete-button:disabled.track-row__delete-button:hover,
.track-row__delete-button:disabled {
  color: lightgray;
  cursor: default;
}

@media screen and (max-width: 768px) {
  .track-row {
    align-items: flex-start;
  }

  .track-row:not(:last-child) {
    margin-bottom: 4rem;
  }

  .track-row__fields {
    grid-template-columns: repeat(1, 1fr);
  }

  .track-row__field {
    grid-column: span 1;
  }

  .track-row__delete-button {
    margin-left: 2rem;
  }
}
</style>
