import { queueGroupName } from './queue-group-name';
import { Subjects, Listener, TicketCreatedEvent } from '@kt_tickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    queueGroupName = queueGroupName

    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data
        await Ticket.build({ id, title, price }).save()
        msg.ack()
    }
}
