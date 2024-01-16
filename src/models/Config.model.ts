import { ResultSetHeader, RowDataPacket } from "mysql2";

import database from "../database";
import { RowNotFoundError } from "../utils/errors";

interface Config {
    name: string;
    value: string;
}

interface ConfigRowDataPacket extends Config, RowDataPacket {}

async function getAllConfigs(): Promise<Config[]> {
    const sql = "SELECT * FROM `configs`";
    const [configs] = await database.query<ConfigRowDataPacket[]>(sql);

    return configs;
}

async function getConfigByName(name: string): Promise<Config> {
    const sql = "SELECT * FROM `configs` WHERE name = ?";
    const [configs] = await database.query<ConfigRowDataPacket[]>(sql, [name]);

    if (configs.length < 1) {
        throw new RowNotFoundError("Config not found in table: configs!");
    }

    return configs[0];
}

async function createConfigs(
    newConfigs: { name: string; value: string }[]
): Promise<Config[]> {
    const sql =
        "INSERT INTO `configs` (name, value) VALUES ? RETURNING name, value";
    const params = newConfigs.map((newConfig) => [
        newConfig.name,
        newConfig.value,
    ]);
    const [configs] = await database.query<ConfigRowDataPacket[]>(sql, [
        params,
    ]);

    return configs;
}

async function createConfig(name: string, value: string): Promise<Config> {
    const sql =
        "INSERT INTO `configs` (name, value) VALUES (?, ?) RETURNING name, value";
    const [configs] = await database.query<ConfigRowDataPacket[]>(sql, [
        name,
        value,
    ]);

    return configs[0];
}

async function updateConfig(name: string, newValue: string): Promise<boolean> {
    const sql = "UPDATE `configs` SET value = ? WHERE name = ?";
    const [resHeader] = await database.query<ResultSetHeader>(sql, [
        newValue,
        name,
    ]);

    return resHeader.affectedRows > 0;
}

async function deleteConfig(name: string): Promise<Config> {
    const sql = "DELETE FROM `configs` WHERE name = ? RETURNING name, value";
    const [configs] = await database.query<ConfigRowDataPacket[]>(sql, [name]);

    return configs[0];
}

export default Config;
export {
    getAllConfigs,
    getConfigByName,
    createConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
};
