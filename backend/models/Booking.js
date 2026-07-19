const mongoose = require('mongoose');

const BookingSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    quantity:{
        type: Number,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        default:'pending',
        enum:['pending','paid','cancelled']
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

const Booking = mongoose.model('Booking',BookingSchema);

module.exports = Booking;