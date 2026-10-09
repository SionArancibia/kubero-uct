<template>
  <v-container class="activity-page">
    <header class="activity-header">
      <div>
        <h1 class="uct-h1">{{ $t('navigation.activity') }}</h1>
        <p>{{ $t('activity.description') }}</p>
      </div>
      <v-btn prepend-icon="mdi-refresh" variant="tonal" color="primary" :loading="loading" @click="loadAudit">{{ $t('activity.refresh') }}</v-btn>
    </header>

    <v-card class="uct-card" color="cardBackground" elevation="0">
      <form class="activity-filters" @submit.prevent="applyFilters">
        <v-text-field v-model="filters.pipeline" :label="$t('navigation.pipelines')" :hint="$t('activity.pipelineHint')" variant="outlined" density="comfortable" clearable hide-details="auto" />
        <v-combobox v-model="filters.action" :items="actions" :label="$t('activity.action')" variant="outlined" density="comfortable" clearable hide-details />
        <v-text-field v-model="filters.username" :label="$t('activity.user')" variant="outlined" density="comfortable" clearable hide-details />
        <v-text-field v-model="filters.from" type="date" :label="$t('activity.from')" variant="outlined" density="comfortable" hide-details />
        <v-text-field v-model="filters.to" type="date" :label="$t('activity.to')" variant="outlined" density="comfortable" hide-details />
        <div class="activity-filter-actions">
          <v-btn type="submit" color="primary" elevation="0" :disabled="loading">{{ $t('activity.apply') }}</v-btn>
          <v-btn variant="text" :disabled="loading" @click="resetFilters">{{ $t('activity.clear') }}</v-btn>
        </div>
      </form>

      <v-alert v-if="error" type="error" variant="tonal" class="ma-4" role="alert">{{ error }}</v-alert>
      <v-alert v-else-if="!enabled" type="info" variant="tonal" class="ma-4">{{ $t('activity.disabled') }}</v-alert>
      <div class="activity-summary" role="status" aria-live="polite">{{ $t('activity.count', { count }) }}</div>
      <v-progress-linear v-if="loading" indeterminate color="primary" :aria-label="$t('activity.loading')" />

      <v-table v-if="!error && enabled" class="activity-table" :aria-busy="loading" :aria-label="$t('navigation.activity')">
        <thead><tr>
          <th>{{ $t('activity.date') }}</th><th>{{ $t('activity.user') }}</th><th>{{ $t('navigation.pipelines') }}</th><th>{{ $t('activity.action') }}</th><th>{{ $t('activity.details') }}</th>
        </tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="5"><v-skeleton-loader type="table-row@5" /></td></tr>
          <tr v-else-if="auditEvents.length === 0"><td colspan="5" class="activity-empty">{{ $t('activity.empty') }}</td></tr>
          <tr v-for="event in loading ? [] : auditEvents" :key="event.id">
            <td><time :datetime="event.timestamp">{{ formatDate(event.timestamp) }}</time></td>
            <td>{{ event.users?.username || $t('activity.system') }}</td>
            <td><strong>{{ event.pipeline || $t('activity.system') }}</strong><div class="text-caption">{{ [event.phase, event.app].filter(Boolean).join(' / ') }}</div></td>
            <td><v-chip size="small" variant="tonal" :color="event.action === 'delete' ? 'error' : 'primary'">{{ event.action }}</v-chip><div class="text-caption">{{ event.resource }}</div></td>
            <td>{{ event.message }}</td>
          </tr>
        </tbody>
      </v-table>

      <footer class="activity-footer">
        <v-select v-model="limit" :items="[20, 50, 100]" :label="$t('activity.pageSize')" variant="outlined" density="compact" hide-details :disabled="loading" @update:model-value="changePageSize" />
        <v-pagination v-model="page" :length="pageCount" :total-visible="5" :disabled="loading || !!error || !enabled" :aria-label="$t('activity.pages')" @update:model-value="loadAudit" />
        <span role="status">{{ $t('activity.range', { start: count ? (page - 1) * limit + 1 : 0, end: Math.min(page * limit, count), count }) }}</span>
      </footer>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

type AuditEvent = {
  id: number
  timestamp: string
  pipeline: string
  phase: string
  app: string
  action: string
  resource: string
  message: string
  users?: { username: string }
}
const { t, locale } = useI18n()
const emptyFilters = () => ({ pipeline: '', action: '', username: '', from: '', to: '' })
const filters = reactive(emptyFilters())
const appliedFilters = ref(emptyFilters())
const actions = ['create', 'update', 'delete', 'start', 'stop', 'restart', 'scale', 'rollback', 'promote', 'demote', 'approve', 'reject', 'pause', 'resume', 'deploy', 'undeploy', 'release']
const auditEvents = ref<AuditEvent[]>([])
const loading = ref(false)
const enabled = ref(true)
const error = ref('')
const page = ref(1)
const limit = ref(20)
const count = ref(0)
const pageCount = computed(() => Math.max(1, Math.ceil(count.value / limit.value)))
let request: AbortController | undefined

function dateBoundary(value: string, nextDay = false) {
  const date = new Date(`${value}T00:00:00`)
  if (nextDay) date.setDate(date.getDate() + 1)
  return date.toISOString()
}

async function loadAudit() {
  request?.abort()
  const current = new AbortController()
  request = current
  loading.value = true
  error.value = ''
  try {
    const selected = appliedFilters.value
    const response = await axios.get('/api/audit', { signal: current.signal, params: {
      page: page.value, limit: limit.value,
      pipeline: selected.pipeline?.trim() || undefined,
      action: selected.action?.trim() || undefined,
      username: selected.username?.trim() || undefined,
      from: selected.from ? dateBoundary(selected.from) : undefined,
      to: selected.to ? dateBoundary(selected.to, true) : undefined,
    } })
    if (current.signal.aborted) return
    count.value = response.data.count
    enabled.value = response.data.enabled !== false
    if (page.value > pageCount.value) {
      page.value = pageCount.value
      await loadAudit()
      return
    }
    auditEvents.value = response.data.audit
  } catch (cause) {
    if (current.signal.aborted) return
    auditEvents.value = []
    count.value = 0
    error.value = axios.isAxiosError(cause) && cause.response?.status === 403 ? t('activity.forbidden') : t('activity.error')
  } finally {
    if (request === current) loading.value = false
  }
}

function applyFilters() {
  if (filters.from && filters.to && filters.from > filters.to) {
    error.value = t('activity.invalidDates')
    return
  }
  appliedFilters.value = { ...filters }
  page.value = 1
  void loadAudit()
}

function resetFilters() {
  Object.assign(filters, emptyFilters())
  applyFilters()
}

function changePageSize() {
  page.value = 1
  void loadAudit()
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value))
}

onMounted(loadAudit)
onBeforeUnmount(() => request?.abort())
</script>

<style scoped>
.activity-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.activity-header p { margin: 8px 0 0; font-size: .875rem; }
.activity-filters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 16px; padding: 24px; }
.activity-filter-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.activity-summary { padding: 12px 24px; border-block: 1px solid var(--uct-corp-gray-border); font-size: .875rem; }
.activity-table { background: transparent; }
.activity-table :deep(th) { font-size: .75rem; font-weight: 600; }
.activity-table :deep(td) { padding-block: 12px; vertical-align: top; font-size: .875rem; overflow-wrap: anywhere; }
.activity-table :deep(td:last-child) { min-width: 240px; }
.activity-table time { white-space: nowrap; font-variant-numeric: tabular-nums; }
.activity-empty { text-align: center; padding: 40px !important; }
.activity-footer { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 16px 24px; border-top: 1px solid var(--uct-corp-gray-border); font-size: .8125rem; }
.activity-footer .v-select { flex: 0 0 170px; }
@media (max-width: 700px) {
  .activity-header { align-items: flex-start; flex-direction: column; }
  .activity-filters { grid-template-columns: 1fr; padding: 16px; }
  .activity-footer { justify-content: center; padding: 16px; }
}
</style>
