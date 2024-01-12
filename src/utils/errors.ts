class RowNotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}

class InvalidTimeError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, InvalidTimeError.prototype);
    }
}
