import { Publisher, Subjects, ExpirationCompleteEvent } from "@kt_tickets/common";


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
}
