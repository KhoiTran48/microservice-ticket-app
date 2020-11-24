import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  errors = [{message: 'Route not found', field: ''}]
  statusCode = 404
}
