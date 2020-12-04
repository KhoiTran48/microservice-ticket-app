import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError
} from '@kt_tickets/common'
import Ticket from '../models/ticket'

const updateTicketRouter = express.Router()
updateTicketRouter.put(
    '/api/tickets/:id', 
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price').isFloat({ gt: 0}).withMessage('Price must be provided and must be greater than 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        throw new NotFoundError()
    }

    if (ticket.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    ticket.set({ 
        title: req.body.title,
        price: req.body.price
    })
    ticket.save()
    
    res.send(ticket)
})

export default updateTicketRouter
