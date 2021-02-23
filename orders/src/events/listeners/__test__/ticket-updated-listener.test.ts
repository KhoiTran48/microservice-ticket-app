import { TicketUpdatedEvent } from "@kt_tickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {
    // create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    // create and save a ticket
    const ticket = await Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    }).save()
    
    // create a fake data event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: 1,
        title: 'concert update',
        price: 10,
        userId: mongoose.Types.ObjectId().toHexString(),
    }

    // create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg}
}

test('create, find and update a ticket', async () => {
    const { listener, data, msg} = await setup()

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id)

    expect(ticket).toBeDefined()
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
    expect(ticket!.version).toEqual(data.version)
})

test('ack the message', async () => {
    const { listener, data, msg} = await setup()

    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg)

    // write assertions to make sure ack function is called
    expect(msg.ack).toHaveBeenCalled()
})

test('not call ack if event has a skipped version number', async () => {
    const { listener, data, msg} = await setup()
    data.version = 10
    
    try {
        await listener.onMessage(data, msg)
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled()
})
