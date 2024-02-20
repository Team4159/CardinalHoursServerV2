import Cell from "./cell";
import { RangeNotFound } from "../utils/errors";
import { getSheets } from "./sheets";

async function readCell(spreadsheetId: string, sheetName: string, cell: Cell): Promise<string> {
    const sheets = await getSheets();
    const range = `${sheetName}!${cell.column}${cell.row}`
    const cells = (await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        majorDimension: "ROWS",
    })).data.values;

    if (!cells) {
        throw new RangeNotFound("No cells found in range", range);
    }

    return cells[0][0];
}

async function readCellRange(spreadsheetId: string, sheetName: string, cell1: Cell, cell2: Cell): Promise<string[][]> {
    const sheets = await getSheets();
    const range = `${sheetName}!${cell1.column}${cell1.row}:${cell2.column}${cell2.row}`
    const cells = (await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range,
        majorDimension: "ROWS",
    })).data.values;

    if (!cells) {
        throw new RangeNotFound("No cells found in range", range);
    }

    return cells;
}

export {
    readCell,
    readCellRange,
}