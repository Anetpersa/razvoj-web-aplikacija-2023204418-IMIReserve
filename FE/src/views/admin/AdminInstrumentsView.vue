<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MainService } from '@/services/main.service'
import type { InstrumentModel } from '@/models/instrument.model'
import type { CategoryModel } from '@/models/category.model'
import type { FacilityModel } from '@/models/facility.model'
import type { PageModel } from '@/models/page.model'

const instruments = ref<PageModel<InstrumentModel>>()
const categories = ref<CategoryModel[]>([])
const facilities = ref<FacilityModel[]>([])
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const showForm = ref(false)
const formError = ref<string | null>(null)
const currentPage = ref(0)

const form = ref({
  name: '',
  imageUrl: '',
  categoryId: null as number | null,
  facilityId: null as number | null
})

onMounted(() => {
  loadInstruments()
  loadCategories()
  loadFacilities()
})

async function loadInstruments(page = 0) {
  currentPage.value = page
  await MainService.useAxios(`/instrument?page=${page}&size=10`)
    .then(rsp => instruments.value = (rsp as any).data)
    .catch(() => error.value = 'Greška pri učitavanju instrumenata.')
}

function loadCategories() {
  MainService.useAxios('/category')
    .then(rsp => categories.value = (rsp as any).data)
}

function loadFacilities() {
  MainService.useAxios('/facility')
    .then(rsp => facilities.value = (rsp as any).data)
}

async function createInstrument() {
  formError.value = null
  if (!form.value.name.trim() || !form.value.categoryId || !form.value.facilityId) {
    formError.value = 'Naziv, kategorija i lokacija su obavezni.'
    return
  }
  try {
    await MainService.useAxios('/instrument', 'post', { ...form.value })
    successMsg.value = 'Instrument je uspešno dodat!'
    form.value = { name: '', imageUrl: '', categoryId: null, facilityId: null }
    showForm.value = false
    await loadInstruments(currentPage.value)
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    formError.value = 'Greška pri dodavanju instrumenta.'
  }
}

async function deleteInstrument(id: number) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovaj instrument?')) return
  try {
    await MainService.useAxios(`/instrument/${id}`, 'delete')
    await loadInstruments(currentPage.value)
    successMsg.value = 'Instrument je obrisan.'
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = 'Greška pri brisanju instrumenta.'
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3><i class="fa-solid fa-microscope me-2"></i> Instrumenti</h3>
      <button class="btn btn-save" @click="showForm = !showForm">
        <i class="fa-solid fa-plus me-1"></i> Novi instrument
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <!-- Forma -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Novi instrument</h5>
        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Naziv</label>
            <input type="text" class="form-control" v-model="form.name" placeholder="Naziv instrumenta" autocomplete="off" />
          </div>
          <div class="col-md-6">
            <label class="form-label">URL slike <span class="text-muted">(opciono)</span></label>
            <input type="text" class="form-control" v-model="form.imageUrl" placeholder="https://..." autocomplete="off" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Kategorija</label>
            <select class="form-select" v-model="form.categoryId">
              <option :value="null" disabled>-- Izaberite kategoriju --</option>
              <option v-for="c in categories" :key="c.categoryId" :value="c.categoryId">
                {{ c.name }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Lokacija</label>
            <select class="form-select" v-model="form.facilityId">
              <option :value="null" disabled>-- Izaberite lokaciju --</option>
              <option v-for="f in facilities" :key="f.facilityId" :value="f.facilityId">
                {{ f.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-save me-2" @click="createInstrument">
            <i class="fa-solid fa-floppy-disk me-1"></i> Sačuvaj
          </button>
          <button class="btn btn-secondary" @click="showForm = false">Otkaži</button>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <table class="table table-striped table-hover" v-if="instruments">
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
        <tr v-if="instruments.empty">
          <td colspan="5" class="text-center">Nema instrumenata.</td>
        </tr>
        <tr v-for="i in instruments.content" :key="i.instrumentId">
          <td>{{ i.instrumentId }}</td>
          <td>{{ i.name }}</td>
          <td>{{ i.category.name }}</td>
          <td>{{ i.facility.name }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteInstrument(i.instrumentId)" title="Obriši">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginacija -->
    <nav class="mt-3" v-if="instruments">
      <ul class="pagination pagination-custom justify-content-center">
        <li class="page-item">
          <button class="page-link" @click="loadInstruments(0)" :disabled="instruments.first">
            <i class="fa-solid fa-angles-left"></i>
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="loadInstruments(instruments.number - 1)" :disabled="instruments.first">
            <i class="fa-solid fa-angle-left"></i>
          </button>
        </li>
        <li class="page-item">
          <button class="page-link active">{{ instruments.number + 1 }}</button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="loadInstruments(instruments.number + 1)" :disabled="instruments.last">
            <i class="fa-solid fa-angle-right"></i>
          </button>
        </li>
        <li class="page-item">
          <button class="page-link" @click="loadInstruments(instruments.totalPages - 1)" :disabled="instruments.last">
            <i class="fa-solid fa-angles-right"></i>
          </button>
        </li>
      </ul>
    </nav>
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