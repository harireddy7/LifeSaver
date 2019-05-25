const express = require('express')
const auth = require('../middlewares/auth')
const { User } = require('../models/user')
const { sendMail } = require('../utils/mail')
const { sendSms } = require('../utils/sms')
require('dotenv').config()

const rateLimit = require("express-rate-limit")

const router = new express.Router()

const apiLimiter = rateLimit({
    windowMs:  process.env.RATE_LIMIT_TIMEOUT,
    max: process.env.RATE_LIMIT,
    message: {
        message: 'Maximum requests received, Please wait an hour!'
    }
})

router.use('/sendsms/:group', apiLimiter)

const { Post } = require('../models/post')

router.post('/posts/create', auth, async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            owner: req.user._id,
            creatorName: (await User.findOne({_id: req.user._id})).name
        })
        await post.save()
        res.status(201).send(post)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/posts', auth, async (req, res) => {
    try {
        const posts = await Post.find({owner: req.user._id})
        if(posts.length === 0) {
            return res.status(400).send({message: 'No Posts found!'})
        }
        res.send(posts)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/posts/:id', auth, async (req, res) => {
    try {
        // const post = await Post.findOne({ _id: req.params.id, owner: req.user._id })
        const post = await Post.findOne({ _id: req.params.id })
        if (!post) {
            return res.status(404).send({message: 'No Posts found!'})
        }
        res.send(post)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/posts/:id', auth, async (req, res) => {
    const allOptions = ['blood_group', 'status', 'location']
    const updates = Object.keys(req.body)
    const allowUpdates = updates.every(upd => allOptions.includes(upd))
    if(!allowUpdates) {
        return res.status(400).send({error: 'Invalid Updates!'})
    }
    try {
        const post = await Post.findOne({ _id: req.params.id, owner: req.user._id })
        if (!post) {
            return res.status(404).send({message: 'No Posts found!'})
        }
        updates.forEach(u => post[u] = req.body[u])
        await post.save()
        res.send(post)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/posts/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!post) {
            return res.status(404).send({message: 'No Posts found!'})
        }
        res.send(post)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/notifyDonor/:group', auth, async (req, res) => {
    try {
        const bGroup = req.params.group.toUpperCase()
        const allUsers = [] = await User.find({ blood_group: bGroup})
        const reqUsers = allUsers.filter(user => user._id.toString() != req.user._id.toString())
        if (reqUsers.length === 0) {
            return res.status(404).send({ message: 'No Donors Found!'})
        }
        reqUsers.forEach((user) => sendMail.notifyDonorMail(user, req.user, bGroup))
        res.send({ message: 'successfully sent!' })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/sendsms/:group', auth, async (req, res) => {
    try {
        const bGroup = req.params.group.toUpperCase()
        const allUsers = [] = await User.find({ blood_group: bGroup})
        const reqUsers = allUsers.filter(user => user._id.toString() != req.user._id.toString())
        if (reqUsers.length === 0) {
            return res.status(404).send({ message: 'No Donors Found!'})
        }
        sendSms(reqUsers, req.user, bGroup)
        res.send({ message: 'successfully sent!' })
    } catch (e) {
        console.log(e)
        res.status(500).send({ error: e })
    }
})

router.get('/allposts', auth, async (req, res) => {
    try {
        const allposts = await Post.find({})
        const otherPosts = allposts.filter(p => p.owner.toString() != req.user._id)
        if (otherPosts.length <= 0) {
            return res.status(404).send({ message: 'No Posts Found!'})
        }
        res.send(otherPosts)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router