class CustomError extends Error {
    readonly statusCode: number | undefined;

    constructor(msg: string, statusCode?: number) {
        super(msg);
        Object.setPrototypeOf(this, CustomError.prototype);
        
        this.statusCode = statusCode;
    }
}

class RowNotFoundError extends CustomError {
    constructor(msg: string, statusCode?: number) {
        super(msg, statusCode);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}

class InvalidTimeError extends CustomError {
    constructor(msg: string, statusCode?: number) {
        super(msg, statusCode);
        Object.setPrototypeOf(this, InvalidTimeError.prototype);
    }
}

export {
    CustomError,
    RowNotFoundError,
    InvalidTimeError,
}