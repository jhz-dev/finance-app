import type { Request, Response } from "express";
import { z } from "zod";
import * as categoryService from "./categoryService";

const categorySchema = z.object({
	name: z.string(),
});

export const createCategory = async (req: Request, res: Response) => {
	try {
		const { name } = categorySchema.parse(req.body);
		const category = await categoryService.createCategory(name);
		res.status(201).json(category);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.flatten().fieldErrors });
		}
		res.status(500).json({ message: "Server error" });
	}
};

export const getCategories = async (_req: Request, res: Response) => {
	const categories = await categoryService.getCategories();
	res.status(200).json(categories);
};

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { name } = categorySchema.parse(req.body);
		const category = await categoryService.updateCategory(id, name);
		res.status(200).json(category);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({ errors: error.flatten().fieldErrors });
		}
		res.status(500).json({ message: "Server error" });
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params;
	await categoryService.deleteCategory(id);
	res.status(200).json({ message: "Category deleted successfully" });
};
