class ExceptionHandler extends Error {
    public status: number;
    public code: string;

    constructor(status: number, code?: string) {
        super();
        this.status = status;
        this.code = code;
    }
}

export default ExceptionHandler;
