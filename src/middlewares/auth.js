const jwt = require('jsonwebtoken')
const { User } = require('../models/user')
require('dotenv').config()

const auth = async (req, res, next) => {
    console.log(req.headers);
    console.log(req.header('Authorization'))
    // console.log(token)

    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    } catch (e) {
        return res.status(401).send({error: 'Please Authenticate Bruh!'})
    }
}

module.exports = auth