const express = require('express')
require('./db/mongodb')
require('dotenv').config()

const userRouter = require('./routes/user')
const postRouter = require('./routes/post')

const app = express()

app.use(express.json())

app.use(userRouter)
app.use(postRouter)

const port = process.env.PORT || process.env.PORT

app.listen(port, () => {
    console.log('Server running on port ' + port)
})
