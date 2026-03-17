<script setup lang="ts">
import { type ButtonHTMLAttributes } from 'vue'

interface ButtonProps {
  buttonType?: ButtonHTMLAttributes['type']
  disabled?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), { buttonType: 'button', disabled: false })

const emit = defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button class="button" :type="buttonType" @click="emit('click')" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<style scoped>
.button {
  margin: 0.75rem 0;
  padding: 0.75rem;
  border-radius: 10px;
  border: none;
  color: white;
  background-color: var(--color-button-primary);
  border-color: var(--color-button-primary);
  cursor: pointer;
}
</style>
