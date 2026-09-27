<template>
  <v-navigation-drawer
      class="primary-navigation-drawer"
      color="navBG"
      permanent
      rail
      :width="256"
      :rail-width="56"
  >
    <v-list class="profile-dark-bg profile-header">
      <v-list-item
        link to="/profile"
      >
        <template #prepend>
          <v-avatar size="30">
            <v-img :src="userAvatar || '/img/icons/avatar.svg'" alt="User avatar" />
          </v-avatar>
        </template>
        <template #title>
          {{ userName }}
        </template>
        <template #subtitle>
          {{ userEmail }}
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav density="compact" active-color="primary">
        <v-list-item 
            link to="/"
            prepend-icon="mdi-server"
            v-if="authStore.hasPermission('pipeline:write') || authStore.hasPermission('pipeline:read')"
            :title="$t('navigation.pipelines')">
        </v-list-item>
        <v-list-item 
            link to="/templates" 
            v-if="kubero.templatesEnabled"
            prepend-icon="mdi-list-box-outline"
            :title="$t('navigation.templates')">
        </v-list-item>
        <v-list-item 
            link to="/activity"
            v-if="kubero.auditEnabled && (authStore.hasPermission('audit:write') || authStore.hasPermission('audit:read'))"
            prepend-icon="mdi-bell-outline"
            :title="$t('navigation.activity')">
        </v-list-item>
        <v-list-item 
            link to="/addons"
            prepend-icon="mdi-bookshelf"
            :title="$t('navigation.addOns')">
        </v-list-item>
        <v-list-item 
            link to="/accounts" 
            v-if="kubero.isAuthenticated && !kubero.adminDisabled && (authStore.hasPermission('user:write') || authStore.hasPermission('user:read'))"
            prepend-icon="mdi-account-outline"
            :title="$t('navigation.accounts')">
        </v-list-item>
        <v-list-item
          v-if="kubero.isAuthenticated && !kubero.adminDisabled && (authStore.hasPermission('config:write') || authStore.hasPermission('config:read'))"
          class="secondary-nav-trigger"
          role="button"
          tabindex="0"
          id="nav-settings-trigger"
          data-testid="settings-navigation-trigger"
          prepend-icon="mdi-cog-outline"
          :title="$t('navigation.settings')"
          :active="activeSecondary === 'settings' || isSettingsRoute"
          :aria-expanded="activeSecondary === 'settings'"
          aria-controls="secondary-nav-settings"
          @click="openSecondary('settings', $event)"
          @keydown.enter.prevent="openSecondary('settings', $event)"
          @keydown.space.prevent="openSecondary('settings', $event)"
        ></v-list-item>
    </v-list>


    <template v-slot:append>
        <v-divider></v-divider>
        <v-list nav dense class="profile-dark-bg">
            <v-list-item 
                @click="toggleTheme()"
                prepend-icon="mdi-theme-light-dark"
                :title="$t('navigation.theme')">
            </v-list-item>
            <v-list-item 
                link href="/api/docs" 
                target="_blank"
                prepend-icon="mdi-api"
                :title="$t('navigation.kuberoAPI')">
            </v-list-item>
            <v-list-item
                class="secondary-nav-trigger"
                role="button"
                tabindex="0"
                id="nav-documentation-trigger"
                data-testid="documentation-navigation-trigger"
                prepend-icon="mdi-book-open-variant"
                :title="$t('navigation.documentation')"
                :active="activeSecondary === 'documentation'"
                :aria-expanded="activeSecondary === 'documentation'"
                aria-controls="secondary-nav-documentation"
                @click="openSecondary('documentation', $event)"
                @keydown.enter.prevent="openSecondary('documentation', $event)"
                @keydown.space.prevent="openSecondary('documentation', $event)"
            ></v-list-item>
            <v-list-item 
                link href="https://github.com/kubero-dev/kubero" 
                target="_blank"
                prepend-icon="mdi-github"
                :title="$t('navigation.github')">
            </v-list-item>
            <!--
            <v-list-item 
                link href="https://www.reddit.com/r/kubero/" 
                target="_blank"
                prepend-icon="mdi-reddit"
                title="Reddit">
            </v-list-item>
            -->
            <v-list-item 
                link href="https://discord.gg/tafRPMWS4r" 
                target="_blank"
                prepend-icon="mdi-discord"
                :title="$t('navigation.discord')">
                <img src="./../../../public/img/icons/discord.svg" class="image-icon" alt="Discord"/>
            </v-list-item>
            <!--
            <v-list-item 
                link href="https://join.slack.com/t/kubero/shared_invite/zt-1leocjhrm-kYwk_dcwHUcEkcjUgQCFaA" 
                target="_blank"
                prepend-icon="mdi-slack"
                title="Slack">
            </v-list-item>
            -->
            <v-list-item
                @click="debugDialog = true"
                prepend-icon="mdi-star"
                :title="''+ kubero.version">
            </v-list-item>
            <v-list-item 
                @click="logout()" 
                v-if="kubero.isAuthenticated"
                prepend-icon="mdi-logout"
                :title="$t('navigation.logout')"
                class="logout-primary-item"
            >
            </v-list-item>
        </v-list>
    </template>
    <v-dialog
      v-model="debugDialog"
      width="auto"
    >
      <v-card
        min-width="400"
        color="cardBackground"
        class="uct-card"
        prepend-icon="mdi-information-outline"
        :title="$t('navigation.aboutKubero')"
      >
        <v-card-text>
            <v-row dense>
                <v-col cols="12">
                    <v-textarea
                    label="Debug"
                        :model-value="'Kubero UI Version: ' + kubero.version
                        + '\nKubero Operator Version: ' + kubero.operatorVersion
                        + '\nKubernetes Version: ' + kubero.kubernetesVersion
                        + '\nTemplates: ' + kubero.templatesEnabled
                        + '\nAdmin: ' + kubero.adminDisabled
                        + '\nWeb Console: ' + kubero.consoleEnabled
                        + '\nBuild Pipeline: ' + kubero.buildPipeline
                        + '\nMetrics: ' + kubero.metricsEnabled
                        + '\nAudit: ' + kubero.auditEnabled
                        + '\nZeropod Sleep: ' + kubero.sleepEnabled"
                        readonly
                        name="debug"
                        variant="filled"
                        auto-grow
                    ></v-textarea>

                    <a href="https://github.com/kubero-dev/kubero/releases" target="_blank">List of latest Kubero releases</a>
                </v-col>
                <!--
                <v-col cols="12">
                    <v-text-field
                        label="Kubero UI Version"
                        v-model="kubero.version"
                        readonly
                        density="compact"
                        variant="plain"
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field
                        label="Kubero Operotor Version"
                        v-model="kubero.operatorVersion"
                        readonly
                        density="compact"
                        variant="plain"
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-text-field
                        label="Kubernetes Version"
                        v-model="kubero.kubernetesVersion"
                        readonly
                        density="compact"
                        variant="plain"
                    ></v-text-field>
                </v-col>
                <v-col cols="12">
                    <v-checkbox readonly density="compact" label="Templates" v-model="kubero.templatesEnabled"></v-checkbox>
                    <v-checkbox readonly density="compact" label="Admin" v-model="kubero.adminDisabled"></v-checkbox>
                    <v-checkbox readonly density="compact" label="Web Console" v-model="kubero.consoleEnabled"></v-checkbox>
                    <v-checkbox readonly density="compact" label="Build Pipeline" v-model="kubero.buildPipeline"></v-checkbox>
                    <v-checkbox readonly density="compact" label="Metrics" v-model="kubero.metricsEnabled"></v-checkbox>
                    <v-checkbox readonly density="compact" label="Audit" v-model="kubero.auditEnabled"></v-checkbox>
                    <v-checkbox readonly density="compact" label="Zeropod Sleep" v-model="kubero.sleepEnabled"></v-checkbox>
                </v-col>
                -->
            </v-row>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            :text="$t('global.close')"
            @click="debugDialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-navigation-drawer>

  <div
    v-if="secondaryOpen"
    class="secondary-nav-scrim"
    data-testid="secondary-navigation-scrim"
    aria-hidden="true"
    @click="closeSecondary"
  ></div>

  <transition name="secondary-nav-slide">
    <secondary-nav-drawer
      v-if="activeSecondary"
      :id="secondaryId"
      :title="secondaryTitle"
      :close-label="$t('navigation.closeSubnavigation', { section: secondaryTitle })"
      :items="secondaryItems"
      :style="secondaryStyle"
      @close="closeSecondary"
      @select="closeSecondary"
    />
  </transition>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import axios from 'axios'
import SecondaryNavDrawer, { type SecondaryNavItem } from './SecondaryNavDrawer.vue'

const theme = useTheme()
const { t } = useI18n()
const route = useRoute()

const userAvatar = ref<string>('')
const userName = ref<string>('')
const userEmail = ref<string>('')
const activeSecondary = ref<'settings' | 'documentation' | null>(null)
const activeTrigger = ref<HTMLElement | null>(null)
const secondaryTop = ref(0)
const secondaryHeight = ref(0)
const secondaryHeaderHeight = ref(72)
let drawerResizeObserver: ResizeObserver | null = null

const settingsRoutes = ['/settings', '/runpacks', '/podsizes', '/notifications']
const isSettingsRoute = computed(() => settingsRoutes.includes(route.path))
const secondaryOpen = computed(() => activeSecondary.value !== null)
const secondaryId = computed(() => `secondary-nav-${activeSecondary.value ?? 'closed'}`)
const secondaryStyle = computed(() => ({
  top: `${secondaryTop.value}px`,
  bottom: 'auto',
  height: `${secondaryHeight.value}px`,
  '--secondary-nav-header-height': `${secondaryHeaderHeight.value}px`,
}))
const secondaryTitle = computed(() => activeSecondary.value === 'settings'
  ? t('navigation.settings')
  : t('navigation.documentation'))

const settingsItems = computed<SecondaryNavItem[]>(() => [
  { id: 'general', title: t('navigation.general'), icon: 'mdi-tune', to: '/settings' },
  { id: 'runpacks', title: t('navigation.runpacks'), icon: 'mdi-cube-outline', to: '/runpacks' },
  { id: 'podsizes', title: t('navigation.podSizes'), icon: 'mdi-arrow-expand-vertical', to: '/podsizes' },
  { id: 'notifications', title: t('navigation.notifications'), icon: 'mdi-email-fast-outline', to: '/notifications' },
])

const documentationItems = computed<SecondaryNavItem[]>(() => [
  {
    id: 'kubero-documentation',
    title: t('navigation.kuberoDocumentation'),
    icon: 'mdi-book-open-variant',
    href: 'https://www.kubero.dev/docs',
  },
  {
    id: 'uct-workflows',
    title: t('navigation.workflowsUCT'),
    icon: 'mdi-school',
    href: 'https://benjaminespinozafk.github.io/kubero-uct-docs/',
  },
])

const secondaryItems = computed(() => activeSecondary.value === 'settings'
  ? settingsItems.value
  : documentationItems.value)

async function loadUserProfile() {
  try {
    const res = await axios.get('/api/users/profile')
    userName.value = `${res.data.firstName || ''} ${res.data.lastName || ''}`.trim() || res.data.username
    userEmail.value = res.data.email
    userAvatar.value = res.data.image
  } catch {
    userName.value = 'Profile'
    userEmail.value = ''
    userAvatar.value = '/avatar.svg'
  }
}

function openSecondary(group: 'settings' | 'documentation', event: Event) {
  if (activeSecondary.value === group) {
    closeSecondary()
    return
  }

  activeTrigger.value = event.currentTarget as HTMLElement
  activeSecondary.value = group

  nextTick(() => {
    syncSecondaryGeometry()
    document.querySelector<HTMLElement>(`#secondary-nav-${group} .v-list-item`)?.focus()
  })
}

function syncSecondaryGeometry() {
  const drawer = document.querySelector<HTMLElement>('.primary-navigation-drawer')
  if (!drawer) return

  const rect = drawer.getBoundingClientRect()
  const profileHeader = drawer.querySelector<HTMLElement>('.profile-header')
  secondaryTop.value = rect.top
  secondaryHeight.value = rect.height
  secondaryHeaderHeight.value = profileHeader?.getBoundingClientRect().height ?? 72
}

function closeSecondary() {
  if (!activeSecondary.value) return

  const trigger = activeTrigger.value
  activeSecondary.value = null
  nextTick(() => trigger?.focus())
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && secondaryOpen.value) {
    event.preventDefault()
    closeSecondary()
  }
}

onMounted(() => {
  loadUserProfile()
  window.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('resize', syncSecondaryGeometry)

  const drawer = document.querySelector<HTMLElement>('.primary-navigation-drawer')
  if (drawer) {
    drawerResizeObserver = new ResizeObserver(syncSecondaryGeometry)
    drawerResizeObserver.observe(drawer)
    const profileHeader = drawer.querySelector<HTMLElement>('.profile-header')
    if (profileHeader) drawerResizeObserver.observe(profileHeader)
    syncSecondaryGeometry()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('resize', syncSecondaryGeometry)
  drawerResizeObserver?.disconnect()
})

function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    localStorage.setItem("theme", theme.global.name.value);
}

theme.global.name.value = localStorage.getItem("theme") || 'light';

</script>

<script lang="ts">
import { useCookies } from "vue3-cookies";
import router from "../../router"
import { defineComponent } from 'vue'
import { useKuberoStore } from '../../stores/kubero'
import { useAuthStore } from '../../stores/auth'
import { mapState } from 'pinia'

const authStore = useAuthStore();

const { cookies } = useCookies();

export default defineComponent({
  name: "NavDrawer",
    data() {
        return {
        version: '0.0.1',
        templatesEnabled: false,
        session: false,
        debugDialog: false,
        }
    },
    computed: {
      ...mapState(useKuberoStore, ['kubero']),
    },
    methods: {
        logout: () => {
            //localStorage.removeItem("kubero.JWT_TOKEN");
            // Remove cookie
            cookies.remove("kubero.JWT_TOKEN");
            router.push("/login")
        },
    },
    mounted() {
        //this.templatesEnabled = this.$store.state.templatesEnabled;
        //this.session = this.$store.state.session;
    }
});

</script>

<style scoped>

img.image-icon {
    width: 23px; 
    height: 23px; 
    margin-right: 10px; 
    left: 9px; 
    top: 11px; 
    position: absolute;
}

/* style for the light theme */
.v-theme--light img.image-icon {
    filter: brightness(0) saturate(100%) invert(37%) sepia(5%) saturate(133%) hue-rotate(202deg) brightness(97%) contrast(84%);
    /*filter: invert(39%) sepia(47%) saturate(584%) hue-rotate(228deg) brightness(95%) contrast(80%);
    /*filter: invert(93%) sepia(49%) saturate(7411%) hue-rotate(184deg) brightness(87%) contrast(90%);*/
}

/* style for the dark theme */
.v-theme--dark img.image-icon {
    filter: brightness(0) saturate(100%) invert(86%) sepia(6%) saturate(7%) hue-rotate(331deg) brightness(90%) contrast(86%);
    /*filter: invert(39%) sepia(47%) saturate(584%) hue-rotate(228deg) brightness(95%) contrast(80%);
    /*filter: invert(93%) sepia(49%) saturate(7411%) hue-rotate(184deg) brightness(87%) contrast(90%);*/
}
/* Make logout look like a primary nav item and stand out */
.logout-primary-item {
  color: #fff !important;
  background: rgb(var(--v-theme-primary)) !important;
  /*background: #333 !important;*/
  font-weight: 600;
  border-radius: 6px;
  margin-top: 8px;
  margin-bottom: 8px;
  transition: background 0.2s;
}
.logout-primary-item .v-list-item__prepend > .v-icon {
  color: #fff !important;
}
.logout-primary-item:hover {
  background: rgb(var(--v-theme-primary-darken1)) !important;
  /*background: #444 !important;*/
}
/* Dark background for profile list item */
.profile-dark-bg {
  background: rgba(var(--v-theme-secondary), 0.5) !important;
}

.secondary-nav-scrim {
  position: fixed;
  inset: 0 0 0 312px;
  z-index: 1006;
  background: rgba(14, 22, 32, 0.22);
}

.secondary-nav-slide-enter-active,
.secondary-nav-slide-leave-active {
  transition: transform 180ms ease, opacity 180ms ease;
}

.secondary-nav-slide-enter-from,
.secondary-nav-slide-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}

@media (prefers-reduced-motion: reduce) {
  .secondary-nav-slide-enter-active,
  .secondary-nav-slide-leave-active {
    transition: none;
  }
}
</style>

<style>
.v-navigation-drawer,
.v-navigation-drawer__content {
  overflow-x: hidden !important;
}
</style>
