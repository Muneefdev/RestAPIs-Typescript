import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prismadb from "..//../utils/db";
import { generateJWT } from "../modules/auth";

export const createUser = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const hashedPassword = await bcrypt.hash(password, 10);

	const user = await prismadb.user.create({
		data: {
			username,
			password: hashedPassword,
		},
	});

	const token = generateJWT(user);
	res.status(200).json({
		message: "User created successfully",
		token,
	});
};

export const signIn = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	const user = await prismadb.user.findUnique({
		where: {
			username,
		},
	});

	if (!user) {
		return res.status(401).json({ message: "User not found" });
	}

	try {
		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json({ message: "Invalid password" });
		}

		const token = generateJWT(user);
		res.status(200).json({ message: "User logged in successfully", token });
	} catch (error) {
		console.log("POST_SIGNIN: ", error);
	}
};
