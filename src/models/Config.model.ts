import { RowDataPacket } from "mysql2";

import database from "../database";

interface Config extends RowDataPacket {
    name: string,
    value: string,
}

async function getAllConfigs(): Promise<Config[]> {
    const sql = "SELECT * FROM `configs`";
    const [ configs ] = await database.query<Config[]>(sql);

    return configs;
}

async function getConfigByName(name: string): Promise<Config> {
    const sql = "SELECT * FROM `configs` WHERE name = ?"
    const [ configs ] = await database.query<Config[]>(sql, [ name ]);

    if (configs.length < 1) {
        throw new RowNotFoundError(`Row of name: ${name} not found in table: configs`);
    }

    return configs[0];
}

async function createConfigs(newConfigs: { name: string, value: string }[]): Promise<Config[]> {
    const sql = "INSERT INTO `configs` (name, value) VALUES ? RETURNING name, value";
    const params = newConfigs.map(newConfig => [ newConfig.name, newConfig.value ]);
    const [ configs ]  = await database.query<Config[]>(sql, [ params ]);
    
    return configs;
}

async function createConfig(name: string, value: string): Promise<Config> {
    const sql = "INSERT INTO `configs` (name, value) VALUES (?, ?) RETURNING name, value";
    const [ configs ]  = await database.query<Config[]>(sql, [ name, value ]);

    return configs[0];
}

async function updateConfigs(updatedConfigs: { name: string, value: string }[]): Promise<void> {
    const sql = "INSERT INTO `config` (name, value) VALUES ? ON DUPLICATE KEY UPDATE value = VALUES (value)";
    const params = updatedConfigs.map(updatedConfig => [ updatedConfig.name, updatedConfig.value ]);
    await database.query<Config[]>(sql, [ params ]);
}

async function updateConfig(name: string, newValue: string): Promise<void> {
    const sql = "UPDATE `configs` SET value = ? WHERE name = ?";
    await database.query<Config[]>(sql, [ newValue, name ]);
}

async function deleteAllConfigs(): Promise<void> {
    const sql = "TRUNCATE `configs`";
    await database.query(sql);
} 

async function deleteConfig(name: string): Promise<void> {
    const sql = "DELETE FROM `configs` WHERE name = ?";
    await database.query(sql, [ name ]);
}

export default Config;
export {
    getAllConfigs,
    getConfigByName,
    createConfigs,
    createConfig,
    updateConfigs,
    updateConfig,
    deleteAllConfigs,
    deleteConfig,
}