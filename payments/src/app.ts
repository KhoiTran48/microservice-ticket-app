import express from 'express'
import {json} from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { NotFoundError, errorHandler, currentUser } from '@kt_tickets/common'

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

app.use(currentUser)

// cái error này sẽ không chạy vào error-handler, chưa biết tại sao
// vì use errorHandler không đúng chỗ, ta phải để nó sau tất cả các route
app.all('*', async (req, res, next) => {
    throw new NotFoundError()
    // next(new Error('error ne'))
})

app.use(errorHandler);

export { app }
