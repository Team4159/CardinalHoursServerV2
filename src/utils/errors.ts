abstract class CustomError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}

class RowNotFoundError extends CustomError {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}

class InvalidTimeError extends CustomError {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, InvalidTimeError.prototype);
    }
}

class RangeNotFound extends CustomError {
    readonly range: string;

    constructor(msg: string, range: string) {
        super(msg);
        Object.setPrototypeOf(this, RangeNotFound.prototype);

        this.range = range;
    }
}

class SheetNotFound extends CustomError {
    readonly spreadsheetId: string;
    readonly sheetId: number;

    constructor(msg: string, spreadsheetId: string, sheetId: number) {
        super(msg);
        Object.setPrototypeOf(this, SheetNotFound.prototype);

        this.spreadsheetId = spreadsheetId;
        this.sheetId = sheetId;
    }
}

export {
    CustomError,
    RowNotFoundError,
    InvalidTimeError,
    RangeNotFound,
    SheetNotFound,
}