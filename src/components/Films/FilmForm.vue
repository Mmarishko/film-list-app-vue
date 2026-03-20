<script setup lang="ts">
import type { FilmFormData } from '@/composers/films'
import { ref, watch } from 'vue'
import BaseInput from '../UI/BaseInput.vue'
import { MAX_YEAR_ADD_VALUE, MIN_YEAR_VALUE } from '@/utils/const'

interface FilmFormEmits {
  (event: 'valid', isValid: boolean): void
  (event: 'update:form-data', data: FilmFormData): void
}

type Errors = Partial<Record<keyof FilmFormData, string>>

const props = defineProps<{
  isLoading: boolean
  isVisible: boolean
  formData: FilmFormData
}>()

const emits = defineEmits<FilmFormEmits>()

const errorForm = ref<string>('')

function validateField(isValid: boolean): boolean {
  if (!isValid) {
    errorForm.value = 'Fields are filled in incorrectly'
  } else {
    errorForm.value = ''
  }
  emits('valid', isValid)
  return isValid
}

function handleFieldUpdate(key: keyof FilmFormData, value: string | number) {
  const updatedFormData: FilmFormData = {
    ...props.formData,
    [key]: typeof value === 'number' ? value : value.trim(),
  }

  emits('update:form-data', updatedFormData)
}
</script>

<template>
  <div class="modal-form">
    <BaseInput
      name="title"
      :model-value="formData.title"
      @update:model-value="handleFieldUpdate('title', $event)"
      @valid="validateField"
      :title="'Film title'"
      :placeholder="'Film title'"
      required
      :disabled="isLoading"
      :pattern="'^[a-zA-Zа-яА-ЯёЁ0-9\\s-]+$'"
    />

    <BaseInput
      name="raiting"
      type="number"
      :model-value="formData.rating"
      @update:model-value="handleFieldUpdate('rating', $event)"
      @valid="validateField"
      :title="'Rating'"
      required
      :min="0"
      :max="10"
      :step="0.1"
      :disabled="isLoading"
    />
    <BaseInput
      name="year"
      :modelValue="formData.year"
      @update:model-value="handleFieldUpdate('year', $event)"
      @valid="validateField"
      :title="'Release year'"
      :placeholder="'1986'"
      required
      :disabled="isLoading"
      :maxlength="4"
      :min="MIN_YEAR_VALUE"
      :max="new Date().getFullYear() + MAX_YEAR_ADD_VALUE"
      :pattern="'\\d{4}'"
    />
    <BaseInput
      name="director"
      :modelValue="formData.director"
      @update:model-value="handleFieldUpdate('director', $event)"
      @valid="validateField"
      :title="'Director'"
      :placeholder="'Surname first name'"
      required
      :disabled="isLoading"
    />
  </div>

  <transition name="fade">
    <div v-if="errorForm" class="error" role="alert">{{ errorForm }}</div>
  </transition>
</template>

<style scoped>
.error {
  color: var(--color-error);
}

/* Видно всегда при открытии формы, потом исчезает */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
