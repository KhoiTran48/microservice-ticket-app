export abstract class CustomError extends Error
{
    abstract errors: {message: string, field: string}[]
    abstract statusCode: number
    constructor(){
        super()
        Object.setPrototypeOf(this, CustomError.prototype)
    }
}