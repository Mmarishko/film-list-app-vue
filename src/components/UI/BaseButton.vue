<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from 'vue'

type buttonColor = 'primary' | 'red'

interface ButtonProps {
  buttonType?: ButtonHTMLAttributes['type']
  disabled?: boolean
  color?: buttonColor
}

const props = withDefaults(defineProps<ButtonProps>(), {
  buttonType: 'button',
  disabled: false,
  color: 'primary',
})

const emit = defineEmits<{ (e: 'click', event: Event): void }>()

const classes = computed(() => ({
  red: props.color && props.color === 'red',
  primary: props.color && props.color === 'primary',
}))
</script>

<template>
  <button
    class="button"
    :class="classes"
    :type="buttonType"
    @click="emit('click', $event)"
    :disabled="disabled"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  padding: 0.75rem;
  border-radius: 10px;
  border: none;
  color: white;
  border-color: var(--color-button-primary);
  cursor: pointer;
}

.primary {
  background-color: var(--color-button-primary);
}
.primary:hover {
  background: var(--color-primary-dark, #33a06f);
}

.red {
  background-color: var(--color-button-red);
}
.red:hover {
  background: var(--color-primary-dark, #cc5b66);
}
</style>
