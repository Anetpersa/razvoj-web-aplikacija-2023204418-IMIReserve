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

    static async refresh() {
        const refresh = localStorage.getItem('refresh')
        return await client.post('/auth/refresh', null, {
            headers: { Authorization: `Bearer ${refresh}` }
        })
    }

    static getAccessToken() {
        return localStorage.getItem('access')
    }

    static saveTokens(access: string, refresh: string) {
        localStorage.setItem('access', access)
        localStorage.setItem('refresh', refresh)
    }

    static saveResearcher(data: any) {
        localStorage.setItem('researcher', JSON.stringify({
            researcherId: data.researcherId,
            email: data.email,
            name: data.name,
            title: data.title
        }))
    }

    static logout() {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('researcher')
    }

    static isLoggedIn() {
        return localStorage.getItem('access') !== null
    }
}