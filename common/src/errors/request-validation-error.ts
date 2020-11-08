import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError
{
    errors: {message: string, field: string}[]
    statusCode = 400

    constructor( errors: ValidationError[]) {
        super()
        this.errors = errors.map((err) => {
            return {message: err.msg, field: err.param}
        })
    }
}