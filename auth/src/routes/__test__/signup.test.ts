import request from 'supertest'
import { app } from '../../app'

test('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

test('returns a 400 with an invalid email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test',
            password: 'password'
        })
        .expect(400)
})

test('returns a 400 with an invalid password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'p'
        })
        .expect(400)
})

test('returns a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password'
        })
        .expect(400)
    
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400)
    await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

test('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    
        await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)
})

test('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
    
    expect(response.get('Set-Cookie')).toBeDefined()
})
