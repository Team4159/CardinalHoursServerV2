import { sheets_v4 } from "@googleapis/sheets";

type CellValue = number | string | boolean;

class Cell {
    readonly column: string;
    readonly row: number;

    constructor(column: string, row: number) {
        this.column = column;
        this.row = row;
    }
}

function getEffectiveValue<T extends CellValue>(data: T): sheets_v4.Schema$ExtendedValue {
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
            throw new Error();
    }

    return effectiveValue;
}

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

function letterToColumn(letter: string): number {
    var column = 0,
        length = letter.length;
    for (var i = 0; i < length; i++) {
        column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return --column;
}

export default Cell;
export {
    CellValue,
    getEffectiveValue,
    columnToLetter,
    letterToColumn,
}