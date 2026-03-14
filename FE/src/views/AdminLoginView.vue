<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'

const router = useRouter()
const email = ref<string>('')
const password = ref<string>('')
const error = ref<string | null>(null)
const loading = ref<boolean>(false)

async function login() {
    error.value = null
    if (!email.value || !password.value) {
        error.value = 'Sva polja su obavezna.'
        return
    }

    loading.value = true
    try {
        const rsp = await AuthService.adminLogin(email.value, password.value)
        AuthService.saveTokens(rsp.data.access, rsp.data.refresh)
        AuthService.saveAdmin(rsp.data)
        router.push('/admin')
    } catch (e: any) {
        error.value = e.response?.data?.message || 'Pogrešan email ili šifra.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center mt-5">
    <div class="card" style="width: 400px;">
      <div class="card-body">
        <h5 class="card-title mb-4">
          <i class="fa-solid fa-shield-halved me-2"></i> Admin prijava
        </h5>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="email" placeholder="admin@imi.rs" />
        </div>

        <div class="mb-3">
          <label class="form-label">Šifra</label>
          <input type="password" class="form-control" v-model="password" placeholder="••••••••" @keyup.enter="login" />
        </div>

        <button class="btn btn-save w-100" @click="login" :disabled="loading">
          <span v-if="loading">
            <i class="fa-solid fa-spinner fa-spin me-2"></i> Prijava u toku...
          </span>
          <span v-else>
            <i class="fa-solid fa-right-to-bracket me-2"></i> Prijavi se
          </span>
        </button>
      </div>
    </div>
  </div>
</template>