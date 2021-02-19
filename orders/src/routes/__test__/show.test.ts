import request from 'supertest'
import { Ticket } from '../../models/ticket'
import { app } from '../../app'

test('fetch order of user successfully', async () => {
    const ticket = await Ticket.build({title: 'concert', price: 20}).save()
    const sessUser = global.signin()
    
    const { body: newOrder } = await request(app)
        .post('/api/orders')
        .set('Cookie', sessUser)
        .send({ticketId: ticket.id})
        .expect(201)
    
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${newOrder.id}`)
        .set('Cookie', sessUser)
        .send()
        .expect(200)
    expect(newOrder.id).toEqual(fetchedOrder.id)
})

test('return error if user try to access order of other user', async () => {
    const ticket = await Ticket.build({title: 'concert', price: 20}).save()
    const sessUser = global.signin()
    
    const { body: newOrder } = await request(app)
        .post('/api/orders')
        .set('Cookie', sessUser)
        .send({ticketId: ticket.id})
        .expect(201)
    
    await request(app)
        .get(`/api/orders/${newOrder.id}`)
        .set('Cookie', global.signin())
        .send()
        .expect(401)
})