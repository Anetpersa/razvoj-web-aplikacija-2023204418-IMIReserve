import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Facility } from "../entities/Facility";

const repo = AppDataSource.getRepository(Facility);

export class FacilityService {
    static async getAllFacilities() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { instruments: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getFacilityById(id: number) {
        const data = await repo.findOne({
            where: { facilityId: id, deletedAt: IsNull() },
            relations: { instruments: true }
        });
        if (data == undefined)
            throw new Error('Laboratorija nije nadjena');
        delete data.deletedAt;
        return data;
    }

    static async createFacility(facility: Facility) {
        facility.createdAt = new Date();
        facility.deletedAt = null;
        const data = await repo.save(facility);
        delete data.deletedAt;
        return data;
    }

    static async deleteFacility(id: number) {
        const data = await repo.findOne({
            where: { facilityId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Laboratorija nije nadjena');
        data.deletedAt = new Date();
        await repo.save(data);
    }
}