function updateBuilder(table: string, updates: { [key: string]: any }, conditions?: { [key: string]: any }) {
    let updateList: string[] = [];
    Object.entries(updates).map((keyValue) => {
        updateList.push(`${keyValue[0]} = ` + (typeof keyValue[1] === "string" ? `'${keyValue[1]}'` : keyValue[1]));
    });

    let conditionList: string[] = [];
    if (conditions) {
        Object.entries(conditions).map((keyValue) => {
            conditionList.push(`${keyValue[0]} = ` + (typeof keyValue[1] === "string" ? `'${keyValue[1]}'` : keyValue[1]));
        });
    }

    let query = "UPDATE ? SET ?"
    let params = [
        table,
        updateList.join(", "),
    ];

    if (conditionList.length > 0) {
        query += " WHERE ?"
        params.push(conditionList.join(" AND "));
    }

    return {
        query,
        params,
    };
}

export default updateBuilder;