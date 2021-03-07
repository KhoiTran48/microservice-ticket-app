import { stripe } from './../../stripe';
import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order'

jest.mock('../../stripe')

test('return 404 if order is not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'token_ne',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})

test('return 401 if order is not belong to logged in user', async () => {

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Created,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({
            token: 'token_ne',
            orderId: order.id
        })
        .expect(401)
})

test('return 400 if order is cancelled', async () => {

    const userId = mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 20,
        status: OrderStatus.Cancelled,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'token_ne',
            orderId: order.id
        })
        .expect(400)
})

test('return 204 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId,
        price: 20,
        status: OrderStatus.Created,
    })
    await order.save()

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201)
    
    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(20*100)
    expect(chargeOptions.currency).toEqual('usd')

})
