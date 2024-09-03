import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    entries: {
        type: Array,
        default: [],
    },
    // favorites: {
    //     type: Array,
    //     default: [],
    // },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const  User =  mongoose.model("User", userSchema);

