import { Cell, CellRangeBounded } from "./cell";
import { RangeNotFound } from "../utils/errors";
import { getSheetNameById, getSheets } from "./sheets";

async function readCell(spreadsheetId: string, sheetId: number, cell: Cell): Promise<string> {
    const sheets = await getSheets();
    const range = `${await getSheetNameById(spreadsheetId, sheetId)}!${cell.column}${cell.row}`
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

async function readCellRange(spreadsheetId: string, sheetId: number, range: CellRangeBounded): Promise<string[][]> {
    const sheets = await getSheets();
    const rangeString = `${await getSheetNameById(spreadsheetId, sheetId)}!${range.start.column}${range.start.row}:${range.end.column}${range.end.row}`
    const cells = (await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: rangeString,
        majorDimension: "ROWS",
    })).data.values;

    if (!cells) {
        throw new RangeNotFound("No cells found in range", rangeString);
    }

    return cells;
}

export {
    readCell,
    readCellRange,
}