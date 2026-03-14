<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { AuthService } from '@/services/auth.service'

const router = useRouter()
const route = useRoute()
const year = new Date().getFullYear()

const researcher = computed(() => JSON.parse(localStorage.getItem('researcher') || 'null'))
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

function logout() {
  AuthService.logout()
  router.push('/')
}

const isLoginPage = () => route.name === 'login'
</script>

<template>
  <div class="main-container" v-if="!isAdminRoute">

    <header>
      <div>
        <h2>Institut za medicinska istraživanja</h2>
        <p>Univerzitet u Beogradu</p>
      </div>
      <div v-if="researcher" class="text-white">
        <i class="fa-solid fa-user me-1"></i> {{ researcher.title }} {{ researcher.name }}
      </div>
    </header>

    <nav class="navbar navbar-expand-lg bg-body-tertiary mb-3">
      <div class="container-lg">
        <a class="navbar-brand ms-3" href="#">
          <i class="fa-solid fa-flask"></i> IMIReserve
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav"
          aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-center" id="navbarNav" v-if="!isLoginPage()">
          <ul class="navbar-nav mb-2 mb-lg-0 me-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/home">
                <i class="fa-solid fa-house"></i> Početna
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/reservations">
                <i class="fa-solid fa-calendar-days"></i> Moje rezervacije
              </RouterLink>
            </li>
          </ul>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0" v-if="researcher">
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

  <RouterView v-else />

</template>

<style>
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

header h2,
header p {
  margin: 0;
}

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

footer p {
  margin: 0;
  text-align: center;
}

.btn-save,
.btn-open {
  background-color: #941616;
  border-color: #941616;
  color: #fff;
}

.btn-save:hover,
.btn-open:hover {
  background-color: #7a1212;
  border-color: #7a1212;
  color: #fff;
}

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