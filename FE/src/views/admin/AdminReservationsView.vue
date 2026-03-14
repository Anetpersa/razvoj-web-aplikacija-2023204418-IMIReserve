<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { MainService } from '@/services/main.service'
import type { ReservationModel } from '@/models/reservation.model'

const reservations = ref<ReservationModel[]>([])
const error = ref<string | null>(null)
const activeTab = ref<'upcoming' | 'past'>('upcoming')

onMounted(() => loadReservations())

function loadReservations() {
  MainService.useAxios('/reservation')
    .then(rsp => reservations.value = (rsp as any).data)
    .catch(() => error.value = 'Greška pri učitavanju rezervacija.')
}

const now = new Date()

const upcoming = computed(() =>
  reservations.value
    .filter(r => new Date(r.endTime) >= now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
)

const past = computed(() =>
  reservations.value
    .filter(r => new Date(r.endTime) < now)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
)

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
    <h3 class="mb-3"><i class="fa-solid fa-calendar-days me-2"></i> Rezervacije</h3>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Tabovi -->
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'upcoming' }" @click="activeTab = 'upcoming'">
          <i class="fa-solid fa-clock me-1"></i> Predstojeće
          <span class="badge bg-secondary ms-1">{{ upcoming.length }}</span>
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link" :class="{ active: activeTab === 'past' }" @click="activeTab = 'past'">
          <i class="fa-solid fa-clock-rotate-left me-1"></i> Prošle
          <span class="badge bg-secondary ms-1">{{ past.length }}</span>
        </button>
      </li>
    </ul>

    <!-- Tabela -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><i class="fa-solid fa-hashtag"></i> ID</th>
          <th><i class="fa-solid fa-user"></i> Istraživač</th>
          <th><i class="fa-solid fa-microscope"></i> Instrument</th>
          <th><i class="fa-solid fa-tag"></i> Kategorija</th>
          <th><i class="fa-solid fa-location-dot"></i> Lokacija</th>
          <th><i class="fa-solid fa-clock"></i> Početak</th>
          <th><i class="fa-solid fa-clock"></i> Završetak</th>
          <th><i class="fa-solid fa-circle-info"></i> Status</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="activeTab === 'upcoming'">
          <tr v-if="upcoming.length === 0">
            <td colspan="8" class="text-center">Nema predstojećih rezervacija.</td>
          </tr>
          <tr v-for="r in upcoming" :key="r.reservationId">
            <td>{{ r.reservationId }}</td>
            <td>{{ r.researcher.title }} {{ r.researcher.name }}</td>
            <td>{{ r.instrument.name }}</td>
            <td>{{ r.instrument.category.name }}</td>
            <td>{{ r.instrument.facility.name }}</td>
            <td>{{ formatDate(r.startTime) }}</td>
            <td>{{ formatDate(r.endTime) }}</td>
            <td><span :class="statusClass(r.status)">{{ statusLabel(r.status) }}</span></td>
          </tr>
        </template>

        <template v-else>
          <tr v-if="past.length === 0">
            <td colspan="8" class="text-center">Nema prošlih rezervacija.</td>
          </tr>
          <tr v-for="r in past" :key="r.reservationId">
            <td>{{ r.reservationId }}</td>
            <td>{{ r.researcher.title }} {{ r.researcher.name }}</td>
            <td>{{ r.instrument.name }}</td>
            <td>{{ r.instrument.category.name }}</td>
            <td>{{ r.instrument.facility.name }}</td>
            <td>{{ formatDate(r.startTime) }}</td>
            <td>{{ formatDate(r.endTime) }}</td>
            <td><span :class="statusClass(r.status)">{{ statusLabel(r.status) }}</span></td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>