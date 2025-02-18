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
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Is Raw</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Sync</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="record in records" :key="record.domain" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ record.domain }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span :class="record.isRaw ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                class="px-2 py-1 rounded-full text-xs font-medium">
                {{ record.isRaw ? 'Yes' : 'No' }}
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
              <button class="text-red-600 hover:text-red-800 transition-colors duration-150">
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
              <button @click="newRecord.isRaw = false"
                :class="!newRecord.isRaw ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'"
                class="px-4 py-2 rounded-lg border-2 flex-1 transition-all duration-200">
                <div class="font-medium">Proxied</div>
                <div class="text-sm">Use Cloudflare proxy</div>
              </button>
              <button @click="newRecord.isRaw = true"
                :class="newRecord.isRaw ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-gray-50 border-gray-300 text-gray-700'"
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
    <div v-if="showSettings" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
            transition-opacity duration-300 z-50">
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
            <input type="text" v-model="settings.zoneId" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
                      focus:border-blue-500 focus:ring-blue-500 transition-colors">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
            <input type="text" v-model="settings.accountId" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm
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
import { ref, onMounted, onUnmounted } from 'vue'

// Interfaces
interface Settings {
  zoneId: string
  accountId: string
  syncInterval: number
}

interface DnsRecord {
  domain: string
  isRaw: boolean
  syncedTime: string
  syncedIP: string
  result: 'pending' | 'success' | 'failed'
}

interface NewRecord {
  domain: string
  isRaw: boolean
}

// State
const currentIP = ref<string>('')
const nextSyncTime = ref<string>('')
const records = ref<DnsRecord[]>([])
const showAddDialog = ref<boolean>(false)
const showSettings = ref<boolean>(false)
const syncTimer = ref<NodeJS.Timer | null>(null)
const isTaskRunning = ref<boolean>(false)

const settings = ref<Settings>({
  zoneId: '',
  accountId: '',
  syncInterval: 5
})

const newRecord = ref<NewRecord>({
  domain: '',
  isRaw: false
})

// Dialog Controls
const openAddDialog = (): void => {
  showAddDialog.value = true
}

const closeAddDialog = (): void => {
  showAddDialog.value = false
  newRecord.value = {
    domain: '',
    isRaw: false
  }
}

const openSettings = (): void => {
  showSettings.value = true
}

const closeSettings = (): void => {
  showSettings.value = false
}

// LocalStorage Operations
const loadSettings = (): void => {
  try {
    const savedSettings = localStorage.getItem('cloudflare-settings')
    if (savedSettings) {
      settings.value = JSON.parse(savedSettings)
    }
  } catch (error) {
    console.error('Error loading settings:', error)
  }
}

const saveSettings = (): void => {
  try {
    localStorage.setItem('cloudflare-settings', JSON.stringify(settings.value))
    closeSettings()
    restartSyncTask()
  } catch (error) {
    console.error('Error saving settings:', error)
  }
}

const loadRecords = (): void => {
  try {
    const savedRecords = localStorage.getItem('cloudflare-records')
    if (savedRecords) {
      records.value = JSON.parse(savedRecords)
    }
  } catch (error) {
    console.error('Error loading records:', error)
  }
}

const saveRecords = (): void => {
  try {
    localStorage.setItem('cloudflare-records', JSON.stringify(records.value))
  } catch (error) {
    console.error('Error saving records:', error)
  }
}

// IP and Time Operations
const getCurrentIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    currentIP.value = data.ip
    return data.ip
  } catch (error) {
    console.error('Error fetching IP:', error)
    return null
  }
}

const updateNextSyncTime = (): void => {
  const next = new Date(Date.now() + settings.value.syncInterval * 60000)
  nextSyncTime.value = next.toLocaleTimeString()
}

// Record Operations
const addRecord = (): void => {
  if (!newRecord.value.domain) {
    alert('Please enter a domain')
    return
  }

  const record: DnsRecord = {
    domain: newRecord.value.domain,
    isRaw: newRecord.value.isRaw,
    syncedTime: '-',
    syncedIP: '-',
    result: 'pending'
  }

  records.value.push(record)
  saveRecords()
  closeAddDialog()
}

const deleteRecord = (domain: string): void => {
  if (confirm('Are you sure you want to delete this record?')) {
    records.value = records.value.filter(r => r.domain !== domain)
    saveRecords()
  }
}

// Sync Operations
const syncRecord = async (record: DnsRecord): Promise<boolean> => {
  try {
    if (!currentIP.value) {
      throw new Error('Current IP is not available')
    }

    // Add your Cloudflare API call here
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${settings.value.zoneId}/dns_records`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.value.accountId}`
      },
      body: JSON.stringify({
        type: 'A',
        name: record.domain,
        content: currentIP.value,
        proxied: !record.isRaw
      })
    })

    const result = await response.json()

    const updatedRecord: DnsRecord = {
      ...record,
      syncedTime: new Date().toLocaleString(),
      syncedIP: currentIP.value,
      result: result.success ? 'success' : 'failed'
    }

    const index = records.value.findIndex(r => r.domain === record.domain)
    if (index !== -1) {
      records.value[index] = updatedRecord
      saveRecords()
    }

    return result.success
  } catch (error) {
    console.error('Error syncing record:', error)
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

const syncAllRecords = async (): Promise<void> => {
  const ip = await getCurrentIP()
  if (!ip) {
    alert('Failed to get current IP')
    return
  }

  updateNextSyncTime()

  for (const record of records.value) {
    await syncRecord(record)
  }
}

const startSync = async (): Promise<void> => {
  if (!settings.value.zoneId || !settings.value.accountId) {
    alert('Please configure Zone ID and Account ID in settings first')
    openSettings()
    return
  }

  if (isTaskRunning.value) {
    alert('Sync task is already running')
    return
  }

  isTaskRunning.value = true
  await restartSyncTask()
}

const stopSync = (): void => {
  if (syncTimer.value) {
    clearInterval(syncTimer.value)
    syncTimer.value = null
  }
  isTaskRunning.value = false
  nextSyncTime.value = '-'
}

const restartSyncTask = async (): Promise<void> => {
  stopSync()

  // Initial sync
  await syncAllRecords()

  // Set up new timer
  syncTimer.value = setInterval(async () => {
    await syncAllRecords()
  }, settings.value.syncInterval * 60000)
}

// Validation
const validateSettings = (): boolean => {
  if (!settings.value.zoneId || !settings.value.accountId) {
    alert('Please fill in all required fields')
    return false
  }

  if (settings.value.syncInterval < 1 || settings.value.syncInterval > 1440) {
    alert('Sync interval must be between 1 and 1440 minutes')
    return false
  }

  return true
}

// Lifecycle hooks
onMounted(() => {
  loadSettings()
  loadRecords()
  getCurrentIP()
  updateNextSyncTime()
})

onUnmounted(() => {
  stopSync()
})

// Watch for settings changes
watch(() => settings.value, () => {
  if (isTaskRunning.value) {
    restartSyncTask()
  }
}, { deep: true })
</script>

<style></style>