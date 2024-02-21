import dotenv from "dotenv";
dotenv.config();

import { expect } from "chai"; // DOES NOT WORK WITH chai v5+ YET BECAUSE USING COMMONJS (https://github.com/chaijs/chai/issues/1561)

import db from "../../database";

describe("SQL Database Accessor", () => {
    it("should be connected to database", async () => {
        const response: any = await db.query("SHOW STATUS WHERE `variable_name` = 'Threads_running'"); // See how many threads are currently running
        const threadsRunning = response[0][0]["Value"];

        expect(Number(threadsRunning)).to.be.greaterThanOrEqual(1);
    });

    it('should get database name as "teamahos_test"', async () => {
        const response: any = await db.query("SELECT DATABASE()"); // Get database name
        const dbName = response[0][0]["DATABASE()"];

        expect(dbName).to.equal("teamahos_test");
    });
});
