require('dotenv').config()
const path = require("path");
const express = require('express')
const cors = require('cors')
const Sequelize = require('sequelize')
const app = express()
const {SERVER_PORT} = process.env

app.use(express.json())
app.use(cors())
app.use("/views", express.static(path.join(__dirname,"./views")))
app.set("views", path.join(__dirname, "views"));

//middleware
const {seed, userLogin, userSignup} = require('./controllers/auth')
const {createEntry, getEntries, deleteEntry, updateEntry,getEntry} = require('./controllers/prompt');


// app.post('/seed', seed)
app.post('/api/login',userLogin)
app.post('/api/signUp',userSignup)


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,"./views/index.html"))
})
app.get('/entryPage', (req,res) => {
    res.sendFile(path.join(__dirname,"./views/entryPage.html"))
})

//server response with the corresponding userID passed in the param
app.get('/entry/get/:userID', getEntries)
app.post('/entry/create',createEntry)
app.put('/entry/update/:entryID',updateEntry)
app.delete('/entry/delete/:entryID', deleteEntry)
app.get('/entry/getEntry/:entryID', getEntry)

app.get("/entry/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  });

app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}`))