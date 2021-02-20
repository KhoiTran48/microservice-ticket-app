import { Publisher, OrderCreatedEvent, Subjects } from "@kt_tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}
