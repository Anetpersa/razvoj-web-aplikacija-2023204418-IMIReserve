import { Router } from "express";
import { ResearchGroupService } from "../services/research-group.service";

export const ResearchGroupRoute = Router();

ResearchGroupRoute.get('/', async (req, res) => {
    try {
        res.json(await ResearchGroupService.getAllResearchGroups());
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ResearchGroupRoute.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        res.json(await ResearchGroupService.getResearchGroupById(id));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ResearchGroupRoute.post('/', async (req, res) => {
    try {
        res.json(await ResearchGroupService.createResearchGroup(req.body));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

ResearchGroupRoute.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        await ResearchGroupService.deleteResearchGroup(id);
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});