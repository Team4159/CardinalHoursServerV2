import fs from "fs/promises";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google, sheets_v4 } from "googleapis";
import { SheetNotFound } from "../utils/errors";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user"s access and refresh tokens, and is
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
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: any) {
    const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload, { encoding: "utf-8" });
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
    let client: any = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
}

async function getSheets(): Promise<sheets_v4.Sheets> {
    const auth = await authorize();
    return google.sheets({ version: "v4", auth });
}

async function getSheetNameById(spreadsheetId: string, sheetId: number): Promise<string> {
    const sheets = await getSheets();
    const data = (await sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: false,
    })).data;

    let sheetName;
    for (let i = 0; i < data.sheets!.length; i++) {
        if (data.sheets![i].properties!.sheetId! === sheetId) {
            return data.sheets![i].properties!.title!;
        }
    }

    throw new SheetNotFound("Sheet ID not found", spreadsheetId, sheetId);
}

export {
    getSheets,
    getSheetNameById,
}