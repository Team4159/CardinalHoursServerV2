class RowNotFoundError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, RowNotFoundError.prototype);
    }
}