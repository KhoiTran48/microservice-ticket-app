import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError
} from '@kt_tickets/common'
import Ticket from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'

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
    new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId
    })
    
    res.send(ticket)
})

export default updateTicketRouter
