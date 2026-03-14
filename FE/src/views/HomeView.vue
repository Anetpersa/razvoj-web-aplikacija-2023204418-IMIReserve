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
const selectedInstrument = ref<InstrumentModel | null>(null)
const imageLoaded = ref(false)

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

function openModal(instrument: InstrumentModel) {
  selectedInstrument.value = instrument
  imageLoaded.value = false
}

function closeModal() {
  selectedInstrument.value = null
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
            <th><i class="fa-solid fa-microscope"></i> Naziv</th>
            <th><i class="fa-solid fa-tag"></i> Kategorija</th>
            <th><i class="fa-solid fa-location-dot"></i> Lokacija</th>
            <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="text-center">Nema instrumenata za izabrane filtere.</td>
          </tr>
          <tr v-for="instrument in filtered" :key="instrument.instrumentId">
            <td>
              <span class="instrument-link" @click="openModal(instrument)">
                {{ instrument.name }} <i class="fa-solid fa-circle-info ms-1"></i>
              </span>
            </td>
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

    <!-- Modal -->
    <div v-if="selectedInstrument" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card">
        <button class="btn-close-modal" @click="closeModal">
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="modal-img-wrapper">
          <div v-if="!imageLoaded" class="modal-img-placeholder">
            <i class="fa-solid fa-spinner fa-spin fa-2x"></i>
          </div>
          <img v-if="selectedInstrument.imageUrl" :src="selectedInstrument.imageUrl"
            :alt="selectedInstrument.name" class="modal-img"
            :class="{ 'img-hidden': !imageLoaded }"
            @load="imageLoaded = true"
            @error="imageLoaded = true" />
          <div v-if="!selectedInstrument.imageUrl" class="modal-no-img">
            <i class="fa-solid fa-microscope fa-3x"></i>
          </div>
        </div>
        <div class="modal-info">
          <h5>{{ selectedInstrument.name }}</h5>
          <p><i class="fa-solid fa-tag me-2"></i>{{ selectedInstrument.category.name }}</p>
          <p><i class="fa-solid fa-location-dot me-2"></i>{{ selectedInstrument.facility.name }}</p>
          <button class="btn btn-save w-100 mt-2" @click="reserve(selectedInstrument); closeModal()">
            <i class="fa-solid fa-calendar-plus me-1"></i> Rezerviši
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.instrument-link {
  cursor: pointer;
  color: inherit;
}

.instrument-link:hover {
  color: #cf2e2e;
}

.instrument-link i {
  opacity: 0.5;
  font-size: 0.85rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: #1e1e1e;
  border-radius: 12px;
  width: 420px;
  overflow: hidden;
  position: relative;
  padding: 16px;
}

.btn-close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;
}

.modal-img-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 8px;
  overflow: hidden;
  background: #2a2a2a;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.modal-img-placeholder {
  position: absolute;
  color: #941616;
}

.modal-img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
}

.img-hidden {
  opacity: 0;
}



.modal-no-img {
  width: 100%;
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #2a2a2a;
  color: #941616;
}

.modal-info {
  padding: 0;
}

.modal-info h5 {
  margin-bottom: 12px;
}

.modal-info p {
  margin-bottom: 6px;
  color: #aaa;
}

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