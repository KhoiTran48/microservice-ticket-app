import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'

const createTicket = async () => {
    let ticket = Ticket.build({
        title: 'concert',
        price: 20
    })

    await ticket.save()
    
    return ticket
}

test('fetches orders for an particular user', async () => {

    // create 3 tickets
    let ticketOne = await createTicket()
    let ticketTwo = await createTicket()
    let ticketThree = await createTicket()

    // create 2 users
    let sessUserOne = global.signin()
    let sessUserTwo = global.signin()

    // create 1 order for user 1
    const { body: orderOne} = await request(app)
        .post('/api/orders')
        .set('Cookie', sessUserOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    // create 2 order for user 2
    const { body: orderTwo} = await request(app)
        .post('/api/orders')
        .set('Cookie', sessUserTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201)

    const { body: orderThree} = await request(app)
        .post('/api/orders')
        .set('Cookie', sessUserTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201)

    // fetch order for user 2
    const { body: orders } = await request(app)
        .get('/api/orders')
        .set('Cookie', sessUserTwo)
        .expect(200)

    // compare
    expect(orders.length).toEqual(2)
    expect(orders[0].id).toEqual(orderTwo.id)
    expect(orders[1].id).toEqual(orderThree.id)
    expect(orders[0].ticket.id).toEqual(ticketTwo.id)
    expect(orders[1].ticket.id).toEqual(ticketThree.id)

})

