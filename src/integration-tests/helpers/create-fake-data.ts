import { faker } from "@faker-js/faker";
import fs from "fs";

function removeSpecialCharacters(s: string): string { // TODO: Untested
    return s.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "");
}

function generateFakeUser(userId: number) {
    return {
        user_id: userId,
        first_name: removeSpecialCharacters(faker.person.firstName()),
        last_name: removeSpecialCharacters(faker.person.lastName()),
        password: removeSpecialCharacters(faker.internet.password()),
        signed_in: faker.datatype.boolean(),
        last_signed_in: faker.date.past().valueOf(),
        total_time: faker.date.anytime().valueOf(),
    };
}

export default () => { // UNUSED (ONLY USE ONCE AND SAVE THE DATA)
    let userData = [];
    let id = 1;
    for (let i = 0; i < 100; i++) {
        id += faker.number.int(10) + 1;
        userData.push(generateFakeUser(id));
    }
    
    fs.writeFile("fakeData.ts", "export default " + JSON.stringify(userData), "utf-8", () => {});
}