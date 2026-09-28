<template>
  <v-container class="accounts-page" fluid>


    <header class="accounts-header">
      <div class="accounts-heading">
        <div class="accounts-heading__icon" aria-hidden="true">
          <v-icon :icon="activeSection.icon" size="24" />
        </div>
        <div>
          <h1 class="uct-h1">{{ activeSection.title }}</h1>
          <p>{{ activeSection.description }}</p>
        </div>
      </div>
      <v-btn
        v-if="activeSection.createLabel"
        color="primary"
        prepend-icon="mdi-plus"
        :disabled="!canWrite"
        @click="openCreateDialog"
      >
        {{ activeSection.createLabel }}
      </v-btn>
    </header>



    <main class="accounts-workspace" tabindex="0" :aria-label="activeSection.title">
      <component :is="activeSection.component" :key="activeSection.key" ref="sectionComponent" />
    </main>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref, type ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Breadcrumbs from '../breadcrumbs.vue'
import Users from './users.vue'
import Teams from './teams.vue'
import Roles from './roles.vue'
import Tokens from './tokens.vue'
import { useAuthStore } from '../../stores/auth'

type AccountSection = 'users' | 'teams' | 'roles' | 'tokens'
type SectionInstance = ComponentPublicInstance & { openCreateDialog?: () => void | Promise<void> }

const { t } = useI18n()
const route = useRoute()
const authStore = useAuthStore()
const sectionComponent = ref<SectionInstance | null>(null)

const currentSection = computed<AccountSection>(() => {
  const section = route.meta.accountSection
  return section === 'teams' || section === 'roles' || section === 'tokens' ? section : 'users'
})

const activeSection = computed(() => {
  const sections = {
    users: {
      key: 'users',
      title: t('accounts.users'),
      description: t('accounts.descriptions.users'),
      icon: 'mdi-account-multiple-outline',
      component: Users,
      createLabel: t('user.actions.create'),
    },
    teams: {
      key: 'teams',
      title: t('accounts.teams'),
      description: t('accounts.descriptions.teams'),
      icon: 'mdi-account-group-outline',
      component: Teams,
      createLabel: t('teams.actions.create'),
    },
    roles: {
      key: 'roles',
      title: t('accounts.roles'),
      description: t('accounts.descriptions.roles'),
      icon: 'mdi-shield-account-outline',
      component: Roles,
      createLabel: t('roles.actions.create'),
    },
    tokens: {
      key: 'tokens',
      title: t('accounts.tokens'),
      description: t('accounts.descriptions.tokens'),
      icon: 'mdi-key-chain-variant',
      component: Tokens,
      createLabel: '',
    },
  }
  return sections[currentSection.value]
})

const canWrite = computed(() => currentSection.value === 'tokens'
  ? authStore.hasPermission('token:ok') || authStore.hasPermission('token:write')
  : authStore.hasPermission('user:write'))
const breadcrumbItems = computed(() => [
  { title: t('navigation.accounts'), disabled: false, href: '/accounts/users' },
  { title: activeSection.value.title, disabled: true, href: route.path },
])

function openCreateDialog() {
  sectionComponent.value?.openCreateDialog?.()
}
</script>

<style scoped>
.accounts-page { max-width: 1440px; padding: 28px 28px 48px; }
.accounts-header { display: flex; justify-content: space-between; gap: 24px; align-items: flex-start; margin: 10px 0 22px; }
.accounts-heading { display: flex; gap: 14px; align-items: flex-start; }
.accounts-heading__icon { display: grid; width: 42px; height: 42px; flex: 0 0 42px; place-items: center; border-radius: 8px; background: rgba(var(--v-theme-primary), .1); color: rgb(var(--v-theme-primary)); }
.accounts-heading h1 { margin: 0; }
.accounts-heading p { max-width: 72ch; margin: 6px 0 0; color: rgb(var(--v-theme-on-background)); font-size: .875rem; line-height: 1.55; opacity: .72; }
.accounts-context { display: flex; gap: 8px; align-items: center; margin-bottom: 10px; color: rgb(var(--v-theme-on-background)); font-size: .6875rem; letter-spacing: .045em; text-transform: uppercase; }
.accounts-context span { opacity: .62; }
.accounts-context strong { color: rgb(var(--v-theme-primary)); font-weight: 600; }
.accounts-workspace { overflow: hidden; border: 1px solid var(--uct-corp-gray-border); border-radius: 8px; background: rgb(var(--v-theme-cardBackground)); }
.accounts-workspace :deep(.v-container) { max-width: none; padding: 0; }
.accounts-workspace :deep(.v-data-table) { background: transparent; }
.accounts-workspace :deep(.v-data-table__top) { padding: 18px 20px; border-bottom: 1px solid var(--uct-corp-gray-border); }
.accounts-workspace :deep(.v-data-table__top .v-input) { max-width: 520px; margin: 0 !important; }
.accounts-workspace :deep(.v-data-table-header__content) { color: rgb(var(--v-theme-on-cardBackground)); font-size: .6875rem; font-weight: 600; letter-spacing: .05em; text-transform: uppercase; opacity: .68; }
.accounts-workspace :deep(tbody td) { color: rgb(var(--v-theme-on-cardBackground)); font-size: .8125rem; }
.accounts-workspace :deep(tbody tr) { transition: background-color 140ms ease-out; }
.accounts-workspace :deep(tbody tr:hover) { background: rgba(var(--v-theme-primary), .045); }
.accounts-workspace :deep(.v-data-table-footer) { border-top: 1px solid var(--uct-corp-gray-border); }
.accounts-workspace :deep(.legacy-create-control) { display: none !important; }

@media (max-width: 700px) {
  .accounts-page { padding: 20px 14px 36px; }
  .accounts-header { align-items: stretch; flex-direction: column; }
  .accounts-header > .v-btn { align-self: flex-start; }
  .accounts-heading__icon { width: 38px; height: 38px; flex-basis: 38px; }
  .accounts-workspace { overflow-x: auto; }
  .accounts-workspace :deep(.v-data-table) { min-width: 780px; }
}

@media (prefers-reduced-motion: reduce) {
  .accounts-workspace :deep(tbody tr) { transition: none; }
}
</style>
