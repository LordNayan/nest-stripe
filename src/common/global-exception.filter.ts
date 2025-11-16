import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from './response';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let errorMessage = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                errorMessage = res;
            } else if (typeof res === 'object' && res !== null) {
                errorMessage = (res as any).message || errorMessage;
            }
        } else if (exception instanceof Error) {
            errorMessage = exception.message;
        }

        response.status(status).json(
            new ErrorResponse(errorMessage)
        );
    }
}
