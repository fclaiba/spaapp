import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app.js";

describe("backend health", () => {
  it("responds to health endpoint", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.data.status).toBe("ok");
  });

  it("protects private routes without auth", async () => {
    const response = await request(app).get("/v1/clients");
    expect(response.statusCode).toBe(401);
  });
});
