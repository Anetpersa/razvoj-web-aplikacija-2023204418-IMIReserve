import axios from 'axios'
import type { ReservationModel } from '@/models/reservation.model'
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

export class ReservationService {
    static async getAllReservations() {
        return await client.get<ReservationModel[]>('/reservation')
    }

    static async getReservationById(id: number) {
        return await client.get<ReservationModel>(`/reservation/${id}`)
    }

    static async createReservation(payload: Partial<ReservationModel>) {
        return await client.request({
            method: 'post',
            url: '/reservation',
            data: payload
        })
    }

    static async updateStatus(id: number, status: 'confirmed' | 'cancelled') {
        return await client.request({
            method: 'patch',
            url: `/reservation/${id}/status`,
            data: { status }
        })
    }

    static async deleteReservation(id: number) {
        return await client.request({
            method: 'delete',
            url: `/reservation/${id}`
        })
    }
}