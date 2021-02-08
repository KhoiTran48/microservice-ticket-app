import { Publisher, Subjects, TicketCreatedEvent } from "@kt_tickets/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}
