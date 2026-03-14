<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MainService } from '@/services/main.service'
import type { ResearcherModel } from '@/models/researcher.model'

interface ResearchGroupModel {
  researchGroupId: number
  name: string
}

const researchers = ref<ResearcherModel[]>([])
const groups = ref<ResearchGroupModel[]>([])
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const showForm = ref(false)
const formError = ref<string | null>(null)
const showPassword = ref(false)

const form = ref({
  name: '',
  title: '',
  email: '',
  password: '',
  researchGroupId: null as number | null
})

onMounted(() => {
  loadResearchers()
  loadGroups()
})

async function loadResearchers() {
  await MainService.useAxios('/researcher')
    .then(rsp => researchers.value = (rsp as any).data)
    .catch(() => error.value = 'Greška pri učitavanju istraživača.')
}

function loadGroups() {
  MainService.useAxios('/research-group')
    .then(rsp => groups.value = (rsp as any).data)
}

async function createResearcher() {
  formError.value = null
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.password.trim() || !form.value.researchGroupId) {
    formError.value = 'Sva polja su obavezna.'
    return
  }
  try {
    await MainService.useAxios('/researcher', 'post', { ...form.value })
    successMsg.value = 'Istraživač je uspešno dodat!'
    form.value = { name: '', title: '', email: '', password: '', researchGroupId: null }
    showForm.value = false
    await loadResearchers()
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    formError.value = 'Greška pri dodavanju istraživača.'
  }
}

async function deleteResearcher(id: number) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovog istraživača?')) return
  try {
    await MainService.useAxios(`/researcher/${id}`, 'delete')
    researchers.value = researchers.value.filter(r => r.researcherId !== id)
    successMsg.value = 'Istraživač je obrisan.'
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = 'Greška pri brisanju istraživača.'
  }
}

function groupName(id: number) {
  return groups.value.find(g => g.researchGroupId === id)?.name || 'N/A'
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3><i class="fa-solid fa-user me-2"></i> Istraživači</h3>
      <button class="btn btn-save" @click="showForm = !showForm">
        <i class="fa-solid fa-plus me-1"></i> Novi istraživač
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <!-- Forma -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Novi istraživač</h5>
        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Ime i prezime</label>
            <input type="text" class="form-control" v-model="form.name" placeholder="Ime Prezime" autocomplete="off" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Titula</label>
            <input type="text" class="form-control" v-model="form.title" placeholder="dr, prof. dr, mr..." autocomplete="off" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="form.email"
              placeholder="ime.prezime@imi.rs" autocomplete="off" />
          </div>
          <div class="col-md-6">
            <label class="form-label">Šifra</label>
            <div class="input-group">
              <input :type="showPassword ? 'text' : 'password'" class="form-control"
                v-model="form.password" autocomplete="new-password" />
              <button class="btn btn-secondary" type="button" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Istraživačka grupa</label>
            <select class="form-select" v-model="form.researchGroupId">
              <option :value="null" disabled>-- Izaberite grupu --</option>
              <option v-for="g in groups" :key="g.researchGroupId" :value="g.researchGroupId">
                {{ g.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="mt-3">
          <button class="btn btn-save me-2" @click="createResearcher">
            <i class="fa-solid fa-floppy-disk me-1"></i> Sačuvaj
          </button>
          <button class="btn btn-secondary" @click="showForm = false">Otkaži</button>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><i class="fa-solid fa-hashtag"></i> ID</th>
          <th><i class="fa-solid fa-graduation-cap"></i> Titula</th>
          <th><i class="fa-solid fa-user"></i> Ime i prezime</th>
          <th><i class="fa-solid fa-envelope"></i> Email</th>
          <th><i class="fa-solid fa-users"></i> Grupa</th>
          <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="researchers.length === 0">
          <td colspan="6" class="text-center">Nema istraživača.</td>
        </tr>
        <tr v-for="r in researchers" :key="r.researcherId">
          <td>{{ r.researcherId }}</td>
          <td>{{ r.title }}</td>
          <td>{{ r.name }}</td>
          <td>{{ r.email }}</td>
          <td>{{ groupName(r.researchGroupId) }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteResearcher(r.researcherId)" title="Obriši">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>