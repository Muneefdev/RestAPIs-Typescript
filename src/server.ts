import express, { Request, Response } from "express";

import morgan from "morgan";
import cors from "cors";

import routes from "./router";
import { isAuthenticated } from "./modules/auth";
import { createUser, signIn } from "./handlers/user";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", isAuthenticated, routes);
app.post("/user", createUser);
app.post("/signin", signIn);

app.use((err: Error, req: Request, res: Response) => {
	res.status(500).json({ message: err.message });
});

export default app;
