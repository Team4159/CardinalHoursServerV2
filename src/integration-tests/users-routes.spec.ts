import dotenv from "dotenv";
dotenv.config();

import request from "supertest";

import app from "../app";
import User, { getUserById } from "../models/User.model";
import fakeUsers from "./data/fakeUsers";
import { cleanUpDatabase, resetTables, setupDatabase } from "./helpers/database";
import fakeSessions from "./data/fakeSessions";
import Session from "../models/Session.model";

describe("User Routes", () => { // TODO: make each api request into a helper function
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

    describe(("Password Authorization"), () => {
        const runs = [
            { method: "POST", route: "/api/v1/users/sign-in" },
            { method: "POST", route: "/api/v1/users/sign-out" },
            { method: "POST", route: "/api/v1/users/session" },
            { method: "PATCH", route: "/api/v1/users/session" },
            { method: "DELETE", route: "/api/v1/users/session" },
        ];

        for (const run of runs) {
            describe(`${run.method} ${run.route}`, () => {
                it("should return 401 given no password", (done) => {
                    let res;

                    switch (run.method) {
                        case "POST":
                            res = request(app).post(run.route).set("Accept", "application/json");
                            break;
                        case "PATCH":
                            res = request(app).patch(run.route).set("Accept", "application/json");
                            break;
                        case "DELETE":
                            res = request(app).delete(run.route).set("Accept", "application/json");
                            break;
                        default:
                            throw new Error("Missing run method");
                    }

                    res.expect(401)
                        .expect({
                            description: "Missing password!",
                        })
                        .end((err) => {
                            if (err) return done(err);
                            done();
                        });
                });
                it("should return 403 given invalid password", (done) => {
                    let res;

                    switch (run.method) {
                        case "POST":
                            res = request(app).post(run.route).set("Content-Type", "application/json").set("Accept", "application/json").send({ password: " " });
                            break;
                        case "PATCH":
                            res = request(app).patch(run.route).set("Content-Type", "application/json").set("Accept", "application/json").send({ password: " " });
                            break;
                        case "DELETE":
                            res = request(app).delete(run.route).set("Content-Type", "application/json").set("Accept", "application/json").send({ password: " " });
                            break;
                        default:
                            throw new Error("Missing run method");
                    }

                    res.expect(403)
                        .expect({
                            description: "Invalid password!",
                        })
                        .end((err) => {
                            if (err) return done(err);
                            done();
                        });
                });
            });
        }
    })

    describe("/api/v1/users/sign-in", () => {
        describe("POST request", () => {
            it("should return 400 given user is already signed in", (done) => {
                // Throws an error if no test user is signed in
                let signedInUser = fakeUsers.filter((user: User) => user.signed_in)[0];

                request(app)
                    .post("/api/v1/users/sign-in")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: signedInUser.password,
                    })
                    .expect(400)
                    .expect({
                        description: `${signedInUser.first_name} ${signedInUser.last_name} is already signed in!`,
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should sign in valid user", (done) => {
                // Throws an error if no test user is signed out
                let signedOutUser = fakeUsers.filter((user: User) => !user.signed_in)[0];

                request(app)
                    .post("/api/v1/users/sign-in")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: signedOutUser.password,
                    })
                    .expect(200)
                    .expect({
                        description: `Signed in as ${signedOutUser.first_name} ${signedOutUser.last_name}!`,
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        });
    });

    describe("/api/v1/users/sign-out", () => {
        describe("POST request", () => {
            it("should return 400 given user is already signed out", (done) => {
                // Throws an error if no test user is signed out
                let signedOutUser = fakeUsers.filter((user: User) => !user.signed_in)[0];

                request(app)
                    .post("/api/v1/users/sign-out")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: signedOutUser.password,
                    })
                    .expect(400)
                    .expect({
                        description: `${signedOutUser.first_name} ${signedOutUser.last_name} is not signed in!`,
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should sign out valid user", (done) => {
                // Throws an error if no test user is signed in
                let signedInUser = fakeUsers.filter((user: User) => user.signed_in)[0];

                request(app)
                    .post("/api/v1/users/sign-out")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: signedInUser.password,
                    })
                    .expect(200)
                    .expect({
                        description: `Signed out as ${signedInUser.first_name} ${signedInUser.last_name}!`,
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        });
    });

    describe("/api/v1/users/session", () => {
        describe("POST request", () => {
            it("should return 400 given no start time", (done) => {
                let userPassword; // TODO: TURN INTO A HELPER FUNCTION
                let startTime;
                let endTime;

                outer: for (const fakeUser of fakeUsers) {
                    let sessions = fakeSessions.filter((session: Session) => session.user_id === fakeUser.user_id);
                    let lastSession = sessions[0];

                    for (const session of sessions.slice(1)) {
                        if (lastSession.end_time + 1 < session.start_time - 1) {
                            userPassword = fakeUser.password;
                            startTime = lastSession.end_time + 1;
                            endTime = session.start_time - 1;
                            break outer;
                        }
                    }
                }

                if (!userPassword || !startTime || !endTime) {
                    throw new Error("Missing userPassword or startTime or endTime!");
                }

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: userPassword,
                        end_time: endTime,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing start and/or end times!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given no end time", (done) => {
                let userPassword;
                let startTime;
                let endTime;

                outer: for (const fakeUser of fakeUsers) {
                    let sessions = fakeSessions.filter((session: Session) => session.user_id === fakeUser.user_id);
                    let lastSession = sessions[0];

                    for (const session of sessions.slice(1)) {
                        if (lastSession.end_time + 1 < session.start_time - 1) {
                            userPassword = fakeUser.password;
                            startTime = lastSession.end_time + 1;
                            endTime = session.start_time - 1;
                            break outer;
                        }
                    }
                }

                if (!userPassword || !startTime || !endTime) {
                    throw new Error("Missing userPassword or startTime or endTime!");
                }

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: userPassword,
                        start_time: startTime,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing start and/or end times!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given no start and end time", (done) => {
                let userPassword;
                let startTime;
                let endTime;

                outer: for (const fakeUser of fakeUsers) {
                    let sessions = fakeSessions.filter((session: Session) => session.user_id === fakeUser.user_id);
                    let lastSession = sessions[0];

                    for (const session of sessions.slice(1)) {
                        if (lastSession.end_time + 1 < session.start_time - 1) {
                            userPassword = fakeUser.password;
                            startTime = lastSession.end_time + 1;
                            endTime = session.start_time - 1;
                            break outer;
                        }
                    }
                }

                if (!userPassword || !startTime || !endTime) {
                    throw new Error("Missing userPassword or startTime or endTime!");
                }

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: userPassword,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing start and/or end times!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given start time = end time", (done) => {
                let userPassword;
                let startTime;
                let endTime;

                outer: for (const fakeUser of fakeUsers) {
                    let sessions = fakeSessions.filter((session: Session) => session.user_id === fakeUser.user_id);
                    let lastSession = sessions[0];

                    for (const session of sessions.slice(1)) {
                        if (lastSession.end_time + 1 < session.start_time - 1) {
                            userPassword = fakeUser.password;
                            startTime = lastSession.end_time + 1;
                            endTime = session.start_time - 1;
                            break outer;
                        }
                    }
                }

                if (!userPassword || !startTime || !endTime) {
                    throw new Error("Missing userPassword or startTime or endTime!");
                }

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: userPassword,
                        start_time: startTime,
                        end_time: startTime,
                    })
                    .expect(400)
                    .expect({
                        description: "Start time must be less than end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given start time > end time", (done) => {
                let userPassword;
                let startTime;
                let endTime;

                outer: for (const fakeUser of fakeUsers) {
                    let sessions = fakeSessions.filter((session: Session) => session.user_id === fakeUser.user_id);
                    let lastSession = sessions[0];

                    for (const session of sessions.slice(1)) {
                        if (lastSession.end_time + 1 < session.start_time - 1) {
                            userPassword = fakeUser.password;
                            startTime = lastSession.end_time + 1;
                            endTime = session.start_time - 1;
                            break outer;
                        }
                    }
                }

                if (!userPassword || !startTime || !endTime) {
                    throw new Error("Missing userPassword or startTime or endTime!");
                }

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: userPassword,
                        start_time: endTime,
                        end_time: startTime,
                    })
                    .expect(400)
                    .expect({
                        description: "Start time must be less than end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given new session overlaps with previous session", (done) => {
                const session = fakeSessions[0];
                const user = fakeUsers.filter((user: User) => user.user_id === session.user_id)[0];

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        start_time: session.start_time,
                        end_time: session.end_time,
                    })
                    .expect(400)
                    .expect({
                        description: "New session overlaps with existing session!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should amend valid session", (done) => {
                let userPassword;
                let startTime;
                let endTime;

                outer: for (const fakeUser of fakeUsers) { // TODO: Turn into helper function
                    let sessions = fakeSessions.filter((session: Session) => session.user_id === fakeUser.user_id);
                    let lastSession = sessions[0];

                    for (const session of sessions.slice(1)) {
                        if (lastSession.end_time + 1 < session.start_time - 1) {
                            userPassword = fakeUser.password;
                            startTime = lastSession.end_time + 1;
                            endTime = session.start_time - 1;
                            break outer;
                        }
                    }
                }

                if (!userPassword || !startTime || !endTime) {
                    throw new Error("Missing userPassword or startTime or endTime!");
                }

                request(app)
                    .post("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: userPassword,
                        start_time: startTime,
                        end_time: endTime,
                    })
                    .expect(200)
                    .expect({
                        description: "Amended new session!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        });
        describe("PATCH request", () => {
            it("should return 400 given no session ID", (done) => {
                const user: User = fakeUsers[0];
                const session: Session = fakeSessions.filter(session => session.user_id === user.user_id)[0]; // Might throw error if test data invalid

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        start_time: session.start_time, // No change to session time
                        end_time: session.end_time,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing session ID and/or start time and/or end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given no start and end time", (done) => {
                const user: User = fakeUsers[0];
                const session: Session = fakeSessions.filter(session => session.user_id === user.user_id)[0]; // Might throw error if test data invalid

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: session.session_id,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing session ID and/or start time and/or end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given no session ID, start time, and end time", (done) => {
                const user: User = fakeUsers[0];

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing session ID and/or start time and/or end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given start time = end time", (done) => {
                const user: User = fakeUsers[0];
                const session: Session = fakeSessions.filter(session => session.user_id === user.user_id)[0]; // Might throw error if test data invalid

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: session.session_id,
                        start_time: session.start_time, // Same start & end time
                        end_time: session.start_time,
                    })
                    .expect(400)
                    .expect({
                        description: "Start time must be less than end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given start time > end time", (done) => {
                const user: User = fakeUsers[0];
                const session: Session = fakeSessions.filter(session => session.user_id === user.user_id)[0]; // Might throw error if test data invalid

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: session.session_id,
                        start_time: session.end_time, // Swapped start & end time
                        end_time: session.start_time,
                    })
                    .expect(400)
                    .expect({
                        description: "Start time must be less than end time!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given edited session overlaps with another session", (done) => {
                const user: User = fakeUsers[0];
                const sessions: Session[] = fakeSessions.filter(session => session.user_id === user.user_id)
                const sessionToBeEdited = sessions[0]; // Might throw error if test data invalid
                const sessionToBeOverlapped = sessions[1];

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: sessionToBeEdited.session_id,
                        start_time: sessionToBeEdited.end_time,
                        end_time: sessionToBeOverlapped.start_time + 2,
                    })
                    .expect(400)
                    .expect({
                        description: "Edited session overlaps with existing session!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should edit valid session", (done) => {
                const user: User = fakeUsers[0];
                const sessionToBeEdited: Session = fakeSessions.filter(session => session.user_id === user.user_id)[0]; // Might throw error if test data invalid
                const nextSession: Session = fakeSessions.filter(
                    session => session.session_id !== sessionToBeEdited.session_id && session.user_id === user.user_id && session.start_time > sessionToBeEdited.end_time + 1
                )[0];

                request(app)
                    .patch("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: sessionToBeEdited.session_id,
                        start_time: sessionToBeEdited.end_time - 1,
                        end_time: nextSession.start_time - 1,
                    })
                    .expect(200)
                    .expect({
                        description: "Edited session!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        });
        describe("DELETE request", () => {
            it("should return 400 given no session ID", (done) => {
                const user: User = fakeUsers[0];

                request(app)
                    .delete("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                    })
                    .expect(400)
                    .expect({
                        description: "Missing session ID!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 400 given non-existent session ID", (done) => {
                const user: User = fakeUsers[0];

                request(app)
                    .delete("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: -1,
                    })
                    .expect(400)
                    .expect({
                        description: "Session does not exist!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should return 403 given session ID belonging to another user", (done) => {
                const user: User = fakeUsers[0];
                const session: Session = fakeSessions.filter(session => session.user_id !== user.user_id)[0];

                request(app)
                    .delete("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: session.session_id,
                    })
                    .expect(403)
                    .expect({
                        description: "Cannot delete session by other user!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it("should delete valid session", (done) => {
                const user: User = fakeUsers[0];
                const session: Session = fakeSessions.filter(session => session.user_id === user.user_id)[0];

                request(app)
                    .delete("/api/v1/users/session")
                    .set("Content-Type", "application/json")
                    .set("Accept", "application/json")
                    .send({
                        password: user.password,
                        session_id: session.session_id,
                    })
                    .expect(200)
                    .expect({
                        description: "Deleted session!",
                    })
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        });
    });
});
