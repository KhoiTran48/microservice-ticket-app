import { Subjects } from './subjects';
import { Listener } from './base-listener'
import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent } from './ticket-created-event'


export class TicketCreatedListener extends Listener<TicketCreatedEvent>
{
    readonly  subject = Subjects.TicketCreated
    queueGroupName = 'payments-service'

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data: ', data)
        // console.log(data.noExistProperty)
        msg.ack()
    }
}