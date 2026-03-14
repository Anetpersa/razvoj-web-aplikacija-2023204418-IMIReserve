import { MainService } from '@/services/main.service'
import type { ResearcherModel } from '@/models/researcher.model'

export class ResearcherService {
    static async getAllResearchers() {
        const rsp = await MainService.useAxios('/researcher')
        return rsp as { data: ResearcherModel[] }
    }

    static async getResearcherById(id: number) {
        const rsp = await MainService.useAxios(`/researcher/${id}`)
        return rsp as { data: ResearcherModel }
    }
}