import { sheets_v4 } from "googleapis";

type CellValue = number | string | boolean;

class Cell {
    readonly column: string;
    readonly row: number;

    constructor(column: string, row: number) {
        this.column = column;
        this.row = row;
    }
}

class CellRange {
    readonly start: Cell;
    readonly end?: Cell;

    constructor(start: Cell, end?: Cell) {
        this.start = start;
        this.end = end;
    }
}

class CellRangeBounded extends CellRange {
    override readonly end: Cell;

    constructor(start: Cell, end: Cell) {
        super(start, end);

        this.end = end;
    }
}

function getUserEnteredValue(data: CellValue): sheets_v4.Schema$ExtendedValue {
    let effectiveValue: sheets_v4.Schema$ExtendedValue;

    switch (typeof data) {
        case "number":
            effectiveValue = {
                numberValue: data
            };
            break;
        case "string":
            effectiveValue = {
                stringValue: data
            };
            break;
        case "boolean":
            effectiveValue = {
                boolValue: data
            };
            break;
        default:
            throw new TypeError("Data is not number, string, or boolean!");
    }

    return effectiveValue;
}

function parseCells(data: CellValue[][]): sheets_v4.Schema$RowData[] { // TODO: Make more clear
    let cells: sheets_v4.Schema$RowData[] = [];

    data.forEach((row) => {
        cells.push({
            values: row.map((value): sheets_v4.Schema$CellData => {
                return {
                    userEnteredValue: getUserEnteredValue(value),
                };
            }),
        });
    });

    return cells;
}

// https://stackoverflow.com/a/21231012
function columnToLetter(column: number): string {
    column++;

    var temp,
        letter = "";
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }

    return letter;
}

// https://stackoverflow.com/a/21231012
function letterToColumn(letter: string): number {
    var column = 0,
        length = letter.length;
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return --column;
}

export {
    Cell,
    CellValue,
    CellRange,
    CellRangeBounded,
    getUserEnteredValue,
    parseCells,
    columnToLetter,
    letterToColumn,
}