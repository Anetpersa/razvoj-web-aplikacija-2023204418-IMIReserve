import { MainService } from '@/services/main.service'
import type { InstrumentModel } from '@/models/instrument.model'
import type { PageModel } from '@/models/page.model'

export class InstrumentService {
    static async getAllInstruments(page = 0, size = 10) {
        const rsp = await MainService.useAxios(`/instrument?page=${page}&size=${size}`)
        return rsp as { data: PageModel<InstrumentModel> }
    }

    static async getInstrumentById(id: number) {
        const rsp = await MainService.useAxios(`/instrument/${id}`)
        return rsp as { data: InstrumentModel }
    }
}