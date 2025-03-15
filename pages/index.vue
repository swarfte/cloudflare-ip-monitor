<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <!-- Header Section -->
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">DNS Sync Manager</h1>
        <div class="mt-2 flex items-center space-x-4 text-gray-600">
          <div class="flex items-center space-x-2">
            <i class="fas fa-network-wired"></i>
            <span>Current IP: <span class="font-semibold">{{ currentIP }}</span></span>
          </div>
          <div class="flex items-center space-x-2">
            <i class="fas fa-clock"></i>
            <span>Next Sync: <span class="font-semibold">{{ nextSyncTime }}</span></span>
          </div>
        </div>
      </div>

      <button @click="openSettings"
        class="group relative p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
        <i class="fas fa-cog text-2xl text-gray-600 group-hover:rotate-180 transition-all duration-500"></i>
      </button>
    </header>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">Domain Records</h2>
          <button @click="openAddDialog" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg 
                         flex items-center space-x-2 transition-all duration-200 
                         hover:shadow-lg transform hover:-translate-y-0.5">
            <i class="fas fa-plus"></i>
            <span>Add Record</span>
          </button>
        </div>
      </div>

      <!-- Table Content -->
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proxied</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="record in records" :key="record.domain" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.domain }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="record.proxied ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ record.proxied ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ record.syncedTime }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="record.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ record.result }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button @click="deleteRecord(record.domain)"
                class="text-red-600 hover:text-red-800 transition-colors duration-150">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Start Task Button -->
    <div class="mt-6 flex justify-center">
      <button @click="startSync" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg
                     flex items-center space-x-3 transition-all duration-200
                     hover:shadow-lg transform hover:-translate-y-0.5">
        <i class="fas fa-sync-alt"></i>
        <span>Start Sync Task</span>
      </button>
    </div>

    <!-- Add Record Dialog -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
            transition-opacity duration-300 z-50">
      <div class="bg-white rounded-xl p-6 w-[480px] transform transition-all duration-300 scale-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Add New Record</h3>
          <button @click="closeAddDialog" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Domain</label>
            <input type="text" v-model="newRecord.domain" placeholder="example.com" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-blue-500 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">IP Configuration</label>
            <div class="flex items-center space-x-3">
              <button @click="newRecord.proxied = true"
                :class="newRecord.proxied ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'"
                class="px-4 py-2 rounded-lg border-2 flex-1 transition-all duration-200">
                <div class="font-medium">Proxied</div>
                <div class="text-sm">Use Cloudflare proxy</div>
              </button>
              <button @click="newRecord.proxied = false"
                :class="!newRecord.proxied ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'"
                class="px-4 py-2 rounded-lg border-2 flex-1 transition-all duration-200">
                <div class="font-medium">Direct</div>
                <div class="text-sm">Raw IP connection</div>
              </button>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeAddDialog" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                       hover:bg-gray-50 transition-colors duration-150">
              Cancel
            </button>
            <button @click="addRecord" class="px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors duration-150">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Dialog -->
    <div v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 z-50">
      <div class="bg-white rounded-xl p-6 w-[480px] transform transition-all duration-300 scale-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-800">Settings</h3>
          <button @click="closeSettings" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Zone ID</label>
            <input type="password" v-model="settings.zoneId" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-blue-500 focus:ring-blue-500 transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">API Token</label>
            <input type="password" v-model="settings.apiToken" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-blue-500 focus:ring-blue-500 transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Sync Interval (minutes)</label>
            <div class="flex items-center space-x-4">
              <input type="number" v-model="settings.syncInterval" min="1" max="1440" class="block w-32 rounded-lg border-gray-300 shadow-sm
                        focus:border-blue-500 focus:ring-blue-500 transition-colors">
              <div class="text-sm text-gray-500">
                <i class="fas fa-info-circle mr-1"></i>
                Range: 1-1440 minutes
              </div>
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button @click="closeSettings" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700
                       hover:bg-gray-50 transition-colors duration-150">
              Cancel
            </button>
            <button @click="saveSettings" class="px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-colors duration-150">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { IpResponse, DnsRecordResponse, RawDnsRecord, DnsRecord, Settings } from '@datatype/object'



// State
const currentIP = ref<string>('')
const nextSyncTime = ref<string>('')
const records = ref<DnsRecord[]>([])
const showAddDialog = ref(false)
const showSettings = ref(false)
const syncTimer = ref<NodeJS.Timer | null>(null)
const isTaskRunning = ref(false)

const settings = ref<Settings>({
  zoneId: '',
  apiToken: '',
  syncInterval: 5
})

const newRecord = ref({
  domain: '',
  proxied: true
})

// Debug logger
const logger = {
  log: (message: string, data?: unknown) => {
    console.log(`[DEBUG] ${message}`, data || '')
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error || '')
  }
}

logger.log('Initializing component global variables')

const closeSettings = () => {
  logger.log('closeSettings function called')
  showSettings.value = false
}

const openSettings = () => {
  logger.log('openSettings function called')
  showSettings.value = true
}

const closeAddDialog = () => {
  logger.log('closeAddDialog function called')
  showAddDialog.value = false
}

const openAddDialog = () => {
  logger.log('openAddDialog function called')
  newRecord.value = {
    domain: '',
    proxied: true
  }
  showAddDialog.value = true
}

const addRecord = async () => {
  logger.log('addRecord function called', newRecord.value)

  if (!newRecord.value.domain.trim()) {
    logger.error('Add record failed: Domain is required')
    alert('Domain is required')
    return
  }

  const existing = records.value.find(r => r.domain === newRecord.value.domain)
  if (existing) {
    logger.error('Add record failed: Domain already exists', newRecord.value.domain)
    alert('Domain already exists')
    return
  }

  records.value.push({
    domain: newRecord.value.domain,
    proxied: newRecord.value.proxied,
    syncedTime: '-',
    syncedIP: '-',
    result: '-'
  })

  await createRecord(records.value[records.value.length - 1])

  logger.log('New record added', newRecord.value)
  saveRecords()
  closeAddDialog()
}

// get all the DNS records from Cloudflare
const getAllDnsRecord = async (): Promise<RawDnsRecord[] | null> => {
  logger.log('getAllDnsRecord function called')
  try {
    const response = await $fetch(
      `/api/dnsRecord/all?zoneId=${settings.value.zoneId}&apiKey=${settings.value.apiToken}`,
    ) as any as DnsRecordResponse

    logger.log(`DNS record response status: ${response.statusCode}`)
    const data = response.data as { result: RawDnsRecord[] }
    logger.log('DNS record response data:', data)

    if (data.result && data.result.length > 0) {
      return data.result
    } else {
      return null
    }
  } catch (error) {
    logger.error('Error to get DNS records:', error)
    return null
  }
}

// Cloudflare API operations
const getDnsRecordId = async (domain: string): Promise<string | null> => {
  logger.log('getDnsRecordId function called', domain)
  try {
    const response = await $fetch(
      `/api/dnsRecord?zoneId=${settings.value.zoneId}&domain=${domain}&apiKey=${settings.value.apiToken}`,
    ) as any as DnsRecordResponse

    logger.log(`DNS record ID response status: ${response.statusCode}`)
    const data = response.data as { result: { id: string }[] }
    logger.log('DNS record ID response data:', data)

    if (data.result && data.result.length > 0) {
      return data.result[0].id
    } else {
      return null
    }
  } catch (error) {
    logger.error('Error to get DNS record ID:', error)
    return null
  }
}

const createRecord = async (record: DnsRecord): Promise<boolean> => {
  logger.log('syncRecord function called', record)
  try {
    logger.log(`Starting sync for record: ${record.domain}`)
    const ip = await getCurrentIP()
    if (!ip) {
      logger.error('Sync failed: No IP address available')
      throw new Error('Failed to get current IP')
    }

    const method = 'POST'

    const response = await $fetch("/api/dnsRecord/", {
      method,
      body: {
        type: 'A',
        name: record.domain,
        content: ip,
        ttl: 1,
        proxied: record.proxied,
        zoneId: settings.value.zoneId,
        apiKey: settings.value.apiToken,
      }
    })

    const data = response.data as { success: boolean, errors: any[] }
    logger.log(`syncRecord response data for ${record.domain}:`, data)

    // Check Cloudflare's "success" field and also check "errors" if any
    const success = data.success
    if (!success && data.errors) {
      logger.error('Cloudflare API returned errors:', data.errors)
    }

    const updatedRecord: DnsRecord = {
      ...record,
      syncedTime: new Date().toLocaleString(),
      syncedIP: ip,
      result: success ? 'success' : 'failed'
    }

    const index = records.value.findIndex(r => r.domain === record.domain)
    if (index !== -1) {
      records.value[index] = updatedRecord
      saveRecords()
    }

    return success
  } catch (error) {
    logger.error(`Error syncing record ${record.domain}:`, error)
    const index = records.value.findIndex(r => r.domain === record.domain)
    if (index !== -1) {
      records.value[index] = {
        ...record,
        syncedTime: new Date().toLocaleString(),
        result: 'failed'
      }
      saveRecords()
    }
    return false
  }
}


const syncRecord = async (record: DnsRecord): Promise<boolean> => {
  logger.log('syncRecord function called', record)
  try {
    logger.log(`Starting sync for record: ${record.domain}`)
    const ip = await getCurrentIP()
    if (!ip) {
      logger.error('Sync failed: No IP address available')
      throw new Error('Failed to get current IP')
    }

    const recordId = await getDnsRecordId(record.domain)
    logger.log(`recordId for ${record.domain}: ${recordId || 'Not found, will create new'}`)

    const method = 'PUT'

    const response = await $fetch("/api/dnsRecord/", {
      method,
      body: {
        type: 'A',
        name: record.domain,
        content: ip,
        ttl: 1,
        proxied: record.proxied,
        zoneId: settings.value.zoneId,
        apiKey: settings.value.apiToken,
        recordId
      }
    })

    const data = response.data as { success: boolean, errors: any[] }
    logger.log(`syncRecord response data for ${record.domain}:`, data)

    // Check Cloudflare's "success" field and also check "errors" if any
    const success = data.success
    if (!success && data.errors) {
      logger.error('Cloudflare API returned errors:', data.errors)
    }

    const updatedRecord: DnsRecord = {
      ...record,
      syncedTime: new Date().toLocaleString(),
      syncedIP: ip,
      result: success ? 'success' : 'failed'
    }

    const index = records.value.findIndex(r => r.domain === record.domain)
    if (index !== -1) {
      records.value[index] = updatedRecord
      saveRecords()
    }

    return success
  } catch (error) {
    logger.error(`Error syncing record ${record.domain}:`, error)
    const index = records.value.findIndex(r => r.domain === record.domain)
    if (index !== -1) {
      records.value[index] = {
        ...record,
        syncedTime: new Date().toLocaleString(),
        result: 'failed'
      }
      saveRecords()
    }
    return false
  }
}

const deleteRecord = async (domain: string) => {
  logger.log('deleteRecord function called', domain)
  if (!confirm(`Are you sure you want to delete ${domain}?`)) {
    logger.log('deleteRecord action canceled by user')
    return
  }

  try {
    const recordId = await getDnsRecordId(domain)
    logger.log(`Deleting record ID: ${recordId}`)

    if (recordId) {
      const response = await $fetch("/api/dnsRecord/", {

        method: 'DELETE',
        body: {
          zoneId: settings.value.zoneId,
          recordId,
          apiKey: settings.value.apiToken
        }
      })

      logger.log(`Delete response status: ${response.statusCode}`)
      if (!(response.statusCode === 200)) {
        throw new Error('Failed to delete from Cloudflare')
      }
    }

    records.value = records.value.filter(r => r.domain !== domain)
    logger.log(`Record ${domain} deleted successfully`)
    saveRecords()
  } catch (error) {
    logger.error(`Error deleting record ${domain}:`, error)
    alert(`Failed to delete record: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Local storage operations
const loadSettings = (): void => {
  logger.log('loadSettings function called')
  const savedSettings = localStorage.getItem('cloudflare-settings')
  if (savedSettings) {
    try {
      settings.value = JSON.parse(savedSettings)
      logger.log('Settings loaded', settings.value)
    } catch (error) {
      logger.error('Error loading settings:', error)
    }
  }
}

const saveSettings = async () => {
  logger.log('saveSettings function called')
  if (!validateSettings()) return
  localStorage.setItem('cloudflare-settings', JSON.stringify(settings.value))
  logger.log('Settings saved successfully')
  closeSettings()
  await loadExistingDnsRecord()
}

const loadRecords = (): void => {
  logger.log('loadRecords function called')
  const savedRecords = localStorage.getItem('cloudflare-records')
  if (savedRecords) {
    try {
      records.value = JSON.parse(savedRecords)
      logger.log('Records loaded', records.value)
    } catch (error) {
      logger.error('Error loading records:', error)
    }
  }
}

const saveRecords = (): void => {
  logger.log('saveRecords function called')
  localStorage.setItem('cloudflare-records', JSON.stringify(records.value))
}

// IP and sync operations
const getCurrentIP = async (): Promise<string | null> => {
  logger.log('getCurrentIP function called')
  try {
    const response = await $fetch('/api/currentIP') as any as IpResponse
    const data = response.data as { ip: string };
    currentIP.value = data.ip
    logger.log('Current IP:', data.ip)
    return data.ip
  } catch (error) {
    logger.error('Error to get current IP:', error)
    return null
  }
}

const syncAllRecords = async (): Promise<void> => {
  logger.log('syncAllRecords function called')
  const ip = await getCurrentIP()
  if (!ip) {
    logger.error('Aborting sync: No IP address available')
    alert('Failed to get current IP')
    return
  }

  updateNextSyncTime()
  logger.log(`Syncing ${records.value.length} record(s)`)
  for (const record of records.value) {
    logger.log('Synchronizing record:', record.domain)
    await syncRecord(record)
  }
}

// Sync task management
const startSync = async (): Promise<void> => {
  logger.log('startSync function called')
  if (!validateSettings()) {
    logger.log('Settings invalid, opening settings dialog')
    openSettings()
    return
  }

  if (isTaskRunning.value) {
    logger.log('Sync task already running')
    alert('Sync task is already running')
    return
  }

  logger.log('Starting sync task for the first time')
  isTaskRunning.value = true
  await restartSyncTask()
}

const stopSync = (): void => {
  logger.log('stopSync function called')
  if (syncTimer.value) {
    clearInterval(syncTimer.value as any)
    syncTimer.value = null
  }
  isTaskRunning.value = false
  nextSyncTime.value = '-'
  logger.log('Sync task stopped')
}

const restartSyncTask = async (): Promise<void> => {
  logger.log('restartSyncTask function called')
  stopSync()
  await syncAllRecords()

  logger.log(`Setting sync interval to ${settings.value.syncInterval} minute(s)`)
  syncTimer.value = setInterval(async () => {
    logger.log('Interval sync triggered')
    await syncAllRecords()
  }, settings.value.syncInterval * 60000)

  updateNextSyncTime()
}

const updateNextSyncTime = (): void => {
  logger.log('updateNextSyncTime function called')
  const next = new Date(Date.now() + settings.value.syncInterval * 60000)
  nextSyncTime.value = next.toLocaleTimeString()
  logger.log('Next sync time updated:', nextSyncTime.value)
}

// Validation
const validateSettings = (): boolean => {
  logger.log('validateSettings function called')

  if (!settings.value.zoneId.trim()) {
    logger.error('Validation failed: zoneId is required')
    alert('Zone ID is required')
    return false
  }
  if (!settings.value.apiToken.trim()) {
    logger.error('Validation failed: apiToken is required')
    alert('API Token is required')
    return false
  }
  if (settings.value.syncInterval < 1 || settings.value.syncInterval > 1440) {
    logger.error('Validation failed: syncInterval out of range')
    alert('Sync interval must be between 1 and 1440 minutes')
    return false
  }

  logger.log('Settings validation passed')
  return true
}

const loadExistingDnsRecord = async () => {
  logger.log('loadExistingDnsRecord function called')
  const oldRecord = await getAllDnsRecord()
  if (oldRecord && oldRecord.length > 0) {
    records.value = oldRecord.map(record => ({
      domain: record.name,
      proxied: record.proxied,
      syncedTime: '-',
      syncedIP: '-',
      result: '-'
    }))
    saveRecords()
  } else {
    logger.error('No existing DNS records found')
  }
}

// Lifecycle hooks
onMounted(async () => {
  logger.log('onMounted hook called')
  loadSettings()
  await loadExistingDnsRecord()
  //loadRecords()
  getCurrentIP()
  updateNextSyncTime()
})

onUnmounted(() => {
  logger.log('onUnmounted hook called')
  stopSync()
})

watch(() => settings.value.syncInterval, () => {
  logger.log('Sync interval changed to', settings.value.syncInterval)
  if (isTaskRunning.value) {
    logger.log('Restarting sync task due to interval change')
    restartSyncTask()
  }
})
</script>

<style></style>