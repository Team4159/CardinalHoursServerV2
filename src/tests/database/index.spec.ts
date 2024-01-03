import dotenv from "dotenv";
dotenv.config();

import { describe, it } from "mocha";
import { expect } from "chai"; // DOES NOT WORK WITH chai v5+ YET BECAUSE USING COMMONJS (https://github.com/chaijs/chai/issues/1561)

import database from "../../database/";

describe("SQL Database Accessor", () => {
    it("should be connected to database", async () => {
        const response: any = await database.query("SHOW STATUS WHERE `variable_name` = 'Threads_running'") // See how many threads are currently running
        const threadsRunning = response[0][0]["Value"];

        expect(threadsRunning).to.be.a("string");
        expect(Number(threadsRunning)).to.be.greaterThanOrEqual(1);
    });
});