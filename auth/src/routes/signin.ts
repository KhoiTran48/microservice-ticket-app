import { validateRequest } from './../middlewares/validate-request';
import express, { Request, Response } from 'express'
import { body } from 'express-validator'

const signinRouter = express.Router()

signinRouter.post('/api/users/signin', 
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must supply a password')
    ],
    validateRequest,
    (req: Request, res: Response) => {
        res.send('Hi there!')
    }
)

export default signinRouter; 
