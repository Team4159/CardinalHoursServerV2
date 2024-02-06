import { ResultSetHeader, RowDataPacket } from "mysql2";

import db, { tableSuffix } from "../database";
import { RowNotFoundError } from "../utils/errors";

const configsTableName = "configs" + tableSuffix;

interface Config {
    name: string;
    value: string;
}

interface ConfigRowDataPacket extends Config, RowDataPacket {}

async function getAllConfigs(): Promise<Config[]> {
    const sql = `SELECT * FROM ${configsTableName}`;
    const [configs] = await db.query<ConfigRowDataPacket[]>(sql);

    return configs;
}

async function getConfigByName(name: string): Promise<Config> {
    const sql = `SELECT * FROM ${configsTableName} WHERE name = ?`;
    const [configs] = await db.query<ConfigRowDataPacket[]>(sql, [name]);

    if (configs.length < 1) {
        throw new RowNotFoundError(`Config not found in table: ${configsTableName}!`);
    }

    return configs[0];
}

async function createConfigs(
    newConfigs: Config[]
): Promise<Config[]> {
    const sql =
        `INSERT INTO ${configsTableName} (name, value) VALUES ? RETURNING name, value`;
    const params = newConfigs.map((newConfig) => [
        newConfig.name,
        newConfig.value,
    ]);
    const [configs] = await db.query<ConfigRowDataPacket[]>(sql, [
        params,
    ]);

    return configs;
}

async function createConfig(name: string, value: string): Promise<Config> {
    const sql =
        `INSERT INTO ${configsTableName} (name, value) VALUES (?, ?) RETURNING name, value`;
    const [configs] = await db.query<ConfigRowDataPacket[]>(sql, [
        name,
        value,
    ]);

    return configs[0];
}

async function updateConfig(name: string, newValue: string): Promise<boolean> {
    const sql = `UPDATE ${configsTableName} SET value = ? WHERE name = ?`;
    const [resHeader] = await db.query<ResultSetHeader>(sql, [
        newValue,
        name,
    ]);

    return resHeader.affectedRows > 0;
}

async function deleteConfigByName(name: string): Promise<Config> {
    const sql = `DELETE FROM ${configsTableName} WHERE name = ? RETURNING name, value`;
    const [configs] = await db.query<ConfigRowDataPacket[]>(sql, [name]);

    return configs[0];
}

export default Config;
export {
    getAllConfigs,
    getConfigByName,
    createConfigs,
    createConfig,
    updateConfig,
    deleteConfigByName,
};
