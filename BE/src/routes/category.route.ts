import { Router } from "express";
import { CategoryService } from "../services/category.service";

export const CategoryRoute = Router();

CategoryRoute.get('/', async (req, res) => {
    try {
        res.json(await CategoryService.getAllCategories());
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

CategoryRoute.get('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        res.json(await CategoryService.getCategoryById(id));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

CategoryRoute.post('/', async (req, res) => {
    try {
        res.json(await CategoryService.createCategory(req.body));
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});

CategoryRoute.delete('/:id', async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        await CategoryService.deleteCategory(id);
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: e.message, timestamp: new Date() });
    }
});