import type { CategoryModel } from './category.model'
import type { FacilityModel } from './facility.model'

export interface InstrumentModel {
    instrumentId: number
    name: string
    imageUrl: string
    categoryId: number
    facilityId: number
    createdAt: string
    category: CategoryModel
    facility: FacilityModel
}