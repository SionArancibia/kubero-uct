<template>
  <v-container>
    <v-alert v-if="actionError" type="error" variant="tonal" closable class="ma-4" @click:close="actionError = ''">{{ actionError }}</v-alert>
    <v-alert v-if="loadError" type="warning" variant="tonal" class="ma-4">
      <div class="d-flex align-center justify-space-between ga-4">
        <span>{{ $t('accounts.errors.loadRoles') }}</span>
        <v-btn variant="outlined" color="warning" size="small" @click="loadRoles">{{ $t('accounts.retry') }}</v-btn>
      </div>
    </v-alert>
    <v-data-table
      v-if="!loadError"
      :headers="headers"
      :items="roles"
      :loading="loading"
      class="elevation-0 border-0"
      item-key="id"
      :search="search"
    >
      <template #top>
        <v-text-field
          v-model="search"
          :label="$t('roles.search')"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          outlined
          class="mx-0 mt-2"
          clearable
          density="compact"
        ></v-text-field>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        <span>
          <v-chip
            class="ma-2"
            color="primary"
            label
          >
            <v-icon icon="mdi-account-circle-outline" start></v-icon>
            {{ item.name}}
          </v-chip>
        </span>
      </template>
      <template v-slot:[`item.permissions`]="{ item }">
        <span v-for="permission in item.permissions" :key="permission.id">
          {{ permission.resource }}: {{ permission.action }}
        </span>
      </template>
      <template v-slot:[`item.permissionsApp`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'app')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'app') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsPipeline`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'pipeline')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'pipeline') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsAccount`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'user')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'user') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsConfig`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'config')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'config') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsAudit`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'audit')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'audit') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsToken`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'token')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'token') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsConsole`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'console')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'console') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsLogs`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'logs')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'logs') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.permissionsReboot`]="{ item }">
        <span role="img" :aria-label="getResourcePermissionLabel(item.permissions, 'reboot')">
          <v-icon
            color="primary"
            aria-hidden="true"
          >
            {{getResourcePermissions(item.permissions, 'reboot') }}
          </v-icon>
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          elevation="0"
          variant="tonal"
          size="small"
          class="ma-2"
          color="secondary"
          @click="openEditRoleDialog(item)"
          :aria-label="`${$t('global.edit')} ${item.name}`"
          :disabled="item.name === 'admin' || !writeUserPermission"
        >
          <v-icon color="primary">
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          elevation="0"
          variant="tonal"
          size="small"
          class="ma-2"
          color="secondary"
          @click="deleteRole(item)"
          :aria-label="`${$t('global.delete')} ${item.name}`"
          :disabled="item.name === 'admin' || item.name === 'guest' || item.name === 'member' || !writeUserPermission"
        >
          <v-icon color="primary">
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Button to add a role -->
    <div class="legacy-create-control">
      <v-btn
        fab
        color="primary"
        style="margin-right: 6px;"
        @click="openCreateDialog"
        :disabled="!writeUserPermission"
      >
        <v-icon>mdi-plus</v-icon>
        <span class="sr-only">{{ $t('roles.actions.create') }}</span>
      </v-btn>
    </div>

    <!-- Dialog to edit a role -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card color="cardBackground" class="uct-card">
        <v-card-title class="text-h6 font-weight-bold">{{ $t('roles.actions.edit') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="editedRole.name" :label="$t('roles.form.name')"></v-text-field>
          <v-text-field v-model="editedRole.description" :label="$t('roles.form.description')"></v-text-field>
          <v-table density="compact" class="mb-4">
            <tbody>
              <tr>
                <td>{{ $t('roles.form.permissions.apps') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="editedRole.permissions[0].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.pipelines') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="editedRole.permissions[1].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.accounts') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="editedRole.permissions[2].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.settings') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="editedRole.permissions[3].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.tokens') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="editedRole.permissions[4].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="own" value="ok"></v-radio>
                    <v-radio label="all" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.audit') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="editedRole.permissions[5].action" label=""></v-switch>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.console') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="editedRole.permissions[6].action" label=""></v-switch>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.logs') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="editedRole.permissions[7].action" label=""></v-switch>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.reboot') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="editedRole.permissions[8].action" label=""></v-switch>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="editDialog = false">{{ $t('global.abort') }}</v-btn>
          <v-btn color="primary" @click="saveEdit">{{ $t('global.save') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for a new Role -->
    <v-dialog v-model="createDialog" max-width="500px">
      <v-card color="cardBackground" class="uct-card">
        <v-card-title class="text-h6 font-weight-bold">{{ $t('roles.actions.create') }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="newRole.name" :label="$t('roles.form.name')"></v-text-field>
          <v-text-field v-model="newRole.description" :label="$t('roles.form.description')"></v-text-field>
          <v-table density="compact" class="mb-4">
            <tbody>
              <tr>
                <td>{{ $t('roles.form.permissions.apps') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="newRole.permissions[0].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.pipelines') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="newRole.permissions[1].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.accounts') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="newRole.permissions[2].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.settings') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="newRole.permissions[3].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="read" value="read"></v-radio>
                    <v-radio label="write" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.tokens') }} {{ $t('roles.permission') }}</td>
                <td>
                  <v-radio-group v-model="newRole.permissions[4].action" inline>
                    <v-radio label="none" value="none"></v-radio>
                    <v-radio label="own" value="ok"></v-radio>
                    <v-radio label="all" value="write"></v-radio>
                  </v-radio-group>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.audit') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="newRole.permissions[5].action" label=""></v-switch>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.console') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="newRole.permissions[6].action" label=""></v-switch>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.logs') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="newRole.permissions[7].action" label=""></v-switch>
                </td>
              </tr>
              <tr>
                <td>{{ $t('roles.form.permissions.reboot') }}</td>
                <td>
                  <v-switch color="primary" value="ok" false-value="none" v-model="newRole.permissions[8].action" label=""></v-switch>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="createDialog = false">{{ $t('global.abort') }}</v-btn>
          <v-btn color="primary" @click="saveCreate">{{ $t('global.create') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'RolesTable',
  setup() {
    const { t } = useI18n() 
    interface Role {
      id: string | number;
      name: string;
      permissions?: Permission[]; 
    }
    interface Permission {
      id: string | number;
      resource: string;
      action: string;
    }
    const roles = ref<Role[]>([])
    const loading = ref(false)
    const loadError = ref(false)
    const actionError = ref('')
    const search = ref('')
    const editDialog = ref(false)
    const createDialog = ref(false)
    const editedRole = ref<Role | any>({})
    // Orden de las filas de los diálogos: los v-model usan estas posiciones
    const RESOURCES = ['app', 'pipeline', 'user', 'config', 'token', 'audit', 'console', 'logs', 'reboot']
    // Los permisos llegan de la BD en el orden en que se crearon, que no es el
    // de los diálogos (en los roles de la semilla la fila "Console" editaba
    // audit, y así). Se arman por recurso para que cada fila edite el suyo.
    const permissionsByResource = (permissions: Permission[] = []) =>
      RESOURCES.map((resource) => ({
        resource,
        action: permissions.find((p) => p.resource === resource)?.action ?? 'none',
      }))
    const newRole = ref<Role | any>({
      name: '',
      description: '',
      permissions: permissionsByResource(),
    })
    const authStore = useAuthStore();
    const writeUserPermission = authStore.hasPermission('user:write')

    const headers = [
      { title: t('roles.name'), value: 'name' },
      //{ title: 'Permissions', value: 'permissions' },
      { title: t('roles.form.permissions.apps'), value: 'permissionsApp', align: 'center' as const },
      { title: t('roles.form.permissions.pipelines'), value: 'permissionsPipeline', align: 'center' as const },
      { title: t('roles.form.permissions.accounts'), value: 'permissionsAccount', align: 'center' as const},
      { title: t('roles.form.permissions.settings'), value: 'permissionsConfig', align: 'center' as const},
      { title: t('roles.form.permissions.tokens'), value: 'permissionsToken', align: 'center' as const},
      { title: t('roles.form.permissions.audit'), value: 'permissionsAudit', align: 'center' as const},
      { title: t('roles.form.permissions.console'), value: 'permissionsConsole', align: 'center' as const},
      { title: t('roles.form.permissions.logs'), value: 'permissionsLogs', align: 'center' as const},
      { title: t('roles.form.permissions.reboot'), value: 'permissionsReboot', align: 'center' as const},

      { title: '', value: 'actions', sortable: false, align: 'end' as const },
    ]

    const loadRoles = async () => {
      loading.value = true
      loadError.value = false
      try {
        const res = await axios.get('/api/roles')
        roles.value = res.data
      } catch (e) {
        roles.value = []
        loadError.value = true
      }
      loading.value = false
    }

    const openEditRoleDialog = (role: Role) => {
      editedRole.value = { ...role, permissions: permissionsByResource(role.permissions) }
      editDialog.value = true
    }

    const saveEdit = async () => {
      try {
        await axios.put(`/api/roles/${editedRole.value.id}`, editedRole.value)
        await loadRoles()
        editDialog.value = false
      } catch (e) {
        actionError.value = errorText(e)
      }
    }

    const deleteRole = async (role: Role) => {
      try {
        await axios.delete(`/api/roles/${role.id}`)
        await loadRoles()
      } catch (e) {
        actionError.value = errorText(e)
      }
    }

    const openCreateDialog = () => {
      newRole.value = {
        name: '',
        description: '',
        permissions: permissionsByResource(),
      }
      createDialog.value = true
    }

    const saveCreate = async () => {
      try {
        await axios.post('/api/roles', newRole.value)
        await loadRoles()
        createDialog.value = false
      } catch (e) {
        actionError.value = errorText(e)
      }
    }
/*
    const getResources = async () => {
      try {
        const res = await axios.get('/api/roles/resources')
        return res.data
      } catch (e) {
        console.error('Error fetching resources:', e)
        return []
      }
    }
*/
    const getResourcePermissions = (permissions: any, resource: string) => {
      for (const permission of permissions) {
        if (permission.resource === resource) {
          switch (permission.action) {
            case 'write':
              return 'mdi-pencil';
            case 'read':
              return 'mdi-eye';
            case 'ok':
              return 'mdi-check';
            default:
              return 'mdi-minus';
          }
        }
      }
      return 'mdi-cancel'
    }
    const resourceLabelKeys: Record<string, string> = {
      app: 'roles.form.permissions.apps',
      pipeline: 'roles.form.permissions.pipelines',
      user: 'roles.form.permissions.accounts',
      config: 'roles.form.permissions.settings',
      token: 'roles.form.permissions.tokens',
      audit: 'roles.form.permissions.audit',
      console: 'roles.form.permissions.console',
      logs: 'roles.form.permissions.logs',
      reboot: 'roles.form.permissions.reboot',
    }
    const getResourcePermissionLabel = (permissions: Permission[] = [], resource: string) => {
      const level = permissions.find((permission) => permission.resource === resource)?.action ?? 'none'
      return t('roles.permissionLabel', {
        resource: t(resourceLabelKeys[resource]),
        level: t(`roles.levels.${level}`),
      })
    }
    const errorText = (e: any): string => {
      const message = e?.response?.data?.message
      if (Array.isArray(message)) return message.join(', ')
      return message || e?.message || t('accounts.errors.action')
    }
      
    onMounted(() => {
      loadRoles()
    })

    return {
      roles,
      headers,
      loading,
      loadError,
      actionError,
      loadRoles,
      search,
      editDialog,
      createDialog,
      editedRole,
      newRole,
      openEditRoleDialog,
      saveEdit,
      deleteRole,
      openCreateDialog,
      saveCreate,
      getResourcePermissions,
      getResourcePermissionLabel,
      writeUserPermission,
    }
  },
})
</script>
