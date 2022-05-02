<script setup lang="ts">
import { v4 as generateUuid } from 'uuid'
import { ref, watch } from 'vue'

import AppSection from '@/components/AppSection.vue'
import TrackRow from '@/components/TrackRow.vue'
import TextField from '@/components/TextField.vue'
import AppDialog from '@/components/AppDialog.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import type { Track } from '@/interfaces/track.interface'
import type { Metadata } from '@/interfaces/metadata.interface'

export interface FormFields {
  sourceFile: string | undefined
  fileFormat: string | undefined
  metadata?: Metadata
  tracks: Track[]
}

interface Dialog {
  message: string
  title: string
  type: 'success' | 'error'
}

const storedFormFields = JSON.parse(localStorage.getItem('formFields')) ?? {
  sourceFile: undefined,
  fileFormat: undefined,
  tracks: [
    {
      id: generateUuid(),
    },
  ],
}

const dialog = ref<Dialog | undefined>()

const formFields = ref<FormFields>(storedFormFields)

const isLoading = ref(false)

const canSubmit = ref(false)

watch(
  formFields,
  (newFormFields) => {
    localStorage.setItem('formFields', JSON.stringify(formFields.value))

    let fieldsAreValid = true

    for (const track of newFormFields.tracks) {
      if (!track.name || !track.startTime || !track.endTime) {
        fieldsAreValid = false
        break
      }

      if (
        !/^\d{2}:\d{2}:\d{2}$/.test(track.startTime) ||
        !/^\d{2}:\d{2}:\d{2}$/.test(track.endTime)
      ) {
        fieldsAreValid = false
        break
      }
    }

    if (!newFormFields.sourceFile) {
      fieldsAreValid = false
    }

    if (!newFormFields.fileFormat) {
      fieldsAreValid = false
    }

    canSubmit.value = fieldsAreValid
  },
  { deep: true }
)

function onFormFieldChange(fieldName: string, e) {
  formFields.value[fieldName] = e.target.value
}

function onTrackChange(trackId: string, fieldName: string, event) {
  const track = formFields.value.tracks.find((t) => t.id === trackId)

  if (!track) return

  track[fieldName] = event.target.value
}

function onMetadataChange(fieldName: keyof Metadata, event) {
  if (!formFields.value.metadata) {
    formFields.value.metadata = {}
  }

  const metadata = formFields.value.metadata
  metadata[fieldName] = event.target.value
}

function addTrack() {
  formFields.value.tracks.push({ id: generateUuid() })
}

function removeTrack(id: string) {
  formFields.value.tracks = formFields.value.tracks.filter(
    (track) => track.id !== id
  )
}

function createTracks() {
  isLoading.value = true
  fetch('http://localhost:4000/splitIntoTracks', {
    body: JSON.stringify(formFields.value),
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
  }).then((response) => {
    console.log(response)

    if (response.status === 201) {
      dialog.value = {
        message:
          'Created all tracks successfully. Check the output directory of the server for your files.',
        title: 'Success',
      }
    } else {
      dialog.value = {
        message:
          'There was an error creating the tracks. Please double check your inputs.',
        title: 'Error',
      }
    }

    isLoading.value = false
  })
}

function closeDialog() {
  dialog.value = undefined
}
</script>

<template>
  <LoadingOverlay :isOpen="isLoading" message="Your tracks are being created" />
  <main class="home">
    <div class="container">
      <h1 class="title">Audio Track Splitter</h1>
      <AppSection
        heading="Files"
        :subheadings="[
          'Make sure to provide a file name that is located within the sources directory of the server.',
          'The file format is used to determine the output file format - it must match the source file format to work.',
        ]"
      >
        <div class="song-fields">
          <TextField
            @change="(event) => onFormFieldChange('sourceFile', event)"
            :value="formFields.sourceFile"
            label="Source File"
          />
          <TextField
            @change="(event) => onFormFieldChange('fileFormat', event)"
            :value="formFields.fileFormat"
            label="File Format"
          />
        </div>
      </AppSection>
      <div class="divider" />
      <AppSection
        heading="Song Metadata"
        :subheadings="[
          'This data will apply to all tracks. The track number will be automatically assigned based on the order of the tracks below. All fields are optional.',
        ]"
      >
        <div class="song-fields">
          <TextField
            @change="(event) => onMetadataChange('artist', event)"
            :value="formFields.metadata?.artist"
            label="Artist"
          />
          <TextField
            @change="(event) => onMetadataChange('album', event)"
            :value="formFields.metadata?.album"
            label="Album"
          /><TextField
            @change="(event) => onMetadataChange('album_artist', event)"
            :value="formFields.metadata?.album_artist"
            label="Album Artist"
          />
          <TextField
            @change="(event) => onMetadataChange('year', event)"
            :value="formFields.metadata?.year"
            label="Year"
          />
          <TextField
            @change="(event) => onMetadataChange('genre', event)"
            :value="formFields.metadata?.genre"
            label="Genre"
          />
          <TextField
            @change="(event) => onMetadataChange('comment', event)"
            :value="formFields.metadata?.comment"
            label="Comment"
          />
          <TextField
            @change="(event) => onMetadataChange('composer', event)"
            :value="formFields.metadata?.composer"
            label="Composer"
          />
          <TextField
            @change="(event) => onMetadataChange('original_artist', event)"
            :value="formFields.metadata?.original_artist"
            label="Original Artist"
          />
          <TextField
            @change="(event) => onMetadataChange('copyrigh', event)"
            :value="formFields.metadata?.copyright"
            label="Copyright"
          />
        </div>
      </AppSection>
      <div class="divider" />
      <AppSection heading="Tracks">
        <p>All start and end times must be in the format HH:MM:SS.</p>
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
      </AppSection>
      <div class="create-button-container">
        <button :disabled="!canSubmit" @click="createTracks" class="button">
          Create Tracks
        </button>
      </div>
    </div>
  </main>
  <AppDialog :isOpen="Boolean(dialog)">
    <h1
      :class="{
        'dialog-heading__error': dialog?.type === 'error',
        'dialog-heading__success': dialog?.type === 'success',
      }"
    >
      {{ dialog?.title }}
    </h1>
    <p class="dialog-message">{{ dialog?.message }}</p>
    <div class="dialog__button-container">
      <button @click="closeDialog" class="button">OK</button>
    </div>
  </AppDialog>
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
  margin: 0 1rem;
  border-bottom: 1px solid var(--gray);
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
  transition: 150ms;
}

.home__add-track-button:hover {
  color: var(--dark-blue);
}

.tracks {
  padding: 0;
}

.create-button-container {
  display: flex;
  justify-content: center;
}

.button {
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: white;
  background-color: var(--blue);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: 150ms;
}

.button:hover:not(:disabled) {
  background-color: var(--dark-blue);
}

.button:disabled {
  background-color: var(--gray);
  color: lightgray;
  cursor: default;
}

.dialog-heading__success {
  color: var(--green);
}

.dialog-heading__error {
  color: var(--red);
}

.dialog-message {
  margin: 1rem 0rem;
}

.dialog__button-container {
  display: flex;
  justify-content: center;
}
</style>
