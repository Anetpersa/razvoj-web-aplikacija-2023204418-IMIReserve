<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'

const router = useRouter()
const admin = AuthService.getAdmin()
</script>

<template>
  <div>
    <h3 class="mb-1">
      <i class="fa-solid fa-shield-halved me-2"></i> Dobrodošli, {{ admin?.name }}!
    </h3>
    <p class="text-muted mb-4">Izaberite sekciju kojom želite da upravljate.</p>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card dashboard-card h-100" @click="router.push('/admin/instruments')">
          <div class="card-body text-center py-4">
            <i class="fa-solid fa-microscope fa-3x mb-3 card-icon"></i>
            <h5 class="card-title">Instrumenti</h5>
            <p class="card-text text-muted">Dodajte, pregledajte i brišite laboratorijske instrumente.</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card dashboard-card h-100" @click="router.push('/admin/categories')">
          <div class="card-body text-center py-4">
            <i class="fa-solid fa-tag fa-3x mb-3 card-icon"></i>
            <h5 class="card-title">Kategorije</h5>
            <p class="card-text text-muted">Upravljajte kategorijama laboratorijskih instrumenata.</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card dashboard-card h-100" @click="router.push('/admin/facilities')">
          <div class="card-body text-center py-4">
            <i class="fa-solid fa-location-dot fa-3x mb-3 card-icon"></i>
            <h5 class="card-title">Lokacije</h5>
            <p class="card-text text-muted">Upravljajte laboratorijama i lokacijama na kojima se nalaze instrumenti.</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card dashboard-card h-100" @click="router.push('/admin/researchers')">
          <div class="card-body text-center py-4">
            <i class="fa-solid fa-user fa-3x mb-3 card-icon"></i>
            <h5 class="card-title">Istraživači</h5>
            <p class="card-text text-muted">Pregledajte listu istraživača i njihove istraživačke grupe.</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card dashboard-card h-100" @click="router.push('/admin/research-groups')">
          <div class="card-body text-center py-4">
            <i class="fa-solid fa-users fa-3x mb-3 card-icon"></i>
            <h5 class="card-title">Istraživačke grupe</h5>
            <p class="card-text text-muted">Upravljajte istraživačkim grupama instituta.</p>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card dashboard-card h-100" @click="router.push('/admin/reservations')">
          <div class="card-body text-center py-4">
            <i class="fa-solid fa-calendar-days fa-3x mb-3 card-icon"></i>
            <h5 class="card-title">Rezervacije</h5>
            <p class="card-text text-muted">Pregledajte sve rezervacije - prošle i predstojeće.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-card {
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
  border: 1px solid transparent;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  border-color: #941616;
}

.card-icon {
  color: #941616;
}
</style>