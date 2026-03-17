<script setup lang="ts">
import type { Film } from '@/composers/films'
import BaseButton from '../UI/BaseButton.vue'
import Icon from '../UI/Icon.vue'

interface FilmListItemProps {
  film: Film
}

interface FilmListItemEmits {
  (event: 'edit', id: string): void
}

const props = defineProps<FilmListItemProps>()
const emits = defineEmits<FilmListItemEmits>()
</script>

<template>
  <div class="film-item">
    <div class="title">{{ film.title }}</div>
    <div class="rating">
      <span>
        <Icon name="star"></Icon>
        {{ film.rating }}</span
      >
    </div>

    <div class="director"><span>Режиссер: </span>{{ film.director }}</div>
    <div class="panel">
      <BaseButton class="button" @click="emits('edit', film.id)"
        ><span class="edit"></span>Edit</BaseButton
      >
    </div>
  </div>
</template>

<style scoped>
.film-item {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  display: grid;
  grid-template-columns: 80% auto;
  grid-template-rows: 1fr 20%;
}
.title {
  font-size: 1.5rem;
}
.rating {
  display: inline-block;
  justify-self: right;
}
.rating span {
  background: linear-gradient(165deg, var(--vt-c-gold-light) 16.44%, var(--vt-c-gold-dark) 63.42%);
  color: white;
  font-weight: 600;
  border-radius: 30%;
  padding: 5px 8px;
  min-width: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.icon-star {
  fill: white;
  width: 16px;
  height: 16px;
}

.director {
  grid-column: span 2;
}
.director span {
  color: rgba(0, 0, 0, 0.6);
}
.panel {
  grid-column: span 2;
  display: flex;
  justify-content: flex-end;
  gap: 5px;
}
.button {
  margin: 0;
}
</style>
