<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { InstrumentService } from '@/services/instrument.services'
import type { InstrumentModel } from '@/models/instrument.model'

const router = useRouter()
const instruments = ref<InstrumentModel[]>([])
const selectedCategory = ref<string>('')
const selectedFacility = ref<string>('')
const error = ref<string | null>(null)

const researcher = JSON.parse(localStorage.getItem('researcher') || 'null')

onMounted(() => {
  if (!researcher) {
    router.push('/')
    return
  }
  InstrumentService.getAllInstruments()
    .then(rsp => instruments.value = rsp.data)
    .catch(() => error.value = 'Greška pri učitavanju instrumenata.')
})

const categories = computed(() => {
  const names = instruments.value.map(i => i.category.name)
  return [...new Set(names)]
})

const facilities = computed(() => {
  const names = instruments.value.map(i => i.facility.name)
  return [...new Set(names)]
})

const filtered = computed(() => {
  return instruments.value.filter(i => {
    const matchCategory = selectedCategory.value === '' || i.category.name === selectedCategory.value
    const matchFacility = selectedFacility.value === '' || i.facility.name === selectedFacility.value
    return matchCategory && matchFacility
  })
})

function reserve(instrument: InstrumentModel) {
  router.push({ name: 'reservations', query: { instrumentId: instrument.instrumentId, instrumentName: instrument.name } })
}
</script>

<template>
  <div>
    <h3 class="mb-3">
      <i class="fa-solid fa-microscope me-2"></i> Instrumenti
    </h3>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <!-- Filteri -->
    <div class="row mb-3 g-2">
      <div class="col-md-4">
        <select class="form-select" v-model="selectedCategory">
          <option value="">-- Sve kategorije --</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select" v-model="selectedFacility">
          <option value="">-- Sve lokacije --</option>
          <option v-for="fac in facilities" :key="fac" :value="fac">{{ fac }}</option>
        </select>
      </div>
      <div class="col-md-4">
        <button class="btn btn-secondary" @click="selectedCategory = ''; selectedFacility = ''">
          <i class="fa-solid fa-filter-circle-xmark me-1"></i> Resetuj filtere
        </button>
      </div>
    </div>

    <!-- Tabela instrumenata -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><i class="fa-solid fa-hashtag"></i> ID</th>
          <th><i class="fa-solid fa-microscope"></i> Naziv</th>
          <th><i class="fa-solid fa-tag"></i> Kategorija</th>
          <th><i class="fa-solid fa-location-dot"></i> Lokacija</th>
          <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filtered.length === 0">
          <td colspan="5" class="text-center">Nema instrumenata za izabrane filtere.</td>
        </tr>
        <tr v-for="instrument in filtered" :key="instrument.instrumentId">
          <td>{{ instrument.instrumentId }}</td>
          <td>{{ instrument.name }}</td>
          <td>{{ instrument.category.name }}</td>
          <td>{{ instrument.facility.name }}</td>
          <td>
            <button class="btn btn-save btn-sm" @click="reserve(instrument)">
              <i class="fa-solid fa-calendar-plus me-1"></i> Rezerviši
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>