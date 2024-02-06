import { faker } from "@faker-js/faker";
import fs from "fs";
import Session from "../../models/Session.model";
import User from "../../models/User.model";

function removeSpecialCharacters(s: string): string {
    // TODO: Untested, might not work perfectly
    return s.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
}

function generateFakeUser(userId: number, signedIn: boolean, lastSignedIn: number): User {
    return {
        user_id: userId,
        first_name: removeSpecialCharacters(faker.person.firstName()),
        last_name: removeSpecialCharacters(faker.person.lastName()),
        password: removeSpecialCharacters(faker.internet.password()),
        signed_in: signedIn,
        last_signed_in: lastSignedIn,
        total_time: faker.date.anytime().valueOf(),
    };
}

function generateFakeSession(sessionId: number, userId: number, startTime: number, endTime: number): Session {
    return {
        session_id: sessionId,
        user_id: userId,
        start_time: startTime,
        end_time: endTime,
        amended: faker.datatype.boolean(),
    };
}

export default () => {
    // ONLY USE ONCE TO GENERATE DATA; SAVE TO RUN MORE TESTS ON SAME DATA
    let userData: User[] = [];
    let userId = 1;
    let sessionData: Session[] = [];
    let sessionId = 1;

    for (let i = 0; i < 100; i++) {
        userId += faker.number.int(10) + 1;
        let userSignedIn = faker.datatype.boolean();
        let latestStartTime = faker.date.past().valueOf();
        let latestEndTime = latestStartTime + faker.number.int({ min: 10000 });

        for (let j = 0; j < 20; j++) {
            sessionId += faker.number.int(10) + 1;
            latestStartTime = latestEndTime + faker.number.int({ min: 10000 });
            latestEndTime = latestStartTime + faker.number.int({ min: 10000 });

            sessionData.push(generateFakeSession(sessionId, userId, latestStartTime, latestEndTime));
        }

        userData.push(generateFakeUser(userId, userSignedIn, userSignedIn ? latestEndTime + faker.number.int() : latestStartTime));
    }

    fs.writeFile("fakeUsers.ts", "export default " + JSON.stringify(userData), "utf-8", () => {});
    fs.writeFile("fakeSessions.ts", "export default " + JSON.stringify(sessionData), "utf-8", () => {});
};
