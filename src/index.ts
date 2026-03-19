import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import routes from './routes'

dotenv.config()
const app = express()

// middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded())

// database
const URI = process.env.MONGODB_URL || ''
mongoose
	.connect(URI, { autoIndex: false })
	.then(() => {
		console.log('Mongodb connection.')
	})
	.catch((err) => {
		console.error(err)
	})

// routes
app.use('/api', routes)

// server
const port = process.env.PORT || 5001

app.listen(port, () => {
	console.log(`Server on port ${port}`)
})
