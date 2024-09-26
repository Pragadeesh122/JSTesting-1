import {describe, expect, it, vi} from "vitest";
import request from "supertest";
import {app} from "../index";
import {prismaClient} from "../__mocks__/db";

vi.mock("../db");

describe("POST /sum", () => {
  it("should return the sum of two numbers", async () => {
    prismaClient.sum.create.mockResolvedValue({
      id: 1,
      result: 3,
      a: 1,
      b: 2,
    });

    vi.spyOn(prismaClient.sum, "create");

    const res = await request(app).post("/sum").send({
      a: 1,
      b: 2,
    });

    expect(prismaClient.sum.create).toHaveBeenCalledWith({
      data: {
        a: 1,
        b: 2,
        result: 3,
      },
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.answer).toBe(3);
  });

  it("should return false for number's too large", async () => {
    const res = await request(app).post("/sum").send({
      a: 1000001,
      b: 1000001,
    });

    expect(res.statusCode).toBe(422);
    expect(res.body.message).toBe("Number too large");
  });

  it("should return the sum of two negative numbers", async () => {
    const res = await request(app).post("/sum").send({
      a: -1,
      b: -2,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(-3);
  });

  it("should return the sum of two zero number", async () => {
    const res = await request(app).post("/sum").send({
      a: 0,
      b: 0,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(0);
  });

  it("should return 411 if the input is invalid", async () => {
    const res = await request(app).post("/sum").send({
      a: "1",
      b: 2,
    });
    expect(res.statusCode).toBe(411);
    expect(res.body.message).toBe("Incorrect inputs");
  });

  it("test for the GET headers", async () => {
    const res = await request(app)
      .get("/sum")
      .set({
        a: "1",
        b: "2",
      })
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe(3);
  });
});
