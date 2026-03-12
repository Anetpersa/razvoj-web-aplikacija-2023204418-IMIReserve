import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { ResearchGroup } from "../entities/ResearchGroup";

const repo = AppDataSource.getRepository(ResearchGroup);

export class ResearchGroupService {
    static async getAllResearchGroups() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { researchers: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getResearchGroupById(id: number) {
        const data = await repo.findOne({
            where: { researchGroupId: id, deletedAt: IsNull() },
            relations: { researchers: true }
        });
        if (data == undefined)
            throw new Error('Istraživačka grupa nije nadjena');
        delete data.deletedAt;
        return data;
    }

    static async createResearchGroup(researchGroup: ResearchGroup) {
        researchGroup.createdAt = new Date();
        researchGroup.deletedAt = null;
        const data = await repo.save(researchGroup);
        delete data.deletedAt;
        return data;
    }

    static async deleteResearchGroup(id: number) {
        const data = await repo.findOne({
            where: { researchGroupId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Istraživačka grupa nije nadjena');
        data.deletedAt = new Date();
        await repo.save(data);
    }
}