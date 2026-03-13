<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type InputType =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'

interface InputProps {
  name: string
  title?: string
  type?: InputType
  placeholder?: string
  required?: boolean
  disabled?: boolean
  pattern?: string
  minlength?: number
  maxlength?: number
}

const props = withDefaults(defineProps<InputProps>(), {
  title: '',
  placeholder: '',
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'valid', isValid: boolean): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}>()

const model = defineModel<string>({ default: '' })

// Состояние
const error = ref<string>('')
const touched = ref<boolean>(false)
const isDirty = ref<boolean>(false)

// Валидация
const isValid = computed(() => !error.value)

const errorId = computed(() => `${props.name}-error`)

// изменение модели
watch(
  () => model.value,
  (newValue) => {
    if (touched.value) {
      validateField(newValue)
    }
    emit('valid', isValid.value)
  },
)

// Валидация поля
function validateField(value: string): boolean {
  error.value = ''

  // Проверка на обязательность
  if (props.required && !value.trim()) {
    error.value = 'Field is required'
    return false
  }

  // Если поле пустое и не обязательно - ок
  if (!value.trim()) {
    return true
  }

  if (props.minlength && value.length < props.minlength) {
    error.value = `Minimum length ${props.minlength} characters`
    return false
  }

  if (props.maxlength && value.length > props.maxlength) {
    error.value = `Maximum length ${props.maxlength} characters`
    return false
  }

  if (props.pattern && !new RegExp(props.pattern).test(value)) {
    error.value = 'Invalid format'
    return false
  }

  return true
}

// Обработчики событий
function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  model.value = value
  isDirty.value = true

  if (touched.value) {
    validateField(value)
  }
}

function onBlur(event: FocusEvent) {
  touched.value = true
  validateField(model.value)
  emit('blur', event)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}
</script>

<template>
  <div class="form-group" :class="{ required: required }">
    <label v-if="title" :for="name"
      >{{ title }} <span v-if="required" class="required-star" aria-hidden="true">*</span></label
    >
    <input
      :id="name"
      v-model="model"
      :type="type"
      :name="name"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :minlength="minlength"
      :maxlength="maxlength"
      :class="{ 'input-error': touched && error }"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />
    <div v-if="error" :id="errorId" class="error-message" role="alert">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  min-height: 10dvh;
}

label {
  font-weight: 500;
}

input {
  padding: 0.75rem;
  border-radius: 10px;
  border-width: 1px;
  border-style: solid;
  font-size: 1rem;
}

/* Состояния валидации */
input.input-error {
  border-color: var(--color-error);
  background-color: #fff8f8;
}

input.input-error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.required-star {
  color: var(--color-error);
  margin-left: 0.25rem;
}

.error-message {
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 0.25rem;
  padding-left: 0.5rem;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
