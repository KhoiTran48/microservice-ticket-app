import { CustomError } from './custom-error'

export class NotAuthorizedError extends CustomError {
    errors = [{message: 'Not authorized', field: ''}]
    statusCode = 401
}
