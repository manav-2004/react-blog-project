import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.middleware.js'

const app = express()

app.use(express.json({
    limit : '16kb'
}))

app.use(express.urlencoded({
    extended : true,
    limit : '16kb'
}))

app.use(express.static('public'))

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))

app.use(cookieParser())


//routes handling

import userRoutes from './routes/user.routes.js'
import blogRoutes from './routes/blog.routes.js'

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/blog',blogRoutes)
app.use(errorHandler)

export {
    app
}
