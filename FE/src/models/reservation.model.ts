import type { InstrumentModel } from './instrument.model'
import type { ResearcherModel } from './researcher.model'

export interface ReservationModel {
    reservationId: number
    researcherId: number
    instrumentId: number
    startTime: string
    endTime: string
    status: 'pending' | 'confirmed' | 'cancelled'
    createdAt: string
    instrument: InstrumentModel
    researcher: ResearcherModel
}