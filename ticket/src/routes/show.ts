import express, {Request, Response} from 'express'
import Ticket from '../models/ticket'
import { NotFoundError } from '@kt_tickets/common'

const showTicketRouter = express.Router()

showTicketRouter.get('/api/tickets/:id', async (req: Request, res: Response)=>{
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        throw new NotFoundError()
    }
    res.send(ticket)
})

export default showTicketRouter
