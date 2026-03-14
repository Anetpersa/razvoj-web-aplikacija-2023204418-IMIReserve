import axios from 'axios'

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Accept': 'application/json'
    }
})

export class AuthService {
    static async login(email: string, password: string) {
        return await client.post('/auth/login', { email, password })
    }

    static getAccessToken() {
        return localStorage.getItem('access')
    }

    static getRefreshToken() {
        return localStorage.getItem('refresh')
    }

    static saveTokens(access: string, refresh: string) {
        localStorage.setItem('access', access)
        localStorage.setItem('refresh', refresh)
    }

    static saveAuth(data: any) {
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
    }

    static saveResearcher(data: any) {
        localStorage.setItem('researcher', JSON.stringify({
            researcherId: data.researcherId,
            email: data.email,
            name: data.name,
            title: data.title
        }))
    }

    static clearAuth() {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('researcher')
    }

    static logout() {
        this.clearAuth()
    }

    static isLoggedIn() {
        return localStorage.getItem('access') !== null
    }
}