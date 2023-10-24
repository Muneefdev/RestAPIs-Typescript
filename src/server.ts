import express, { NextFunction, Request, Response } from "express";

import morgan from "morgan";
import cors from "cors";

import routes from "./router";
import { isAuthenticated } from "./modules/auth";
import { createUser, signIn } from "./handlers/user";
import { Err } from "../types";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
	res.json({
		message: "hello",
	});
});

app.use("/api", isAuthenticated, routes);
app.post("/user", createUser);
app.post("/signin", signIn);

app.use((err: Err, req: Request, res: Response, next: NextFunction) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Something went wrong";
	res.status(statusCode).json({ message });
});

export default app;
