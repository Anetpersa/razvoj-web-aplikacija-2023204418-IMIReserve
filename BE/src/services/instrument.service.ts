import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Instrument } from "../entities/Instrument";

const repo = AppDataSource.getRepository(Instrument);

export class InstrumentService {
    static async getAllInstruments(page = 0, size = 10) {
        const [data, total] = await repo.findAndCount({
            where: { deletedAt: IsNull() },
            relations: { category: true, facility: true },
            skip: page * size,
            take: size,
            order: { name: "ASC" }
        });

        data.forEach(e => delete e.deletedAt);

        return {
            content: data,
            totalElements: total,
            totalPages: Math.ceil(total / size),
            number: page,
            size: size,
            first: page === 0,
            last: page >= Math.ceil(total / size) - 1,
            numberOfElements: data.length,
            empty: data.length === 0
        }
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