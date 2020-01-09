const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    blood_group: {
        type: String,
        trim: true,
        uppercase: true,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['resolved', 'unresolved'],
        default: 'unresolved'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,   // it stores owner ID which is of type ObjectID
        required: true
    }, 
    creatorName: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    mobile: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
}, {
    timestamps: true
})

// postSchema.post('save', async function (post, next) {
//     console.log(`Inside post save`)
//     console.log('post:: ' + post)
//     next()
// })

const Post = mongoose.model('Post', postSchema)

module.exports = {
    Post: Post
}