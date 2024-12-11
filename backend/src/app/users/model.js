const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    reset: {
        code: {
            type: String,
            default: null
        },
        time: {
            type: String,
            default: null
        }
    },
    verification: {
        code: {
            type: String,
            default: null
        },
        time: {
            type: String,
            default: null
        },
        verified: {
            type: Boolean,
            default: false
        }
    }
}, { collection: "users", timestamps: true });

const user = mongoose.model("users", userSchema);

module.exports = user;