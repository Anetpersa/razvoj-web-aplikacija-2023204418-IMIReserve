<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ReservationService } from '@/services/reservation.services'
import { InstrumentService } from '@/services/instrument.services'
import type { ReservationModel } from '@/models/reservation.model'
import type { InstrumentModel } from '@/models/instrument.model'

const router = useRouter()
const route = useRoute()

const researcher = JSON.parse(localStorage.getItem('researcher') || 'null')
const allInstruments = ref<InstrumentModel[]>([])
const formInstrumentId = ref<number | null>(null)
const formStartTime = ref<string>('')
const formEndTime = ref<string>('')
const formError = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const busyReservations = ref<ReservationModel[]>([])

onMounted(() => {
  if (!researcher) {
    router.push('/')
    return
  }
  InstrumentService.getAllInstruments(0, 1000)
    .then(rsp => {
      allInstruments.value = rsp.data.content
      if (route.query.instrumentId) {
        formInstrumentId.value = Number(route.query.instrumentId)
      }
    })
})

watch(formInstrumentId, (newId) => {
  busyReservations.value = []
  if (newId == null) return
  ReservationService.getReservationsByInstrument(newId)
    .then(rsp => busyReservations.value = rsp.data.filter(r => r.status !== 'cancelled'))
})

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
    setTimeout(() => router.push('/reservations'), 1500)
  } catch (e: any) {
    formError.value = e.response?.data?.message || 'Greška pri kreiranju rezervacije.'
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'pending': return 'Na čekanju'
    case 'confirmed': return 'Potvrđena'
    default: return status
  }
}

function statusClass(status: string) {
  switch (status) {
    case 'pending': return 'badge bg-warning text-dark'
    case 'confirmed': return 'badge bg-success'
    default: return 'badge bg-secondary'
  }
}

function formatDate(dt: string) {
  return new Date(dt).toLocaleString('sr')
}
</script>

<template>
  <div>
    <div class="d-flex align-items-center mb-4">
      <button class="btn btn-secondary me-3" @click="router.push('/reservations')">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h3 class="mb-0"><i class="fa-solid fa-calendar-plus me-2"></i> Nova rezervacija</h3>
    </div>

    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <div class="row g-4">
      <!-- Forma -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">Detalji rezervacije</h5>
            <div v-if="formError" class="alert alert-danger">{{ formError }}</div>

            <div class="mb-3">
              <label class="form-label">Instrument</label>
              <select class="form-select" v-model="formInstrumentId">
                <option :value="null" disabled>-- Izaberite instrument --</option>
                <option v-for="i in allInstruments" :key="i.instrumentId" :value="i.instrumentId">
                  {{ i.name }} ({{ i.category.name }} — {{ i.facility.name }})
                </option>
              </select>
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
            <button class="btn btn-secondary" @click="router.push('/reservations')">
              Otkaži
            </button>
          </div>
        </div>
      </div>

      <!-- Zauzeti termini -->
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-3">
              <i class="fa-solid fa-clock me-2"></i> Zauzeti termini
            </h5>
            <div v-if="formInstrumentId == null" class="text-muted">
              Izaberite instrument da vidite zauzete termine.
            </div>
            <div v-else-if="busyReservations.length === 0" class="text-success">
              <i class="fa-solid fa-circle-check me-1"></i> Instrument je slobodan — nema zauzetih termina.
            </div>
            <table v-else class="table table-sm table-striped">
              <thead>
                <tr>
                  <th>Početak</th>
                  <th>Završetak</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in busyReservations" :key="r.reservationId">
                  <td>{{ formatDate(r.startTime) }}</td>
                  <td>{{ formatDate(r.endTime) }}</td>
                  <td><span :class="statusClass(r.status)">{{ statusLabel(r.status) }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>