<template>
  <v-container>
    <v-alert v-if="actionError" type="error" variant="tonal" closable class="ma-4" @click:close="actionError = ''">{{ actionError }}</v-alert>
    <v-alert v-if="loadError" type="warning" variant="tonal" class="ma-4">
      <div class="d-flex align-center justify-space-between ga-4">
        <span>{{ $t('accounts.errors.loadTokens') }}</span>
        <v-btn variant="outlined" color="warning" size="small" @click="loadTokens">{{ $t('accounts.retry') }}</v-btn>
      </div>
    </v-alert>
    <v-data-table
      v-if="!loadError"
      :headers="headers"
      :items="tokens"
      :loading="loading"
      class="elevation-0 border-0"
      item-key="id"
      :search="search"
    >
      <template #top>
        <v-text-field
          v-model="search"
          :label="$t('tokens.search')"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          outlined
          class="mx-0 mt-2"
          clearable
          density="compact"
        ></v-text-field>
      </template>
      <template v-slot:[`item.token`]="{ item }">
        {{ item.id }}
      </template>
      <template v-slot:[`item.user.username`]="{ item }">
        <span>{{ item.user?.username }}</span>
      </template>
      <template v-slot:[`item.expiresAt`]="{ item }">
        <span v-if="item.expiresAt">{{ new Date(item.expiresAt).toLocaleString() }}</span>
        <span v-else class="text--secondary">-</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          elevation="0"
          variant="tonal"
          size="small"
          class="ma-2"
          color="secondary"
          @click="deleteToken(item)"
          :aria-label="`${$t('global.delete')} ${item.name}`"
          :disabled="!writeUserPermission"
        >
          <v-icon color="primary">
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'TokensTable',
  setup() {
    const { t } = useI18n() 
    interface Token {
      id?: string;
      token?: string;
      name: string;
      expiresAt?: string;
      userId?: string;
      user?: {
        id: string;
        username: string;
      };
    }
    const tokens = ref<Token[]>([])
    const loading = ref(false)
    const loadError = ref(false)
    const actionError = ref('')
    const search = ref('')
    const authStore = useAuthStore()
    const writeUserPermission = ref(authStore.hasPermission('token:ok') || authStore.hasPermission('token:write'))

    const headers = [
      { title: t('tokens.form.id'), value: 'token' },
      { title: t('tokens.form.name'), value: 'name' },
      { title: t('tokens.form.owner'), value: 'user.username' },
      { title: t('tokens.form.expiresAt'), value: 'expiresAt' },
      { title: '', value: 'actions', sortable: false, align: 'end' as const },
    ]

    const loadTokens = async () => {
      loading.value = true
      loadError.value = false
      try {
        const res = await axios.get('/api/tokens')
        tokens.value = res.data
      } catch (e) {
        tokens.value = []
        loadError.value = true
      }
      loading.value = false
    }

    const deleteToken = async (token: Token) => {
      try {
        await axios.delete(`/api/tokens/${token.id}`)
        await loadTokens()
      } catch (e) {
        const message = (e as any)?.response?.data?.message
        actionError.value = Array.isArray(message) ? message.join(', ') : message || (e as Error)?.message || t('accounts.errors.action')
      }
    }

    onMounted(() => {
      loadTokens()
    })

    return {
      tokens,
      headers,
      loading,
      loadError,
      actionError,
      loadTokens,
      search,
      deleteToken,
      writeUserPermission,
    }
  },
})
</script>
