<script setup lang="ts">
import type { Film } from '@/composers/films'

interface FilmListItemProps {
  film: Film
}
const props = defineProps<FilmListItemProps>()
</script>

<template>
  <div class="film-item">
    <div class="title">{{ film.title }}</div>
    <div class="year"><span>Release year: </span> {{ film.year }}</div>
    <div class="rating"><span> Rating: </span> {{ film.rating }}</div>

    <div class="director"><span>Director: </span>{{ film.director }}</div>
    <div v-if="film?.description" class="description">{{ film.description }}</div>
  </div>
</template>

<style scoped>
.title {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.span {
  color: var(--vt-c-text-light-1);
}

.year,
.rating,
.directior {
  font-weight: 500;
}

.description {
  margin: 2rem auto;
}
</style>
