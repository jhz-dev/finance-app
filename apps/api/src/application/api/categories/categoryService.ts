import prisma from "../../../infrastructure/database/prisma";

export const createCategory = async (name: string) => {
	const category = await prisma.category.create({
		data: {
			name,
		},
	});
	return category;
};

export const getCategories = async () => {
	const categories = await prisma.category.findMany();
	return categories;
};

export const updateCategory = async (id: string, name: string) => {
	const category = await prisma.category.update({
		where: { id },
		data: { name },
	});
	return category;
};

export const deleteCategory = async (id: string) => {
	const category = await prisma.category.delete({
		where: { id },
	});
	return category;
};
