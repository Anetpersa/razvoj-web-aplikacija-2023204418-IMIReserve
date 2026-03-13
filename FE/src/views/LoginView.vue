<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ResearcherService } from '@/services/researcher.services'
import type { ResearcherModel } from '@/models/researcher.model'

const router = useRouter()
const researchers = ref<ResearcherModel[]>([])
const selectedId = ref<number | null>(null)
const error = ref<string | null>(null)

onMounted(() => {
  ResearcherService.getAllResearchers()
    .then(rsp => researchers.value = rsp.data)
    .catch(() => error.value = 'Greška pri učitavanju istraživača.')
})

function login() {
  if (selectedId.value == null) {
    error.value = 'Molimo izaberite istraživača.'
    return
  }
  const researcher = researchers.value.find(r => r.researcherId === selectedId.value)
  if (!researcher) return
  localStorage.setItem('researcher', JSON.stringify(researcher))
  router.push('/home')
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <div class="card" style="width: 400px;">
      <div class="card-body">
        <h5 class="card-title mb-4">
          <i class="fa-solid fa-flask me-2"></i> Prijava
        </h5>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="mb-3">
          <label for="researcher" class="form-label">Izaberite istraživača</label>
          <select id="researcher" class="form-select" v-model="selectedId">
            <option :value="null" disabled>-- Izaberite --</option>
            <option v-for="r in researchers" :key="r.researcherId" :value="r.researcherId">
              {{ r.title }} {{ r.name }}
            </option>
          </select>
        </div>

        <button class="btn btn-save w-100" @click="login">
          <i class="fa-solid fa-right-to-bracket me-2"></i> Prijavi se
        </button>
      </div>
    </div>
  </div>
</template>