import { Router } from "express";
import { ReservationService } from "../services/reservation.service";

export const ReservationRoute = Router();

ReservationRoute.get('/', async (req, res) => {
    try {
        res.json(await ReservationService.getAllReservations());
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ReservationRoute.get('/instrument/:instrumentId', async (req, res) => {
    try {
        const instrumentId = Number.parseInt(req.params.instrumentId)
        res.json(await ReservationService.getReservationsByInstrument(instrumentId))
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() })
    }
})

ReservationRoute.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        res.json(await ReservationService.getReservationById(id));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ReservationRoute.post('/', async (req, res) => {
    try {
        res.json(await ReservationService.createReservation(req.body));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ReservationRoute.patch('/:id/status', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const { status } = req.body;
        res.json(await ReservationService.updateReservationStatus(id, status));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ReservationRoute.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        await ReservationService.deleteReservation(id);
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});