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

    static async adminLogin(email: string, password: string) {
        return await client.post('/auth/admin/login', { email, password })
    }

    static async unifiedLogin(email: string, password: string) {
        return await client.post('/auth/unified-login', { email, password })
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

    static saveAdmin(data: any) {
        localStorage.setItem('admin', JSON.stringify({
            adminId: data.adminId,
            email: data.email,
            name: data.name,
            role: data.role
        }))
    }

    static getAdmin() {
        return JSON.parse(localStorage.getItem('admin') || 'null')
    }

    static clearAuth() {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('researcher')
        localStorage.removeItem('admin')
    }

    static logout() {
        this.clearAuth()
    }

    static isLoggedIn() {
        return localStorage.getItem('access') !== null
    }

    static isAdmin() {
        return localStorage.getItem('admin') !== null
    }
}