import mongoose from "mongoose";

// membuat model user
const Schema = new mongoose.Schema({
    fullname: {
        type: String,
        require: true,
        uniqeu: true
    },
    email: {
        type: String,
        require: true,
        uniqeu: true
    },
    password: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    createdAt: {
        type: Number
    },
    updatedAt:  {
        type: Number
    }
},
{
    // untuk isi createdAt dan UpdatedAt
    timestamps: {
        currentTime: () => Math.floor(Date.now()/1000)
    }
}
)

export default mongoose.model('User', Schema)