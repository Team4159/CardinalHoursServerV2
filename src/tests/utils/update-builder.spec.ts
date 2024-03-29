import { expect } from "chai";

import updateBuilder from "../../utils/update-builder";

describe("SQL Update Query Builder", () => {
    it("returns full prepared statement given table, updates, and conditions", () => {
        const table = "users";
        const updates = {
            first_name: "fod",
            last_name: "bart",
            bool_test: true,
            num_test: 12345,
        };
        const conditions = {
            user_id: 2,
            password: "pwd",
        };

        const update = updateBuilder(table, updates, conditions);

        expect(update).to.be.deep.equal({
            query: "UPDATE `users` SET first_name = ?, last_name = ?, bool_test = ?, num_test = ? WHERE user_id = ? AND password = ?",
            params: [
                "fod",
                "bart",
                true,
                12345,
                2,
                "pwd",
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
            query: "UPDATE `sessions` SET start_time = ?, end_time = ?, amended = ?, str_test = ?",
            params: [
                3408539567,
                948534534,
                true,
                "blah blah blah",
            ],
        });
    });
});
