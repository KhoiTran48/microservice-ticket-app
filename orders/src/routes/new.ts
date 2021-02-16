import { requireAuth, validateRequest } from '@kt_tickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator'
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((ticketId: string) => mongoose.Types.ObjectId.isValid(ticketId)) // check if ticketId is instance of mongo id
    .withMessage('TicketId must be provided')
],
validateRequest 
,async (req: Request, res: Response) => {
  res.send({});
});

export { router as newOrderRouter };
