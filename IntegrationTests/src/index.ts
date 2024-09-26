import express from "express";
import {primsaClient} from "./db";
import {z} from "zod";

const sumSchema = z.object({
  a: z.number(),
  b: z.number(),
});

export const app = express();
app.use(express.json());

app.post("/sum", async (req, res) => {
  const parsedObject = sumSchema.safeParse(req.body);
  if (!parsedObject.success) {
    return res.status(411).json({
      message: "Invalid input",
    });
  }

  if (parsedObject.data.a > 1000 || parsedObject.data.b > 1000) {
    return res.status(420).json({
      message: "Input too large",
    });
  }

  const result = parsedObject.data.a + parsedObject.data.b;

  const request = await primsaClient.request.create({
    data: {
      a: parsedObject.data.a,
      b: parsedObject.data.b,
      answer: result,
      type: "ADD",
    },
  });
  res.json({answer: result, id: request.id});
});
