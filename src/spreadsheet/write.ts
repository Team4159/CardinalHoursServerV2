import { Cell, CellValue, CellRange, getUserEnteredValue, letterToColumn, parseCells } from "./cell";
import { getSheets } from "./sheets";

async function writeCell(spreadsheetId: string, sheetId: number, cell: Cell, data: CellValue) {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    updateCells: {
                        rows: [
                            {
                                values: [
                                    {
                                        userEnteredValue: getUserEnteredValue(data),
                                    }
                                ]
                            }
                        ],
                        start: {
                            sheetId,
                            rowIndex: cell.row - 1, // Since first row starts at 0
                            columnIndex: letterToColumn(cell.column),
                        },
                        fields: "*",
                    }
                }
            ]
        }
    });

    return response;
}

async function writeCellRange(spreadsheetId: string, sheetId: number, range: CellRange, data: CellValue[][]) {
    const sheets = await getSheets();
    const response = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
            requests: [
                {
                    updateCells: {
                        rows: parseCells(data),
                        range: {
                            sheetId,
                            startRowIndex: range.start.row - 1, // Since first row starts at 0
                            startColumnIndex: letterToColumn(range.start.column),
                            endRowIndex: range.end ? range.end.row : undefined, // If range.end exists
                            endColumnIndex: range.end ? letterToColumn(range.end.column + 1) : undefined,
                        },
                        fields: "*",
                    }
                }
            ]
        }
    });

    return response;
}

export {
    writeCell,
    writeCellRange
}