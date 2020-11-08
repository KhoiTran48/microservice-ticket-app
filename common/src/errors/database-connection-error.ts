import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError
{
    errors = [{message: 'Error connecting to database', field: 'database'}]
    statusCode = 500
}