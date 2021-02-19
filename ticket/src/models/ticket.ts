import mongoose from 'mongoose'

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
})

ticketSchema.methods.toJSON = function(){
    const ticket = this
    const ticketObject = ticket.toObject()
    ticketObject.id = ticket._id
    
    delete ticketObject.__v
    delete ticketObject._id
    return ticketObject
}


ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)

export default Ticket