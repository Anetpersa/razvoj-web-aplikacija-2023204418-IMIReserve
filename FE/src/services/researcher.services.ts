import axios from 'axios'
import type { ResearcherModel } from '@/models/researcher.model'

const client = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Accept': 'application/json'
    },
    validateStatus: (status) => {
        return status === 200 || status === 204
    }
})

export class ResearcherService {
    static async getAllResearchers() {
        return await client.get<ResearcherModel[]>('/researcher')
    }

    static async getResearcherById(id: number) {
        return await client.get<ResearcherModel>(`/researcher/${id}`)
    }
}