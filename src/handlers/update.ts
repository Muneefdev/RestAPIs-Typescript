import { Request, Response } from "express";
import prismadb from "../../utils/db";
import { RequestWithUser } from "../../types";
import { Update, User } from "@prisma/client";

export const getUpdates = async (req: RequestWithUser, res: Response) => {
	const { id } = req.user as User;
	const products = await prismadb.product.findMany({
		where: {
			belongsToId: id,
		},
		include: {
			updates: true,
		},
	});

	const updates = products.reduce(
		(allUpdates: Update[], product): Update[] => {
			return [...allUpdates, ...product.updates];
		},
		[]
	);

	res.status(200).json({
		data: updates,
	});
};

export const getUpdate = async (req: Request, res: Response) => {
	const { id } = req.params;
	const update = await prismadb.update.findUnique({
		where: {
			id,
		},
	});

	res.status(200).json({ data: update });
};

export const createUpdate = async (req: RequestWithUser, res: Response) => {
	const { id: userId } = req.user as User;
	const { title, body, productId } = req.body;

	const product = await prismadb.product.findUnique({
		where: {
			id: productId,
		},
	});

	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	const update = await prismadb.update.create({
		data: {
			title,
			body,
			product: { connect: { id: productId } },
		},
	});

	res.status(200).json({
		data: update,
	});
};

export const updateUpdate = async (req: RequestWithUser, res: Response) => {
	const { id: userId } = req.user as User;
	const { id: updateId } = req.params;
	const { title, body } = req.body;

	const products = await prismadb.product.findMany({
		where: {
			belongsToId: userId,
		},
		include: {
			updates: true,
		},
	});

	const updates = products.reduce(
		(allUpdates: Update[], product): Update[] => {
			return [...allUpdates, ...product.updates];
		},
		[]
	);

	const match = updates.find((update) => update.id === updateId);

	if (!match) {
		return res.status(404).json({ message: "Update  not found" });
	}

	const update = await prismadb.update.update({
		where: {
			id: updateId,
		},
		data: {
			title,
			body,
		},
	});

	res.status(200).json({ data: update });
};

export const deleteUpdate = async (req: RequestWithUser, res: Response) => {
	const { id: userId } = req.user as User;
	const { id: updateId } = req.params;

	const products = await prismadb.product.findMany({
		where: {
			belongsToId: userId,
		},
		include: {
			updates: true,
		},
	});

	const updates = products.reduce(
		(allUpdates: Update[], product): Update[] => {
			return [...allUpdates, ...product.updates];
		},
		[]
	);

	const match = updates.find((update) => update.id === updateId);

	if (!match) {
		return res.status(404).json({ message: "Update  not found" });
	}

	const deleted = await prismadb.update.delete({
		where: {
			id: updateId,
		},
	});

	res.status(200).json({
		data: deleted,
	});
};
