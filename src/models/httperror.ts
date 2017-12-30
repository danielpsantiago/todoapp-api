export default class HTTPError {
    public message: string;
    public statusCode?: number;
    public stack?: string;

    constructor(message: string, statusCode?: number, stack?: string) {
        this.message = message;
        this.statusCode = statusCode;
        if (stack) { this.stack = stack; }
    }
}