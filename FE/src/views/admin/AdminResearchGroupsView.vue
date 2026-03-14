<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MainService } from '@/services/main.service'

interface ResearchGroupModel {
  researchGroupId: number
  name: string
  createdAt: string
}

const groups = ref<ResearchGroupModel[]>([])
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const newName = ref<string>('')
const formError = ref<string | null>(null)
const showForm = ref(false)

onMounted(() => loadGroups())

function loadGroups() {
  MainService.useAxios('/research-group')
    .then(rsp => groups.value = (rsp as any).data)
    .catch(() => error.value = 'Greška pri učitavanju istraživačkih grupa.')
}

async function createGroup() {
  formError.value = null
  if (!newName.value.trim()) {
    formError.value = 'Naziv je obavezan.'
    return
  }
  try {
    await MainService.useAxios('/research-group', 'post', { name: newName.value.trim() })
    successMsg.value = 'Istraživačka grupa je uspešno dodata!'
    newName.value = ''
    showForm.value = false
    loadGroups()
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    formError.value = 'Greška pri dodavanju istraživačke grupe.'
  }
}

async function deleteGroup(id: number) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovu istraživačku grupu?')) return
  try {
    await MainService.useAxios(`/research-group/${id}`, 'delete')
    groups.value = groups.value.filter(g => g.researchGroupId !== id)
    successMsg.value = 'Istraživačka grupa je obrisana.'
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = 'Greška pri brisanju istraživačke grupe.'
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3><i class="fa-solid fa-users me-2"></i> Istraživačke grupe</h3>
      <button class="btn btn-save" @click="showForm = !showForm">
        <i class="fa-solid fa-plus me-1"></i> Nova grupa
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <!-- Forma -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Nova istraživačka grupa</h5>
        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
        <div class="row g-2 align-items-end">
          <div class="col-md-8">
            <label class="form-label">Naziv</label>
            <input type="text" class="form-control" v-model="newName" placeholder="Naziv grupe" @keyup.enter="createGroup" />
          </div>
          <div class="col-md-4">
            <button class="btn btn-save me-2" @click="createGroup">
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
          <th><i class="fa-solid fa-users"></i> Naziv</th>
          <th><i class="fa-solid fa-calendar"></i> Datum kreiranja</th>
          <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="groups.length === 0">
          <td colspan="4" class="text-center">Nema istraživačkih grupa.</td>
        </tr>
        <tr v-for="g in groups" :key="g.researchGroupId">
          <td>{{ g.researchGroupId }}</td>
          <td>{{ g.name }}</td>
          <td>{{ new Date(g.createdAt).toLocaleDateString('sr') }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteGroup(g.researchGroupId)" title="Obriši">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>