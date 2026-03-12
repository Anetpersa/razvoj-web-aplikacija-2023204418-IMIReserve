import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Category } from "../entities/Category";

const repo = AppDataSource.getRepository(Category);

export class CategoryService {
    static async getAllCategories() {
        const data = await repo.find({
            where: { deletedAt: IsNull() },
            relations: { instruments: true }
        });
        data.forEach(e => delete e.deletedAt);
        return data;
    }

    static async getCategoryById(id: number) {
        const data = await repo.findOne({
            where: { categoryId: id, deletedAt: IsNull() },
            relations: { instruments: true }
        });
        if (data == undefined)
            throw new Error('Kategorija nije nadjena');
        delete data.deletedAt;
        return data;
    }

    static async createCategory(category: Category) {
        category.createdAt = new Date();
        category.deletedAt = null;
        const data = await repo.save(category);
        delete data.deletedAt;
        return data;
    }

    static async deleteCategory(id: number) {
        const data = await repo.findOne({
            where: { categoryId: id, deletedAt: IsNull() }
        });
        if (data == undefined)
            throw new Error('Kategorija nije nadjena');
        data.deletedAt = new Date();
        await repo.save(data);
    }
}