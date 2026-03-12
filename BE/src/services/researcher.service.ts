import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Researcher } from "../entities/Researcher";

const repo = AppDataSource.getRepository(Researcher);

export class ResearcherService {
    static async getAllResearchers() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { researchGroup: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getResearcherById(id: number) {
        const data = await repo.findOne({
            where: { researcherId: id, deletedAt: IsNull() },
            relations: { researchGroup: true }
        });
        if (data == undefined)
            throw new Error('Istraživač nije nadjen');
        delete data.deletedAt;
        return data;
    }

    static async createResearcher(researcher: Researcher) {
        researcher.createdAt = new Date();
        researcher.deletedAt = null;
        const data = await repo.save(researcher);
        delete data.deletedAt;
        return data;
    }

    static async deleteResearcher(id: number) {
        const data = await repo.findOne({
            where: { researcherId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Istraživač nije nadjen');
        data.deletedAt = new Date();
        await repo.save(data);
    }
}