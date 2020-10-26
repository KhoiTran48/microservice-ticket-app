import express from 'express'
import {json} from 'body-parser'
import 'express-async-errors'
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
        secure: process.env.NODE_ENV !== 'test'
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

export { app }
