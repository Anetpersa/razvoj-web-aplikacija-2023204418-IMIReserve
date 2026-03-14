<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { InstrumentService } from '@/services/instrument.services'
import type { InstrumentModel } from '@/models/instrument.model'
import type { PageModel } from '@/models/page.model'

const router = useRouter()
const instruments = ref<PageModel<InstrumentModel>>()
const selectedCategory = ref<string>('')
const selectedFacility = ref<string>('')
const error = ref<string | null>(null)

const researcher = JSON.parse(localStorage.getItem('researcher') || 'null')

onMounted(() => {
  if (!researcher) {
    router.push('/')
    return
  }
  retrieveData()
})

function retrieveData(page = 0) {
  InstrumentService.getAllInstruments(page)
    .then(rsp => {
      instruments.value = rsp.data
      selectedCategory.value = ''
      selectedFacility.value = ''
    })
    .catch(() => error.value = 'Greška pri učitavanju instrumenata.')
}

function first() {
  if (!instruments.value || instruments.value.first) return
  retrieveData(0)
}

function prev() {
  if (!instruments.value || instruments.value.first) return
  retrieveData(instruments.value.number - 1)
}

function next() {
  if (!instruments.value || instruments.value.last) return
  retrieveData(instruments.value.number + 1)
}

function last() {
  if (!instruments.value || instruments.value.last) return
  retrieveData(instruments.value.totalPages - 1)
}

const categories = computed(() => {
  if (!instruments.value) return []
  const names = instruments.value.content.map(i => i.category.name)
  return [...new Set(names)]
})

const facilities = computed(() => {
  if (!instruments.value) return []
  const names = instruments.value.content.map(i => i.facility.name)
  return [...new Set(names)]
})

const filtered = computed(() => {
  if (!instruments.value) return []
  return instruments.value.content.filter(i => {
    const matchCategory = selectedCategory.value === '' || i.category.name === selectedCategory.value
    const matchFacility = selectedFacility.value === '' || i.facility.name === selectedFacility.value
    return matchCategory && matchFacility
  })
})

function reserve(instrument: InstrumentModel) {
  router.push({ name: 'new-reservation', query: { instrumentId: instrument.instrumentId, instrumentName: instrument.name } })
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

    <div v-if="instruments">
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


      <!-- Paginacija -->
      <nav class="mt-3">
        <ul class="pagination pagination-custom justify-content-center">
          <li class="page-item">
            <button class="page-link" @click="first" :disabled="instruments.first">
              <i class="fa-solid fa-angles-left"></i>
            </button>
          </li>
          <li class="page-item">
            <button class="page-link" @click="prev" :disabled="instruments.first">
              <i class="fa-solid fa-angle-left"></i>
            </button>
          </li>
          <li class="page-item">
            <button class="page-link active">{{ instruments.number + 1 }}</button>
          </li>
          <li class="page-item">
            <button class="page-link" @click="next" :disabled="instruments.last">
              <i class="fa-solid fa-angle-right"></i>
            </button>
          </li>
          <li class="page-item">
            <button class="page-link" @click="last" :disabled="instruments.last">
              <i class="fa-solid fa-angles-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.pagination-custom .page-link {
  background-color: #941616;
  border-color: #7a1212;
  color: #fff;
}

.pagination-custom .page-link:hover {
  background-color: #7a1212;
  border-color: #7a1212;
  color: #fff;
}

.pagination-custom .page-link.active {
  background-color: #cf2e2e;
  border-color: #cf2e2e;
  font-weight: bold;
}

.pagination-custom .page-link:disabled {
  background-color: #5a0e0e;
  border-color: #5a0e0e;
  color: #ffffff80;
  cursor: not-allowed;
}
</style>