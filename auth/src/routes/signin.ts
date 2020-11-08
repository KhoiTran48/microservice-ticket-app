import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@kt_tickets/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import User from '../models/user'
import { Password } from '../services/password';

const signinRouter = express.Router()

signinRouter.post('/api/users/signin', 
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('You must supply a password')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        
        const {email, password} = req.body
        const existingUser = await User.findOne({email})
        if(!existingUser){
            throw new BadRequestError('Invalid credentials')
        }

        const isPasswordMatch = await Password.compare(existingUser.password, password)
        if(!isPasswordMatch){
            throw new BadRequestError('Invalid credentials')
        }
        
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!)

        req.session = { jwt: userJwt }

        res.status(200).send(existingUser)
    }
)

export default signinRouter; 
