const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    type: {
        type: String,
    },
    vehicalType: {
        type: String,
    },
    joinedTime: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);