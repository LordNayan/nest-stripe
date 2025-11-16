export class SuccessResponse<T = any> {
    success: true;
    data: T;
    message?: string;

    constructor(data: T, message?: string) {
        this.success = true;
        this.data = data;
        if (message) this.message = message;
    }
}

export class ErrorResponse {
    success: false;
    error: string;
    details?: any;

    constructor(error: string, details?: any) {
        this.success = false;
        this.error = error;
        if (details) this.details = details;
    }
}
