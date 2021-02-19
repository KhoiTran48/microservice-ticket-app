import express, { Request, Response } from 'express'
import { NotFoundError, requireAuth, validateRequest, NotAuthorizedError, BadRequestError } from '@kt_tickets/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Order } from '../models/order'

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, 
// [
//     body('orderId')
//         .not()
// 		.isEmpty()
// 		.custom((orderId: string) => mongoose.Types.ObjectId.isValid(orderId)) // check if orderId is instance of mongo id
// 		.withMessage('orderId must be provided')
// ], 
// validateRequest,
async (req: Request, res: Response) => {

    const order = await Order.findById(req.params.orderId).populate('ticket')
    
    if (!order) {
        throw new NotFoundError()
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }

    res.send(order);
});

export { router as showOrderRouter };
