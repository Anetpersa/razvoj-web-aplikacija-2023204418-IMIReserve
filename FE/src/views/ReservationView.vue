<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ReservationService } from '@/services/reservation.services'
import type { ReservationModel } from '@/models/reservation.model'

const router = useRouter()
const route = useRoute()

const researcher = JSON.parse(localStorage.getItem('researcher') || 'null')
const reservations = ref<ReservationModel[]>([])
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)

// forma
const showForm = ref(false)
const formInstrumentId = ref<number | null>(null)
const formInstrumentName = ref<string>('')
const formStartTime = ref<string>('')
const formEndTime = ref<string>('')
const formError = ref<string | null>(null)

// filteri i sortiranje
const filterStatus = ref<string>('')
const filterInstrument = ref<string>('')
const filterCategory = ref<string>('')
const filterFacility = ref<string>('')
const sortBy = ref<string>('startTime_asc')

onMounted(() => {
  if (!researcher) {
    router.push('/')
    return
  }
  loadReservations()

  // ako dolazimo sa HomeView sa query parametrima
  if (route.query.instrumentId) {
    formInstrumentId.value = Number(route.query.instrumentId)
    formInstrumentName.value = String(route.query.instrumentName || '')
    showForm.value = true
  }
})

function loadReservations() {
  ReservationService.getAllReservations()
    .then(rsp => {
      console.log('Sve rezervacije:', rsp.data)
      console.log('Researcher iz localStorage:', researcher)
      reservations.value = rsp.data.filter(r => r.researcherId === researcher.researcherId)
      console.log('Filtrirane rezervacije:', reservations.value)
    })
    .catch(() => error.value = 'Greška pri učitavanju rezervacija.')
}

// unikatne vrednosti za filtere
const instrumentNames = computed(() => [...new Set(reservations.value.map(r => r.instrument.name))])
const categoryNames = computed(() => [...new Set(reservations.value.map(r => r.instrument.category.name))])
const facilityNames = computed(() => [...new Set(reservations.value.map(r => r.instrument.facility.name))])

const filteredAndSorted = computed(() => {
  let result = reservations.value.filter(r => {
    const matchStatus = filterStatus.value === '' || r.status === filterStatus.value
    const matchInstrument = filterInstrument.value === '' || r.instrument.name === filterInstrument.value
    const matchCategory = filterCategory.value === '' || r.instrument.category.name === filterCategory.value
    const matchFacility = filterFacility.value === '' || r.instrument.facility.name === filterFacility.value
    return matchStatus && matchInstrument && matchCategory && matchFacility
  })

  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'startTime_asc': return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      case 'startTime_desc': return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      case 'instrument_asc': return a.instrument.name.localeCompare(b.instrument.name)
      case 'instrument_desc': return b.instrument.name.localeCompare(a.instrument.name)
      default: return 0
    }
  })

  return result
})

function resetFilters() {
  filterStatus.value = ''
  filterInstrument.value = ''
  filterCategory.value = ''
  filterFacility.value = ''
  sortBy.value = 'startTime_asc'
}

async function createReservation() {
  formError.value = null
  if (!formInstrumentId.value || !formStartTime.value || !formEndTime.value) {
    formError.value = 'Sva polja su obavezna.'
    return
  }
  if (new Date(formEndTime.value) <= new Date(formStartTime.value)) {
    formError.value = 'Vreme završetka mora biti nakon vremena početka.'
    return
  }

  try {
    await ReservationService.createReservation({
      researcherId: researcher.researcherId,
      instrumentId: formInstrumentId.value,
      startTime: formStartTime.value,
      endTime: formEndTime.value
    })
    successMsg.value = 'Rezervacija je uspešno kreirana!'
    showForm.value = false
    formStartTime.value = ''
    formEndTime.value = ''
    formInstrumentId.value = null
    formInstrumentName.value = ''
    loadReservations()
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    formError.value = e.response?.data?.message || 'Greška pri kreiranju rezervacije.'
  }
}

async function updateStatus(id: number, status: 'confirmed' | 'cancelled') {
  const label = status === 'confirmed' ? 'potvrdite' : 'otkažete'
  if (!confirm(`Da li ste sigurni da želite da ${label} ovu rezervaciju?`)) return
  try {
    await ReservationService.updateStatus(id, status)
    successMsg.value = `Rezervacija je uspešno ${status === 'confirmed' ? 'potvrđena' : 'otkazana'}.`
    loadReservations()
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Greška pri izmeni statusa.'
  }
}

async function deleteReservation(id: number) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovu rezervaciju?')) return
  try {
    await ReservationService.deleteReservation(id)
    reservations.value = reservations.value.filter(r => r.reservationId !== id)
    successMsg.value = 'Rezervacija je obrisana.'
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Greška pri brisanju rezervacije.'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'pending': return 'Na čekanju'
    case 'confirmed': return 'Potvrđena'
    case 'cancelled': return 'Otkazana'
    default: return status
  }
}

function statusClass(status: string) {
  switch (status) {
    case 'pending': return 'badge bg-warning text-dark'
    case 'confirmed': return 'badge bg-success'
    case 'cancelled': return 'badge bg-secondary'
    default: return 'badge bg-secondary'
  }
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleString('sr')
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3><i class="fa-solid fa-calendar-days me-2"></i> Moje rezervacije</h3>
      <button class="btn btn-save" @click="showForm = !showForm">
        <i class="fa-solid fa-calendar-plus me-1"></i> Nova rezervacija
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <!-- Forma za novu rezervaciju -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Nova rezervacija</h5>
        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>

        <div class="mb-3">
          <label class="form-label">Instrument</label>
          <input type="text" class="form-control" :value="formInstrumentName" disabled />
        </div>

        <div class="mb-3">
          <label class="form-label">Vreme početka</label>
          <input type="datetime-local" class="form-control" v-model="formStartTime" />
        </div>

        <div class="mb-3">
          <label class="form-label">Vreme završetka</label>
          <input type="datetime-local" class="form-control" v-model="formEndTime" />
        </div>

        <button class="btn btn-save me-2" @click="createReservation">
          <i class="fa-solid fa-floppy-disk me-1"></i> Sačuvaj
        </button>
        <button class="btn btn-secondary" @click="showForm = false">
          Otkaži
        </button>
      </div>
    </div>

    <!-- Filteri i sortiranje -->
    <div class="row mb-3 g-2">
      <div class="col-md-2">
        <select class="form-select" v-model="filterStatus">
          <option value="">-- Svi statusi --</option>
          <option value="pending">Na čekanju</option>
          <option value="confirmed">Potvrđena</option>
          <option value="cancelled">Otkazana</option>
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="filterInstrument">
          <option value="">-- Svi instrumenti --</option>
          <option v-for="name in instrumentNames" :key="name" :value="name">{{ name }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-select" v-model="filterCategory">
          <option value="">-- Sve kategorije --</option>
          <option v-for="cat in categoryNames" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-select" v-model="filterFacility">
          <option value="">-- Sve lokacije --</option>
          <option v-for="fac in facilityNames" :key="fac" :value="fac">{{ fac }}</option>
        </select>
      </div>
      <div class="col-md-2">
        <select class="form-select" v-model="sortBy">
          <option value="startTime_asc">Datum ↑</option>
          <option value="startTime_desc">Datum ↓</option>
          <option value="instrument_asc">Instrument A-Z</option>
          <option value="instrument_desc">Instrument Z-A</option>
        </select>
      </div>
      <div class="col-md-1">
        <button class="btn btn-secondary w-100" @click="resetFilters" title="Resetuj filtere">
          <i class="fa-solid fa-filter-circle-xmark"></i>
        </button>
      </div>
    </div>

    <!-- Tabela rezervacija -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><i class="fa-solid fa-hashtag"></i> ID</th>
          <th><i class="fa-solid fa-microscope"></i> Instrument</th>
          <th><i class="fa-solid fa-tag"></i> Kategorija</th>
          <th><i class="fa-solid fa-location-dot"></i> Lokacija</th>
          <th><i class="fa-solid fa-clock"></i> Početak</th>
          <th><i class="fa-solid fa-clock"></i> Završetak</th>
          <th><i class="fa-solid fa-circle-info"></i> Status</th>
          <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredAndSorted.length === 0">
          <td colspan="8" class="text-center">Nema rezervacija.</td>
        </tr>
        <tr v-for="r in filteredAndSorted" :key="r.reservationId">
          <td>{{ r.reservationId }}</td>
          <td>{{ r.instrument.name }}</td>
          <td>{{ r.instrument.category.name }}</td>
          <td>{{ r.instrument.facility.name }}</td>
          <td>{{ formatDate(r.startTime) }}</td>
          <td>{{ formatDate(r.endTime) }}</td>
          <td><span :class="statusClass(r.status)">{{ statusLabel(r.status) }}</span></td>
          <td>
            <div class="btn-group">
              <button
                v-if="r.status === 'pending'"
                class="btn btn-success btn-sm"
                @click="updateStatus(r.reservationId, 'confirmed')"
                title="Potvrdi">
                <i class="fa-solid fa-check"></i>
              </button>
              <button
                v-if="r.status === 'pending'"
                class="btn btn-warning btn-sm"
                @click="updateStatus(r.reservationId, 'cancelled')"
                title="Otkaži">
                <i class="fa-solid fa-xmark"></i>
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="deleteReservation(r.reservationId)"
                title="Obriši">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>