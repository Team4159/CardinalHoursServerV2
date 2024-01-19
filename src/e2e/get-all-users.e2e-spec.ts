import dotenv from "dotenv";
dotenv.config();

import request from "supertest";

import app from "../app";
import { cleanUpDatabase, resetTables, setupDatabase } from "./helpers/database";
import fakeUsers from "./data/fakeUsers";
import User from "../models/User.model";

describe("/api/v1/info/users", () => {
    before(async () => {
        await cleanUpDatabase();
        await setupDatabase();
    });

    after(async () => {
        await cleanUpDatabase();
    });

    beforeEach(async () => {
        await resetTables();
    });

    describe("GET request", () => {
        it("should return all users when database is not empty", () => {
            request(app)
                .get("/api/v1/info/users")
                .set("Accept", "application/json")
                .send()
                .expect(200)
                .expect({
                    description: "Returning all users",
                    users: structuredClone(fakeUsers).map((user: Partial<User>) => {
                        delete user.password;
                        user.signed_in = (user.signed_in) ? 1 : 0 as any;
                        return user;
                    }),
                })
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                });
        });
    });
});
