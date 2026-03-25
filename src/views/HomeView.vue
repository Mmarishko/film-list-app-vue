<script setup lang="ts">
import BaseButton from '@/components/UI/BaseButton.vue'
import FilmsList from '@/components/Films/FilmsList.vue'
import { useAuth } from '@/composers/auth'

const { currentUser, isAuthenticated, handleLogout } = useAuth()
</script>

<template>
  <main>
    <h2 v-if="isAuthenticated">Hello, {{ currentUser?.name }}!</h2>
    <BaseButton class="logout" @click="handleLogout">Logout</BaseButton>
    <FilmsList />
  </main>
</template>

<style scoped>
.logout {
  margin: 0.75rem 0;
}
</style>
