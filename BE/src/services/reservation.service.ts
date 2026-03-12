import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Reservation } from "../entities/Reservation";

const repo = AppDataSource.getRepository(Reservation);

export class ReservationService {
    static async getAllReservations() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { instrument: true, researcher: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getReservationById(id: number) {
        const data = await repo.findOne({
            where: { reservationId: id, deletedAt: IsNull() },
            relations: { instrument: true, researcher: true }
        });
        if (data == undefined)
            throw new Error('Rezervacija nije nadjena');
        delete data.deletedAt;
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