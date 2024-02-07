import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { auth, sheets } from "@googleapis/sheets";
import {
    OAuth2Client,
} from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "secrets", "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "secrets", "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
    try {
        const content = await fs.readFile(TOKEN_PATH, "utf-8");
        const credentials = JSON.parse(content);
        return auth.fromJSON(credentials) as OAuth2Client;
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: OAuth2Client) {
    const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize(): Promise<OAuth2Client> {
    let client: OAuth2Client | null =
        await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await auth.getClient({
        scopes: SCOPES,
        keyFile: CREDENTIALS_PATH,
    }) as OAuth2Client;
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

async function getSheets() {
    const auth = await authorize();
    return sheets({ version: "v4", auth });
}

export {
    getSheets,
}