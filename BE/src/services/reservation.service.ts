import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Reservation } from "../entities/Reservation";

const repo = AppDataSource.getRepository(Reservation);

export class ReservationService {
    static async getAllReservations() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { instrument: { category: true, facility: true }, researcher: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getReservationById(id: number) {
        const data = await repo.findOne({
            where: { reservationId: id, deletedAt: IsNull() },
            relations: { instrument: { category: true, facility: true }, researcher: true }
        });
        if (data == undefined)
            throw new Error('Rezervacija nije nadjena');
        delete data.deletedAt;
        return data;
    }

    static async getReservationsByInstrument(instrumentId: number) {
        const data = await repo.find({
            where: {
                instrumentId: instrumentId,
                deletedAt: IsNull()
            },
            order: { startTime: 'ASC' }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async createReservation(reservation: Reservation) {
        reservation.createdAt = new Date();
        reservation.deletedAt = null;
        reservation.status = 'pending';
        const data = await repo.save(reservation);
        delete data.deletedAt;
        return data;
    }

    static async updateReservationStatus(id: number, status: string) {
        if (status !== 'confirmed' && status !== 'cancelled')
            throw new Error('Neispravan status. Dozvoljene vrednosti: confirmed, cancelled');

        const data = await repo.findOne({
            where: { reservationId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Rezervacija nije nadjena');

        if (data.status !== 'pending')
            throw new Error('Status rezervacije se može promeniti samo iz pending stanja');

        data.status = status as 'confirmed' | 'cancelled';
        const updated = await repo.save(data);
        delete updated.deletedAt;
        return updated;
    }

    static async deleteReservation(id: number) {
        const data = await repo.findOne({
            where: { reservationId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Rezervacija nije nadjena');
        data.deletedAt = new Date();
        await repo.save(data);
    }
}