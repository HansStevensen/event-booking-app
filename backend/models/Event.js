const mongoose = require('mongoose');


const EventSchema = mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location :{
        type: String,
        required: true,
    },
    price : {
        type: Number,
        required: true,
    },
    quota : {
        type: Number,
        required: true,
    },
    date : {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    venueAddress:{
        type: String,
        required: true,
    },
    mapsUrl:{
        type: String,
        required: true,
    },
    openGateTime:{
        type: String,
        required: true,
    },
    startTime:{
        type: String,
        required: true,
    },
    terms:{
        type: String,
        required: true,
    }

})

const Event = mongoose.model("Event",EventSchema);

module.exports = Event;