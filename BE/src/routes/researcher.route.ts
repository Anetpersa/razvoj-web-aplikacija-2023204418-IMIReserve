import { Router } from "express";
import { ResearcherService } from "../services/researcher.service";

export const ResearcherRoute = Router();

ResearcherRoute.get('/', async (req, res) => {
    try {
        res.json(await ResearcherService.getAllResearchers());
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ResearcherRoute.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        res.json(await ResearcherService.getResearcherById(id));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ResearcherRoute.post('/', async (req, res) => {
    try {
        res.json(await ResearcherService.createResearcher(req.body));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ResearcherRoute.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        await ResearcherService.deleteResearcher(id);
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});