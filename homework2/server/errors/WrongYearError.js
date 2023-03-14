module.exports = class WrongYearError extends Error {
    constructor(message) {
        super(message);
        this.name = "WrongYearError";
    }
}
