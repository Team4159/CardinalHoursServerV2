import { faker } from "@faker-js/faker";
import fs from "fs";

function generateFakeUser(userId: number) {
    return {
        user_id: userId,
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password(),
        signed_in: faker.datatype.boolean(),
        last_signed_in: faker.date.past().valueOf(),
        total_time: faker.date.anytime().valueOf(),
    };
}

export default () => { // UNUSED (ONLY USE ONCE AND SAVE THE DATA)
    let userData = [];
    let id = 1;
    for (let i = 0; i < 100; i++) {
        id += faker.number.int(10);
        userData.push(generateFakeUser(id));
    }
    console.log(userData);
    fs.writeFile(__dirname + "/fakeData.json", JSON.stringify(userData), () => {});
}