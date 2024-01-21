import dotenv from "dotenv";
dotenv.config();

import request from "supertest";

import app from "../app";
import { cleanUpDatabase, resetTables, setupDatabase } from "./helpers/database";
import fakeUsers from "./data/fakeUsers";
import User from "../models/User.model";

describe("Info Routes", () => {
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

    describe("/api/v1/info/users", () => {
        describe("GET request", () => {
            it("should return all users", () => {
                request(app)
                    .get("/api/v1/info/users")
                    .set("Accept", "application/json")
                    .send()
                    .expect(200)
                    .expect({
                        description: "Returning all users!",
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

    describe("/api/v1/info/users/:id", () => {
        describe("GET request", () => {
            it("should return user data given valid user ID", () => {
                const user: Partial<User> = structuredClone(fakeUsers[16]); // Random user
                delete user.password;
                user.signed_in = (user.signed_in) ? 1 : 0 as any;

                request(app)
                    .get(`/api/v1/info/users/${user.user_id}`)
                    .set("Accept", "application/json")
                    .send()
                    .expect(200)
                    .expect({
                        description: "User found!",
                        user: user,
                    })
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                    });
            });
            it("should return 400 given non-number user ID", () => {
                const userId = "foo";

                request(app)
                    .get(`/api/v1/info/users/${userId}`)
                    .set("Accept", "application/json")
                    .send()
                    .expect(400)
                    .expect({
                        description: "User ID is not a number!",
                    })
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                    });
            });
            it("should return 404 given non-existent user ID", () => {
                const userId = 0;

                request(app)
                    .get(`/api/v1/info/users/${userId}`)
                    .set("Accept", "application/json")
                    .send()
                    .expect(404)
                    .expect({
                        description: `User of ID: ${userId} not found in table: users`,
                    })
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                    });
            });
        });
    });
});
