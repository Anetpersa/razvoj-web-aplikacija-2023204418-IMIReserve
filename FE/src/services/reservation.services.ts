import { MainService } from '@/services/main.service'
import type { ReservationModel } from '@/models/reservation.model'

export class ReservationService {
    static async getAllReservations() {
        const rsp = await MainService.useAxios('/reservation')
        return rsp as { data: ReservationModel[] }
    }

    static async getReservationById(id: number) {
        const rsp = await MainService.useAxios(`/reservation/${id}`)
        return rsp as { data: ReservationModel }
    }

    static async createReservation(payload: Partial<ReservationModel>) {
        return await MainService.useAxios('/reservation', 'post', payload)
    }

    static async updateStatus(id: number, status: 'confirmed' | 'cancelled') {
        return await MainService.useAxios(`/reservation/${id}/status`, 'patch', { status })
    }

    static async deleteReservation(id: number) {
        return await MainService.useAxios(`/reservation/${id}`, 'delete')
    }
}