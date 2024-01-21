import dotenv from "dotenv";
dotenv.config();

import request from "supertest";

import app from "../app";
import { cleanUpDatabase, resetTables, setupDatabase } from "./helpers/database";

describe("User Routes", () => {
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

    describe("/api/v1/users/sign-in", () => {
        describe("POST request", () => {
            it("should return 401 given no password", () => {

            });
            it("should return 403 given invalid password", () => {

            });
            it("should return 400 given user is already signed in", () => {

            });
            it("should sign in valid user", () => {

            });
        });
    });

    describe("/api/v1/users/sign-out", () => {
        describe("POST request", () => {
            it("should return 401 given no password", () => {

            });
            it("should return 403 given invalid password", () => {

            });
            it("should return 400 given user is already signed out", () => {

            });
            it("should sign out valid user", () => {

            });
        });
    });

    describe("/api/v1/users/session", () => {
        describe("POST request", () => {
            it("should return 401 given no password", () => {

            });
            it("should return 403 given invalid password", () => {

            });
            it("should return 400 given no start time", () => {

            });
            it("should return 400 given no end time", () => {

            });
            it("should return 400 given no start and end time", () => {

            });
            it("should return 400 given start time = end time", () => {

            });
            it("should return 400 given start time > end time", () => {

            });
            it("should return 400 given new session overlaps with previous session", () => {

            });
            it("should amend valid session", () => {

            });
        });
        describe("PATCH request", () => {
            it("should return 401 given no password", () => {

            });
            it("should return 403 given invalid password", () => {

            });
            it("should return 400 given no session ID", () => {

            });
            it("should return 400 given no start and end time", () => {

            });
            it("should return 400 given no session ID, start time, and end time", () => {

            });
            it("should return 400 given start time = end time", () => {

            });
            it("should return 400 given start time > end time", () => {

            });
            it("should return 400 given edited session overlaps with previous session", () => {

            });
            it("should edit valid session", () => {

            });
        });
        describe("DELETE request", () => {
            it("should return 401 given no password", () => {

            });
            it("should return 403 given invalid password", () => {

            });
            it("should return 400 given no session ID", () => {

            });
            it("should return 400 given non-existent session ID", () => {

            });
            it("should delete valid session", () => {

            });
        });
    });
});
