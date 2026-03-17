<script setup lang="ts">
import { useFilms, type Film } from '@/composers/films'
import { ref } from 'vue'
import FilmsListItem from './FilmsListItem.vue'
import { useAuth } from '@/composers/auth'
import BaseButton from '../UI/BaseButton.vue'

const { currentUser } = useAuth()
const { getUserFilmsList, addFilm } = useFilms()
const userFilms = ref<Film[]>(getUserFilmsList())

function addNewFilm() {
  if (currentUser.value) {
    addFilm({
      title: 'The Shawshank Redemption',
      rating: 8.5,
      year: '1994',
      director: 'Фрэнк Дарабонт',
    })
    userFilms.value = getUserFilmsList()
  }
}
function editFilm(id: string) {
  console.log('edit', id)
}
</script>

<template>
  <section>
    <div class="panel">
      <h2>My film list</h2>
      <BaseButton @click="addNewFilm">Add film</BaseButton>
    </div>
    <div v-if="userFilms.length > 0" class="film-container">
      <FilmsListItem v-for="film in userFilms" :key="film.id" :film="film" @edit="editFilm" />
    </div>
    <div v-else class="">Список пуст</div>
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
</style>
