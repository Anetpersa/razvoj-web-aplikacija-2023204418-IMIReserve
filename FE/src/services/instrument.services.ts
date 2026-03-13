import axios from 'axios'
import type { InstrumentModel } from '@/models/instrument.model'

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus: (status) => {
        return status === 200 || status === 204
    }
})

export class InstrumentService {
    static async getAllInstruments() {
        return await client.get<InstrumentModel[]>('/instrument')
    }

    static async getInstrumentById(id: number) {
        return await client.get<InstrumentModel>(`/instrument/${id}`)
    }
}