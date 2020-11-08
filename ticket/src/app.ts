import express from 'express'
import {json} from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        // no encrypt cookie
        signed: false,
        // only be used via HTTPS connection
        // secure: process.env.NODE_ENV !== 'test'
    })
)

// cái error này sẽ không chạy vào error-handler, chưa biết tại sao
app.all('*', async (req, res, next) => {
    throw new Error('error ne')
    // next(new Error('error ne'))
})

export { app }
