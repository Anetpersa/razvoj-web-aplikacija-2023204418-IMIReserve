<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { AuthService } from '@/services/auth.service'

const router = useRouter()
const admin = AuthService.getAdmin()
const year = new Date().getFullYear()

function logout() {
    AuthService.logout()
    router.push('/admin/login')
}
</script>

<template>
  <div class="main-container">
    <header>
      <div>
        <h2>Institut za medicinska istraživanja</h2>
        <p>Univerzitet u Beogradu — Admin panel</p>
      </div>
    </header>

    <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
      <div class="container-lg">
        <a class="navbar-brand ms-3" href="#">
          <i class="fa-solid fa-shield-halved"></i> IMIReserve Admin
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#adminNavbar" aria-controls="adminNavbar"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="adminNavbar">
          <ul class="navbar-nav mb-2 mb-lg-0 me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/instruments">
                <i class="fa-solid fa-microscope"></i> Instrumenti
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/researchers">
                <i class="fa-solid fa-user"></i> Istraživači
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/categories">
                <i class="fa-solid fa-tag"></i> Kategorije
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/facilities">
                <i class="fa-solid fa-location-dot"></i> Lokacije
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/admin/reservations">
                <i class="fa-solid fa-calendar-days"></i> Rezervacije
              </RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0" v-if="admin">
            <li class="nav-item d-flex align-items-center me-3">
              <span class="navbar-text">
                <i class="fa-solid fa-shield-halved me-1"></i> {{ admin.name }}
              </span>
            </li>
            <li class="nav-item">
              <button class="btn btn-logout" @click="logout">
                <i class="fa-solid fa-right-from-bracket me-1"></i> Odjavi se
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <RouterView />

    <footer>
      <p>Institut za medicinska istraživanja Univerzitet u Beogradu &copy; {{ year }}</p>
    </footer>
  </div>
</template>

<style scoped>
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #cf2e2e;
  color: white;
  margin-bottom: 10px;
}

header h2, header p { margin: 0; }

footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 20px;
  background-color: #cf2e2e;
  color: white;
  margin: 10px auto 0 auto;
  height: 40px;
}

footer p { margin: 0; text-align: center; }

.btn-logout {
  background-color: transparent;
  border-color: #fff;
  color: #fff;
}

.btn-logout:hover {
  background-color: #7a1212;
  border-color: #7a1212;
  color: #fff;
}
</style>