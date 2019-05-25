const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Post } = require('../models/post')
require('dotenv').config()

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(val) {
            if (!validator.isEmail(val)) {
                throw new Error('Invalid Email!');
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 18) {
                throw new Error('Age must be greater than 18!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(val) {
            if (val.toLowerCase().includes('password')) {
                throw new Error('Password should not contain string "password"')
            }
        }
    },
    blood_group: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    mobile: {
        type: Number,
        trim: true,
        maxlength: 12,
        unique: true,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// Middleware before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Middleware before removing
userSchema.pre('remove', async function (next) {
    const user = this
    await Post.deleteMany({ owner: user._id })  // delete all posts with same owner id
    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.loginUser = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Invalid Credentials!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Invalid Credentials!')
    }
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = {
    User: User
}