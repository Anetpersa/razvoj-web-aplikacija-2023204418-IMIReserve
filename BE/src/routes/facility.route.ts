import { Router } from "express";
import { FacilityService } from "../services/facility.service";

export const FacilityRoute = Router();

FacilityRoute.get('/', async (req, res) => {
    try {
        res.json(await FacilityService.getAllFacilities());
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

FacilityRoute.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        res.json(await FacilityService.getFacilityById(id));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

FacilityRoute.post('/', async (req, res) => {
    try {
        res.json(await FacilityService.createFacility(req.body));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

FacilityRoute.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        await FacilityService.deleteFacility(id);
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});