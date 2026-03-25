<script setup lang="ts">
import { useFilms, type Film, type FilmFormData } from '@/composers/films'
import { computed, provide, ref, watch } from 'vue'
import FilmsListItem from './FilmsListItem.vue'
import { useAuth } from '@/composers/auth'
import BaseButton from '../UI/BaseButton.vue'
import FilmModal from './FilmModal.vue'

export type EditMode = 'edit' | 'add' | 'view'

const { currentUser } = useAuth()
const { getUserFilmsList, addFilm, editFilm, getUserFilmById, deleteFilm } = useFilms()

const userFilms = computed<Film[]>(() => {
  return getUserFilmsList()
})

const showModal = ref<boolean>(false)
const editMode = ref<EditMode>('view')

const film = ref<Film | null>(null)

provide('currentFilm', film)

const modalTitle = computed<string>(() =>
  editMode.value === 'view' ? 'Film detail' : film.value ? 'Edit film' : 'Add new film',
)

function handleConfirm(data: FilmFormData): void {
  if (currentUser.value && editMode.value) {
    if (film.value) {
      editFilm(data, film.value.id)
    } else {
      addFilm(data)
    }
  }

  showModal.value = false
}

function openModalForAddFilm(): void {
  film.value = null
  editMode.value = 'add'
  showModal.value = true
}

function openModalForEditFilm(filmData: Film): void {
  editMode.value = 'edit'
  film.value = filmData
  showModal.value = true
}

function openModalForShowFilmDetail(filmData: Film): void {
  editMode.value = 'view'
  film.value = filmData
  showModal.value = true
}

function handleDeleteFilm(filmData: Film): void {
  if (confirm('Are you shure?')) {
    const success = deleteFilm(filmData.id)
    if (success) alert(`Film ${filmData.title} deleted`)
  }
}
</script>

<template>
  <section>
    <div class="panel">
      <h2>My film list</h2>
      <BaseButton class="add-button" @click="openModalForAddFilm()">Add film</BaseButton>
    </div>
    <div v-if="userFilms.length > 0" class="film-container">
      <FilmsListItem
        v-for="film in userFilms"
        :key="film.id"
        :film="film"
        @edit="openModalForEditFilm"
        @view="openModalForShowFilmDetail"
        @delete="handleDeleteFilm"
      />
    </div>
    <div v-else class="">No films</div>
    <FilmModal
      :is-visible="showModal"
      :mode="editMode"
      :modal-title="modalTitle"
      @confirm="handleConfirm"
      @cancel="showModal = false"
    />
    <div id="modal"></div>
  </section>
</template>

<style scoped>
h2 {
  font-weight: 500;
}
.film-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.panel {
  display: flex;
  justify-content: space-between;
}

.add-button {
  margin-bottom: 0.75rem;
}
</style>
