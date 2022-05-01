<script setup lang="ts">
import { v4 as generateUuid } from 'uuid'
import { ref } from 'vue'

import TrackRow from '@/components/TrackRow.vue'
import TextField from '@/components/TextField.vue'
import type { Track } from '@/interfaces/track.interface'

export interface FormFields {
  tracks: Track[]
}

const formFields = ref<FormFields>({
  tracks: [
    {
      id: generateUuid(),
    },
  ],
})

function onSourceFileChange(e) {
  console.log(e.target.value)
}

function onTrackChange(trackId: string, fieldName: string, event) {
  const track = formFields.value.tracks.find((t) => t.id === trackId)

  if (!track) return

  track[fieldName] = event.target.value
}

function addTrack() {
  formFields.value.tracks.push({ id: generateUuid() })
}

function removeTrack(id: string) {
  formFields.value.tracks = formFields.value.tracks.filter(
    (track) => track.id !== id
  )
}
</script>

<template>
  <main class="home">
    <div class="container">
      <h1 class="title">Audio Track Splitter</h1>
      <section class="section">
        <h2 class="heading">Files</h2>
        <p class="subheading">
          Make sure the file to select a file from within the sources directory
          of the server.
        </p>
        <div class="song-fields">
          <TextField @change="onSourceFileChange" type="file" label="Source" />
        </div>
      </section>
      <div class="divider" />
      <section class="section">
        <h2 class="heading">Tracks</h2>
        <ul class="tracks">
          <TrackRow
            v-for="track in formFields.tracks"
            :key="track.id"
            :track="track"
            :onTrackChange="onTrackChange"
            :onRemoveTrack="removeTrack"
            :canRemoveTrack="formFields.tracks.length > 1"
          />
        </ul>
        <button class="home__add-track-button" @click="addTrack">
          Add Track<span class="material-icons">add</span>
        </button>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home {
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.container {
  padding: 1rem;
  max-width: 60rem;
  margin: auto;
}

.title {
  font-size: 3rem;
  text-align: center;
  color: var(--dark-blue);
}

.divider {
  margin: 0 3rem;
  border-bottom: 1px solid lightgray;
}

.section {
  margin: 2rem 0;
}

.heading {
  margin-bottom: 1rem;
}

.subheading {
  margin-bottom: 1rem;
}

.tracks {
  padding: 0;
}

.song-fields {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;
}

.home__add-track-button {
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  background: none;
  color: var(--blue);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tracks {
  padding: 0;
}
</style>
