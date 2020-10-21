import express from 'express'
import {json} from 'body-parser'
import 'express-async-errors'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import currentUserRouter from './routes/current-user'
import signinRouter from './routes/signin'
import signoutRouter from './routes/signout'
import signupRouter from './routes/signup'
import { errorHandler } from './middlewares/error-handler'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        // no encrypt cookie
        signed: false,
        // only be used via HTTPS connection
        secure: true
    })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)
app.use(errorHandler)

// cái error này sẽ không chạy vào error-handler, chưa biết tại sao
app.all('*', async (req, res, next) => {
    throw new Error('error ne')
    // next(new Error('error ne'))
})

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('connect db')
    } catch (err) {
        console.error(err)
    }

    app.listen(3000, () => {
        console.log('Listening on port 3000!')
    })
}

start()

