<script setup lang="ts">
import BaseButton from '@/components/UI/BaseButton.vue'
import BaseInput from '@/components/UI/BaseInput.vue'
import { useAuth } from '@/composers/auth'
import { computed } from 'vue'

const { login, password, error, loading, handleAuth } = useAuth()

const isFormValid = computed(() => login && password)
</script>

<template>
  <main>
    <section class="auth-form">
      <h1>Authorization</h1>
      <form class="auth" @submit.prevent="handleAuth">
        <BaseInput
          :type="'text'"
          v-model="login"
          :name="'login'"
          :placeholder="'Enter login'"
          :title="'Login'"
          :required="true"
          :pattern="'^[A-Za-zА-Яа-яёЁ0-9]+$'"
        />

        <BaseInput
          :type="'password'"
          v-model="password"
          :name="'password'"
          :placeholder="'Enter password'"
          :title="'Password'"
          :required="true"
          :minlength="6"
        />
        <div v-if="error" class="error">{{ error }}</div>

        <BaseButton
          class="submit-button"
          :button-type="'submit'"
          :disabled="loading || !isFormValid"
          ><span v-if="loading" class="spinner"></span
          >{{ loading ? 'Login in...' : 'Login' }}</BaseButton
        >
      </form>
    </section>
  </main>
</template>

<style scoped>
h1 {
  margin-bottom: 1rem;
}

.auth-form {
  max-width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
}

.auth {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.error {
  color: var(--color-error);
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 1px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
