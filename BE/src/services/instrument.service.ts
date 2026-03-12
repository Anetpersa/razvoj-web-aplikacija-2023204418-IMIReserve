import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Instrument } from "../entities/Instrument";

const repo = AppDataSource.getRepository(Instrument);

export class InstrumentService {
    static async getAllInstruments() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { category: true, facility: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getInstrumentById(id: number) {
        const data = await repo.findOne({
            where: { instrumentId: id, deletedAt: IsNull() },
            relations: { category: true, facility: true }
        });
        if (data == undefined)
            throw new Error('Instrument nije nadjen');
        delete data.deletedAt;
        return data;
    }

    static async createInstrument(instrument: Instrument) {
        instrument.createdAt = new Date();
        instrument.deletedAt = null;
        const data = await repo.save(instrument);
        delete data.deletedAt;
        return data;
    }

    static async deleteInstrument(id: number) {
        const data = await repo.findOne({
            where: { instrumentId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Instrument nije nadjen');
        data.deletedAt = new Date();
        await repo.save(data);
    }
}