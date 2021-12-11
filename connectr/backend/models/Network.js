const mongoose = require('mongoose')

const networkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    avatar: {
        type: String,
        default: "default_avatar"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        min: [2, "minimum members 2"],
        max: [100, "Max number of members reached"]
    }],
    administrators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        max: [3, "Max number of admins reached"]
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
}, {timestamps: true})

const  Network = mongoose.model('Network', networkSchema)
module.exports =  Network