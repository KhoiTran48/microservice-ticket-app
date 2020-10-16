import express from 'express'
import {json} from 'body-parser'

import { errorHandler } from './middlewares/error-handler'

const app = express()
app.use(json())
app.use(errorHandler)

// cái error này sẽ không chạy vào error-handler, chưa biết tại sao
app.all('*', () => {
    throw new Error('error ne')
})

app.listen(3000, () => {
    console.log('Listening on port 3000!')
})
