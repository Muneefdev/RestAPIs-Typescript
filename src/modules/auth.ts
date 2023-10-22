import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { NextFunction, Response, Request } from "express";
import { RequestWithUser } from "../../types";

export const generateJWT = (user: User) => {
	return jwt.sign(
		{ id: user.id, username: user.username },
		process.env.JWT_SECRET!,
		{ expiresIn: "1d" }
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
		return res.status(401).json({ message: "Not Authorized" });
	}

	const [, tokenValue] = token.split(" ");

	if (!tokenValue) {
		return res.status(401).json({ message: "Not Authorized" });
	}

	try {
		const secretKey = process.env.JWT_SECRET!;
		const payload = jwt.verify(tokenValue, secretKey);

		req.user = payload;

		next();
	} catch (error) {
		return res.status(401).json({ message: "Not Authorized" });
	}
};
