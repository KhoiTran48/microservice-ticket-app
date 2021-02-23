import { OrderCreatedEvent, OrderStatus } from '@kt_tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from './../order-created-listener';

const setup = async () => {
    // create listener
    const listener = new OrderCreatedListener(natsWrapper.client)

    // create ticket
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20,
        userId: mongoose.Types.ObjectId().toHexString()
    }).save()

    // create data object
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: "randomText",
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    }

    // create msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket}
}

test('set orderId for ticket', async () => {
    const { listener, data, msg, ticket} = await setup()

    await listener.onMessage(data, msg)

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
})

test('ack the message', async () => {
    const { listener, data, msg, ticket} = await setup()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})

