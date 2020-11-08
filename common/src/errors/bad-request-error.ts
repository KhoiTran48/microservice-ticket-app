import { CustomError } from './custom-error'

export class BadRequestError extends CustomError
{
    errors = [{message: '', field: ''}]
    statusCode = 400

    constructor( message: string) {
        super()
        this.errors = [{message: message, field: ''}]
    }
}