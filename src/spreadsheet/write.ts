import Cell, { CellValue, getEffectiveValue, letterToColumn } from "./cell";
import { getSheets } from "./sheets";

async function writeCell<T extends CellValue>(spreadsheetId: string, sheetId: number, cell: Cell, data: T) {
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
                                        effectiveValue: getEffectiveValue(data),
                                    }
                                ]
                            }
                        ],
                        range: {
                            sheetId,
                            startRowIndex: cell.row,
                            startColumnIndex: letterToColumn(cell.column),
                        }
                    }
                }
            ]
        }
    });
}

// TODO: ADD WRITE CELL RANGE

export {
    writeCell,
}