<template>
  <aside
    class="notification-center"
    :aria-label="$t('feedback.regionLabel')"
  >
    <TransitionGroup name="notification-list" tag="div" class="notification-list">
      <v-alert
        v-for="notification in notificationStore.items"
        :key="notification.id"
        class="global-notification"
        :type="notification.kind"
        variant="elevated"
        density="comfortable"
        closable
        :close-label="$t('global.close')"
        :role="notification.kind === 'error' ? 'alert' : 'status'"
        :aria-live="notification.kind === 'error' ? 'assertive' : 'polite'"
        aria-atomic="true"
        @click:close="notificationStore.dismiss(notification.id)"
      >
        <template #title>
          <span class="global-notification__title">{{ notification.title }}</span>
        </template>
        <span class="global-notification__message">{{ notification.message }}</span>
      </v-alert>
    </TransitionGroup>
  </aside>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'

const notificationStore = useNotificationStore()
</script>

<style scoped>
.notification-center {
  position: fixed;
  z-index: 2500;
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
  width: min(400px, calc(100vw - 32px));
  pointer-events: none;
}

.notification-list {
  display: grid;
  gap: 12px;
}

.global-notification {
  pointer-events: auto;
  border: 1px solid rgba(var(--v-theme-on-background), 0.14);
  border-radius: 8px;
  box-shadow: 0 12px 32px rgba(14, 22, 32, 0.2);
}

.global-notification__title {
  font-size: 0.875rem;
  font-weight: 600;
}

.global-notification__message {
  display: block;
  max-width: 38ch;
  font-size: 0.8125rem;
  line-height: 1.45;
}

.notification-list-enter-active,
.notification-list-leave-active {
  transition:
    opacity 180ms ease-out,
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.notification-list-move {
  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 600px) {
  .notification-center {
    top: max(12px, env(safe-area-inset-top));
    right: 12px;
    left: 12px;
    width: auto;
  }

  .global-notification__message {
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .notification-list-enter-active,
  .notification-list-leave-active,
  .notification-list-move {
    transition: none;
  }
}
</style>
