import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import Ticket from '../../models/ticket'

test('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Title ne',
            price: 10
        })
        .expect(404)
})

test('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()

    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'Title ne',
            price: 10
        })
        .expect(401)
})

test('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'Title nek',
            price: 20
        })

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'Not own ticket',
            price: 20
        })
        .expect(401)
})

test('returns a 400 if the user provided an invalid title or price', async () => {
    await request(app)
        .put(`/api/tickets/${mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 20
        })
        .expect(400)
    
    await request(app)
        .put(`/api/tickets/${mongoose.Types.ObjectId().toHexString()}`)
        .set('Cookie', global.signin())
        .send({
            title: 'valid title',
            price: -20
        })
        .expect(400)
})

test('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title nek',
            price: 20
        })
    
    const updateTitle = 'Title update'
    const updatePrice = 50
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: updateTitle,
            price: updatePrice
        })
        .expect(200)
    
    const ticket = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send()
    
    expect(ticket.body.title).toEqual(updateTitle)
    expect(ticket.body.price).toEqual(updatePrice)
})

test('publishes an event', async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title nek',
            price: 20
        })
    
    const updateTitle = 'Title update'
    const updatePrice = 50
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: updateTitle,
            price: updatePrice
        })
        .expect(200)
    
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

test('reject updating if ticket is reserved', async () => {
    const cookie = global.signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'Title nek',
            price: 20
        })
    
    const ticket = await Ticket.findById(response.body.id)
    ticket!.set({orderId: mongoose.Types.ObjectId().toHexString})
    await ticket!.save()
    
    const updateTitle = 'Title update'
    const updatePrice = 50
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: updateTitle,
            price: updatePrice
        })
        .expect(400)
})
