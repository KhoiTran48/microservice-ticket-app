import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

test('mark an order as cancelled', async () => {
    const ticket = await Ticket.build({
        title: 'concert',
        price: 20
    }).save()

    const sessUser = global.signin()

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', sessUser)
        .send({ ticketId: ticket.id})
        .expect(201)
    
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', sessUser)
        .send()
        .expect(204)
    
    const updatedOrder = await Order.findById(order.id)

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

test.todo('emit an cancelled order event')
