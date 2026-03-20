<script setup lang="ts">
import { type Film, type FilmFormData } from '@/composers/films'
import BaseButton from '../UI/BaseButton.vue'
import { computed, ref, watch } from 'vue'
import FilmForm from './FilmForm.vue'
import FilmDetail from './FilmDetail.vue'
import type { EditMode } from './FilmsList.vue'

interface ModalProps {
  modalTitle: string
  isVisible: boolean
  film?: Film | null
  mode?: EditMode
}

interface ModalEmits {
  (event: 'confirm', data: FilmFormData): void
  (event: 'cancel'): void
}

const props = defineProps<ModalProps>()
const emit = defineEmits<ModalEmits>()

const formData = ref<FilmFormData>({
  title: '',
  rating: 0,
  year: '',
  director: '',
})

// const error = ref<string>('')
const isFormValid = ref(false)
const isLoading = ref<boolean>(false)

const isEdit = computed<boolean>(() => props.mode !== 'view')

// сбросить данные на форме
watch(
  () => props.film,
  (newFilm) => {
    if (!newFilm) {
      // открытие формы добавления фильма после редактирования другого фильма
      resetForm()
    }
  },
)

watch(
  () => props.film,
  (newFilm) => {
    if (newFilm)
      formData.value = {
        title: newFilm.title,
        rating: newFilm.rating,
        year: newFilm.year,
        director: newFilm.director,
      }
  },
)

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  if (!isFormValid.value) {
    // error.value = 'Please fill in all fields correctly'
    console.log('Please fill in all fields correctly')
    return
  }

  isLoading.value = true

  try {
    emit('confirm', {
      title: formData.value.title,
      rating: formData.value.rating,
      year: formData.value.year,
      director: formData.value.director,
    })
    if (props.mode === 'add') resetForm()
  } catch (err: unknown) {
    console.error('Error :', err)
    // error.value = 'Error while saving'
  } finally {
    isLoading.value = false
  }
}

function handleFormValid(isValid: boolean): void {
  isFormValid.value = isValid
}

function resetForm() {
  isLoading.value = false
  isFormValid.value = false

  formData.value = {
    title: '',
    rating: 0,
    year: '',
    director: '',
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-show="isVisible" class="modal-overlay" @click.self="handleCancel">
        <div class="modal-container" @click.self="handleCancel">
          <div class="modal-body">
            <button
              class="modal-close"
              @click="handleCancel"
              aria-label="Close"
              :disabled="isLoading"
            >
              <span class="close-icon">✕</span>
            </button>

            <h3>{{ modalTitle }}</h3>

            <FilmForm
              v-if="isEdit"
              :form-data="formData"
              :is-loading="isLoading"
              :is-visible="isVisible"
              @valid="handleFormValid"
              @update:form-data="formData = $event"
            />
            <FilmDetail v-else-if="film" :film="film" />

            <div class="modal-actions">
              <BaseButton
                v-if="isEdit"
                class="modal-button confirm"
                @click="handleConfirm"
                :disabled="isLoading"
                >{{ isLoading ? 'Saving...' : film ? 'Save' : 'Add' }}</BaseButton
              >
              <BaseButton class="modal-button cancel" @click="handleCancel" :disabled="isLoading"
                >Cancel</BaseButton
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
h3 {
  font-size: 2rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-container {
  position: relative;
  min-width: 350px;
  max-width: 500px;
  width: 80%;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-background, #ffffff);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: modal-appear 0.3s ease;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 30%;
  background: var(--color-background-soft, #f5f5f5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.modal-close:hover {
  border: 1px solid var(--color-background);
  background: var(--color-background-mute, #e5e5e5);
}

.close-icon {
  font-size: 18px;
  line-height: 1;
}

.modal-title {
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text, #2c3e50);
  text-align: center;
}

.modal-form {
  display: flex;
  flex-direction: column;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.modal-button.cancel {
  background: var(--color-background-soft, #f5f5f5);
  color: var(--color-text, #2c3e50);
}

.modal-button.cancel:hover {
  background: var(--color-background-mute, #e5e5e5);
}
</style>
