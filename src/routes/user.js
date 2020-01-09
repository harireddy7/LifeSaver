const express = require('express')
const {
    User
} = require('../models/user')
const auth = require('../middlewares/auth')
const {
    sendMail
} = require('../utils/mail')

const router = new express.Router()


router.post('/users/create', async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        sendMail.welcomeMail(user)
        res.status(201).send({
            user,
            token
        })
    } catch ({ errmsg }) {
        if (errmsg.includes('email') || errmsg.includes('mobile')) {
            return res.status(500).send('Email or Mobile already exists!');
        }
        return res.status(500).send('Server Error');
    }
})

router.post('/users/create1', async (req, res) => {
    console.log(req.body);
    res.send(req.body);
})

router.post('/users/login', async (req, res) => {
    console.log(req.body)
    try {
        const user = await User.loginUser(req.body.email.toLowerCase(), req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/logout', auth, async (req, res) => {
    req.user.tokens = req.user.tokens.filter(t => t.token != req.token) // removing current token from token array
    req.user.save()
    res.send('Logged out successfully!')
})

router.post('/logoutAll', auth, async (req, res) => {
    req.user.tokens = [];
    req.user.save()
    res.send('Logged out of all devices successfully!')
})

router.get('/users/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const allOptions = ['name', 'email', 'password', 'age', 'blood_group', 'location']
    const updates = Object.keys(req.body)
    const allowUpdates = updates.every(upd => allOptions.includes(upd))

    if (!allowUpdates) {
        return res.status(400).send({
            error: 'Invalid Updates!'
        })
    }
    try {
        updates.forEach(u => req.user[u] = req.body[u])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendMail.goodbyeMail(req.user)
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router