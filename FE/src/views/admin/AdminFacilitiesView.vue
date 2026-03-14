<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MainService } from '@/services/main.service'
import type { FacilityModel } from '@/models/facility.model'

const facilities = ref<FacilityModel[]>([])
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const newName = ref<string>('')
const formError = ref<string | null>(null)
const showForm = ref(false)

onMounted(() => loadFacilities())

function loadFacilities() {
  MainService.useAxios('/facility')
    .then(rsp => facilities.value = (rsp as any).data)
    .catch(() => error.value = 'Greška pri učitavanju lokacija.')
}

async function createFacility() {
  formError.value = null
  if (!newName.value.trim()) {
    formError.value = 'Naziv je obavezan.'
    return
  }
  try {
    await MainService.useAxios('/facility', 'post', { name: newName.value.trim() })
    successMsg.value = 'Lokacija je uspešno dodata!'
    newName.value = ''
    showForm.value = false
    loadFacilities()
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    formError.value = 'Greška pri dodavanju lokacije.'
  }
}

async function deleteFacility(id: number) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovu lokaciju?')) return
  try {
    await MainService.useAxios(`/facility/${id}`, 'delete')
    facilities.value = facilities.value.filter(f => f.facilityId !== id)
    successMsg.value = 'Lokacija je obrisana.'
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = 'Greška pri brisanju lokacije.'
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3><i class="fa-solid fa-location-dot me-2"></i> Lokacije</h3>
      <button class="btn btn-save" @click="showForm = !showForm">
        <i class="fa-solid fa-plus me-1"></i> Nova lokacija
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <!-- Forma -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Nova lokacija</h5>
        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
        <div class="row g-2 align-items-end">
          <div class="col-md-8">
            <label class="form-label">Naziv</label>
            <input type="text" class="form-control" v-model="newName" placeholder="Naziv lokacije" @keyup.enter="createFacility" />
          </div>
          <div class="col-md-4">
            <button class="btn btn-save me-2" @click="createFacility">
              <i class="fa-solid fa-floppy-disk me-1"></i> Sačuvaj
            </button>
            <button class="btn btn-secondary" @click="showForm = false; newName = ''">
              Otkaži
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th><i class="fa-solid fa-hashtag"></i> ID</th>
          <th><i class="fa-solid fa-location-dot"></i> Naziv</th>
          <th><i class="fa-solid fa-calendar"></i> Datum kreiranja</th>
          <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="facilities.length === 0">
          <td colspan="4" class="text-center">Nema lokacija.</td>
        </tr>
        <tr v-for="fac in facilities" :key="fac.facilityId">
          <td>{{ fac.facilityId }}</td>
          <td>{{ fac.name }}</td>
          <td>{{ fac.createdAt ? new Date(fac.createdAt).toLocaleDateString('sr') : 'N/A' }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteFacility(fac.facilityId)" title="Obriši">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>