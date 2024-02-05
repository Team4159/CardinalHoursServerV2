function updateBuilder(table: string, updates: { [key: string]: any }, conditions?: { [key: string]: any }) {
    let updateKeyList: string[] = [];
    let updateValueList: string[] = [];
    Object.entries(updates).map((keyValue) => {
        updateKeyList.push(`${keyValue[0]} = ?`);
        updateValueList.push(keyValue[1])
    });

    let conditionKeyList: string[] = [];
    let conditionValueList: string[] = [];
    if (conditions) {
        Object.entries(conditions).map((keyValue) => {
            conditionKeyList.push(`${keyValue[0]} = ?`);
            conditionValueList.push(keyValue[1])
        });
    }

    let query = `UPDATE \`${table}\` SET ` + updateKeyList.join(", ");
    let params = [...updateValueList];

    if (conditionKeyList.length > 0) {
        query += " WHERE " + conditionKeyList.join(" AND ");
        params.push(...conditionValueList);
    }

    return {
        query,
        params,
    };
}

export default updateBuilder;
