<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { MainService } from '@/services/main.service'
import type { CategoryModel } from '@/models/category.model'

const categories = ref<CategoryModel[]>([])
const error = ref<string | null>(null)
const successMsg = ref<string | null>(null)
const newName = ref<string>('')
const formError = ref<string | null>(null)
const showForm = ref(false)

onMounted(() => loadCategories())

function loadCategories() {
  MainService.useAxios('/category')
    .then(rsp => categories.value = (rsp as any).data)
    .catch(() => error.value = 'Greška pri učitavanju kategorija.')
}

async function createCategory() {
  formError.value = null
  if (!newName.value.trim()) {
    formError.value = 'Naziv je obavezan.'
    return
  }
  try {
    await MainService.useAxios('/category', 'post', { name: newName.value.trim() })
    successMsg.value = 'Kategorija je uspešno dodata!'
    newName.value = ''
    showForm.value = false
    loadCategories()
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    formError.value = 'Greška pri dodavanju kategorije.'
  }
}

async function deleteCategory(id: number) {
  if (!confirm('Da li ste sigurni da želite da obrišete ovu kategoriju?')) return
  try {
    await MainService.useAxios(`/category/${id}`, 'delete')
    categories.value = categories.value.filter(c => c.categoryId !== id)
    successMsg.value = 'Kategorija je obrisana.'
    setTimeout(() => successMsg.value = null, 3000)
  } catch (e: any) {
    error.value = 'Greška pri brisanju kategorije.'
  }
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3><i class="fa-solid fa-tag me-2"></i> Kategorije</h3>
      <button class="btn btn-save" @click="showForm = !showForm">
        <i class="fa-solid fa-plus me-1"></i> Nova kategorija
      </button>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <!-- Forma -->
    <div v-if="showForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Nova kategorija</h5>
        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>
        <div class="row g-2 align-items-end">
          <div class="col-md-8">
            <label class="form-label">Naziv</label>
            <input type="text" class="form-control" v-model="newName" placeholder="Naziv kategorije" @keyup.enter="createCategory" />
          </div>
          <div class="col-md-4">
            <button class="btn btn-save me-2" @click="createCategory">
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
          <th><i class="fa-solid fa-tag"></i> Naziv</th>
          <th><i class="fa-solid fa-calendar"></i> Datum kreiranja</th>
          <th><i class="fa-solid fa-triangle-exclamation"></i> Akcije</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="categories.length === 0">
          <td colspan="4" class="text-center">Nema kategorija.</td>
        </tr>
        <tr v-for="cat in categories" :key="cat.categoryId">
          <td>{{ cat.categoryId }}</td>
          <td>{{ cat.name }}</td>
          <td>{{ cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('sr') : 'N/A' }}</td>
          <td>
            <button class="btn btn-danger btn-sm" @click="deleteCategory(cat.categoryId)" title="Obriši">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>