require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Sequelize = require('sequelize')
const app = express()
const {SERVER_PORT} = process.env

app.use(express.json())
app.use(cors())

const {seed, userLogin, userSignup} = require('./controllers/auth')
//
// app.post('/seed', seed)
app.post('/api/login',userLogin)
app.post('/api/signUp',userSignup)


app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}`))