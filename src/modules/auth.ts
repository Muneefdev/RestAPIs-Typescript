import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextFunction, Response, Request } from "express";
import { RequestWithUser } from "../../types";

export const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

export const comparePassword = async (
	password: string,
	hashedPassword: string
) => {
	return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: User) => {
	return jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET!,
		{ expiresIn: "1h" }
	);
};

//middleware to check if user is authenticated
export const isAuthenticated = (
	req: RequestWithUser,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).json({ message: "Not Authorized - 1" });
	}

	const [, tokenValue] = token.split(" ");

	if (!tokenValue) {
		return res.status(401).json({ message: "Not Authorized - 2" });
	}

	try {
		const secretKey = process.env.JWT_SECRET!;
		const payload = jwt.verify(tokenValue, secretKey);

		req.user = payload;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Not Authorized - 3" });
	}
};
