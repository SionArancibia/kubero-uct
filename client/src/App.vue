<template>
  <router-view />
  <global-notifications />
</template>

<script setup lang="ts">
import GlobalNotifications from '@/components/GlobalNotifications.vue'
</script>

<style>
a {
  text-decoration: none;
  color: rgba(var(--v-theme-primary), var(--v-high-emphasis-opacity));
}

</style>
