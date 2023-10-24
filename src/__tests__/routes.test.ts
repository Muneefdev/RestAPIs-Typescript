import supertest from "supertest";
import app from "../server";

describe("GET /", () => {
	it("should return hello when user send request", async () => {
		const res = await supertest(app).get("/");

		expect(res.body.message).toBe("hello");
	});
});
