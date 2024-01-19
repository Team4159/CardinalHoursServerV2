import dotenv from "dotenv";
dotenv.config();

import request from "supertest";

import app from "../app";

describe("/api/v1/info/users", () => {
    beforeEach(() => {
        
    });

    describe("GET request", () => {
        it("should return all users when database is not empty", () => {
            request(app)
                .GET("/api/v1/info/users")
                .set("Accept", "application/json")
                .send()
                .expect(200)
                .expect({ description: "Returning all users" });
                
        });
        it("should return no users when database is empty", () => {

        })
    });
});