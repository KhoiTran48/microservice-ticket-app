import { Publisher, OrderCancelledEvent, Subjects } from "@kt_tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}
