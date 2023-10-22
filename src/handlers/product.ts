import { Request, Response } from "express";
import prismadb from "../../utils/db";
import { RequestWithUser } from "../../types";
import { User } from "@prisma/client";

// Get all
export const getProducts = async (req: RequestWithUser, res: Response) => {
	const { id } = req.user as User;
	const user = await prismadb.user.findFirst({
		where: {
			id,
		},
		include: {
			products: true,
		},
	});

	res.status(200).json({ data: user?.products });
};

// Get one
export const getProduct = async (req: RequestWithUser, res: Response) => {
	const { id: userId } = req.user as User;
	const { id: productId } = req.params;

	const product = await prismadb.product.findUnique({
		where: {
			id: productId,
			belongsToId: userId,
		},
	});

	res.status(200).json({ data: product });
};

// Create
export const createProduct = async (req: RequestWithUser, res: Response) => {
	const { id } = req.user as User;
	const { name } = req.body;

	const product = await prismadb.product.create({
		data: {
			name,
			belongsToId: id,
		},
	});

	res.status(200).json({ data: product });
};

// Update
export const updateProduct = async (req: RequestWithUser, res: Response) => {
	const { id: userId } = req.user as User;
	const { id: productId } = req.params;
	const { name } = req.body;

	const product = await prismadb.product.update({
		where: {
			id: productId,
			belongsToId: userId,
		},
		data: {
			name,
		},
	});

	res.status(200).json({ data: product });
};

// Delete
export const deleteProduct = async (req: RequestWithUser, res: Response) => {
	const { id: userId } = req.user as User;
	const { id: productId } = req.params;

	const product = await prismadb.product.delete({
		where: {
			id: productId,
			belongsToId: userId,
		},
	});

	res.status(200).json({ data: product });
};
