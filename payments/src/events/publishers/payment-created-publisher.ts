import { Publisher, PaymentCreatedEvent, Subjects } from "@kt_tickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}
