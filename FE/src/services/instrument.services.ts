import axios from 'axios'
import type { InstrumentModel } from '@/models/instrument.model'
import type { PageModel } from '@/models/page.model'
import { AuthService } from '@/services/auth.service'

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus: (status) => {
        return status === 200 || status === 204
    }
})

client.interceptors.request.use(config => {
    const token = AuthService.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

export class InstrumentService {
    static async getAllInstruments(page = 0, size = 10) {
        return await client.get<PageModel<InstrumentModel>>(`/instrument?page=${page}&size=${size}`)
    }

    static async getInstrumentById(id: number) {
        return await client.get<InstrumentModel>(`/instrument/${id}`)
    }
}