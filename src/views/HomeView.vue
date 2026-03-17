<script setup lang="ts">
import FilmsList from '@/components/Films/FilmsList.vue'
import BaseButton from '@/components/UI/BaseButton.vue'
import { useAuth } from '@/composers/auth'

const { currentUser, isAuthenticated, handleLogout } = useAuth()
</script>

<template>
  <main>
    <h1 v-if="isAuthenticated">Hello, {{ currentUser?.name }}!</h1>
    <BaseButton @click="handleLogout">Logout</BaseButton>
    <FilmsList />
  </main>
</template>
