import { expect } from "chai";

import updateBuilder from "../../utils/updateBuilder";


describe("SQL Update Query Builder", () => {
    it("returns full prepared statement given table, updates, and conditions", () => {
        const table = "users";
        const updates = {
            first_name: "fod",
            last_name: "bart",
            bool_test: true
        };
        const conditions = {
            user_id: 2,
            password: "pwd",
        };

        const update = updateBuilder(table, updates, conditions);

        expect(update).to.be.deep.equal({
            query: "UPDATE ? SET ? WHERE ?",
            params: [
                "users",
                "first_name = 'fod', last_name = 'bart', bool_test = true",
                "user_id = 2 AND password = 'pwd'",
            ],
        });
    });

    it("returns prepared statement without WHERE given table and updates", () => {
        const table = "sessions";
        const updates = {
            start_time: 3408539567,
            end_time: 948534534,
            amended: true,
            str_test: "blah blah blah",
        };

        const update = updateBuilder(table, updates);

        expect(update).to.be.deep.equal({
            query: "UPDATE ? SET ?",
            params: [
                "sessions",
                "start_time = 3408539567, end_time = 948534534, amended = true, str_test = 'blah blah blah'",
            ],
        });
    });
});