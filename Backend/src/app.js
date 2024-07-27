import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

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
    origin : process.env.ORIGIN,
    credentials : true
}))

app.use(cookieParser())


//routes handling

import userRoutes from './routes/user.routes.js'
import blogRoutes from './routes/blog.routes.js'

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/blog',blogRoutes)


export {
    app
}
