import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Researcher } from "../entities/Researcher";
import bcrypt from 'bcrypt';

const repo = AppDataSource.getRepository(Researcher);

export class ResearcherService {
    static async getAllResearchers() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { researchGroup: true }
        });
        data.forEach(e => {
            delete e.deletedAt
            delete e.password
        });
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
        delete data.password;
        return data;
    }

    static async createResearcher(researcher: Researcher) {
        researcher.createdAt = new Date();
        researcher.deletedAt = null;
        researcher.password = await bcrypt.hash(researcher.password, 12);
        const data = await repo.save(researcher);
        delete data.deletedAt;
        delete data.password;
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