import * as supertest from "supertest";
import {default as app} from "../src/server";

const request = supertest("http://localhost:8000");

describe("GET /", () => {
  it("should return 200 OK", () => {
    request
      .get("/")
      .expect(200);
  });
});
