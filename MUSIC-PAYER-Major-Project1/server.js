const express = require("express")
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const user = require('./model/user')
const bcrypt = require('bcrypt')


mongoose.connect('mongodb://localhost:27017/logindata', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'static')))

app.post('/api/register', async (req, res) => {

    const { username, password: plainpassword } = req.body

    const password = await bcrypt.hashSync(plainpassword, 10)

    try {
        const response = await user.create({
            username,
            password
        })

        console.log("user created successfully", response)
    }
    catch (error) {
        if (error.code === 11000) {
            res.send({ status: error, error: ' username already exist' })
        }
        throw error

    }
    res.send({ status: 'ok' })

})



app.post('/api/login', async (req, res) => {

    const { username, password } = req.body

    const user1 = await user.findOne({ username }).lean()
    if (!user1) {
        return res.json({ status: "error", error: "INVALID USER" })
    }

    if (await bcrypt.compare(password, user1.password)) {

        // res.redirect(path.join(__dirname, 'static/index.html'))

    }
    else {
        alert("invalid user")
    }




    res.json({ status: 'ok' })
})













app.listen(7000, () => {
    console.log("Server is running at port 7000 ")
})