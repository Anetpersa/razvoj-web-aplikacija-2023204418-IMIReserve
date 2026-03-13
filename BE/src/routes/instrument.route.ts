import { Router } from "express";
import { InstrumentService } from "../services/instrument.service";

export const InstrumentRoute = Router();

InstrumentRoute.get('/', async (req, res) => {
    try {
        const page = req.query.page ? Number.parseInt(req.query.page as string) : 0;
        const size = req.query.size ? Number.parseInt(req.query.size as string) : 10;
        res.json(await InstrumentService.getAllInstruments(page, size));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

InstrumentRoute.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        res.json(await InstrumentService.getInstrumentById(id));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

InstrumentRoute.post('/', async (req, res) => {
    try {
        res.json(await InstrumentService.createInstrument(req.body));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

InstrumentRoute.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        await InstrumentService.deleteInstrument(id);
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});