const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express'); //untuk membuat instance server dan API
const mongoose = require('mongoose');//untuk melakukan pengaksesan ke Database
const cors = require('cors');//untuk mengaktifkan Cross Origin Resource Sharing
const bcrypt = require('bcrypt');//untuk enkripsi password
const multer = require('multer');//untuk proses upload gambar
require('dotenv').config(); //agar folder .env bisa dibaca oleh project

// Import model
const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

const storage = multer.diskStorage({
    destination :(req,file,cb) =>{
        cb(null,"uploads/")
    },
    filename:(req,file,cb) =>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

const app = express();

app.use('/uploads',express.static('uploads'))
app.use(cors());
app.use(express.json());

//konek ke DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

//nyalain servernya
app.listen(process.env.PORT, () => console.log(`Server jalan di port ${process.env.PORT}`));

app.post(`/api/register`,async (req,res)=>{
    const {name,username,email,password,phoneNumber,DOB} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({name,username,email,password:hashedPassword,phoneNumber,DOB})
        await newUser.save();
        return res.status(201).json({message:'Register Success'});
        
    } catch (error) {
        return res.status(500).json({message:'Register Failed'});
    }
})

app.post(`/api/login`,async(req,res)=>{
    const {username,password} = req.body;

    try {
        const user = await User.findOne({username});

        if(user){
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                return res.status(200).json({message:'Login Success',id:user._id,role:user.role})
            }else{
                return res.status(500).json({message:'Password is wrong'})
            }
        }else{
            return res.status(500).json({message:'Username is wrong'})
        }
    } catch (err) {
        return res.status(500).json({message:'Login Failed'})
        
    }

})

app.get(`/api/profile/:id`,async(req,res)=>{
    const id = req.params.id;
    try {
        const user = await User.findById(id).select('-password')
        if(!user){
            return res.status(404).json({message:'User not found'});
        }else{
            return res.status(200).json({user})
        }

    } catch (err) {
        return res.status(500).json({message:'Server error', error: err.message});
    }
})

app.put(`/api/profile/:id`,async(req,res)=>{
    const id = req.params.id;
    const {newName,newUsername,newEmail,newPassword,newPhoneNumber,newDOB} = req.body;

    try {
        const user = await User.findById(id)

        if(!user){
            return res.status(404).json({message:'User not found'})
        }else{
            const isUsernameAvailable = await User.findOne({username:newUsername});
            const isEmailAvailable = await User.findOne({email:newEmail});

           if(newUsername && newUsername !== user.username && isUsernameAvailable){
                return res.status(400).json({message: 'Username is not available'})
            }

            if(newEmail && newEmail !== user.email && isEmailAvailable){
                return res.status(400).json({message: 'Email is not available'})
            }

            let hashedPassword;
            if(newPassword){
                hashedPassword = await bcrypt.hash(newPassword,10);
            }

            user.name = newName || user.name;
            user.username = newUsername || user.username;
            user.email = newEmail || user.email;
            user.password = hashedPassword || user.password;
            user.phoneNumber = newPhoneNumber || user.phoneNumber;
            user.DOB = newDOB || user.DOB;

            await user.save();
            return res.status(200).json({message:'Profile updated successfully'})
        }
    } catch (err) {
        return res.status(500).json({message:'Failed to update profile'})
    }
})

app.post(`/api/events`,upload.single('image'),async(req,res)=>{
    const {title,description,location,price,quota,date} = req.body;

    try {
        const image = req.file.path;
        const events = new Event({title,description,location,price,quota,date,image});

        await events.save();

        return res.status(200).json({message:"Success to create a new event"})

    } catch (err) {
        return res.status(500).json({message:"Cannot create new event"})
    }
})

app.get(`/api/events`,async(req,res)=>{
    try {
        const allEvents = await Event.find();
        return res.status(200).json({message:"Success show all event",allEvents})
    } catch (err) {
        return res.status(500).json({message:"Failed to show all event"})
    }
})

app.get(`/api/events/:id`,async(req,res)=>{
    const eventId = req.params.id;

    try {
        const events = await Event.findById(eventId);
        if(events){
            return res.status(200).json({message:"Event is found",events})
        }else{
            return res.status(404).json({message:"Event not found"})
        }
    } catch (err) {
        return res.status(500).json({message:"Failed to show event"})
    }
})

app.put(`/api/events/:id`,upload.single('newImage'),async(req,res) =>{
    const eventId = req.params.id;
    const {newTitle,newDescription,newLocation,newPrice,newQuota,newDate} = req.body;

    try {
        const events = await Event.findById(eventId);

        if(!events){
            return res.status(404).json({message:"Event not found"})
        }else{

            if(req.file){
                events.image = req.file.path;
            }

            events.title = newTitle || events.title;
            events.description = newDescription || events.description;
            events.location = newLocation || events.location;
            events.price = newPrice || events.price;
            events.quota = newQuota || events.quota;
            events.date = newDate || events.date;

            await events.save();
            return res.status(200).json({message:"Event updated successfully"})
        }
    } catch (error) {
        return res.status(500).json({message:"Failed to update event"})
    }
})

app.delete(`/api/events/:id`,async(req,res)=>{
    const eventId = req.params.id;
    
    try {
        const events= await Event.findById(eventId);
        if(!events){
            return res.status(404).json({message:"Event is not found"})
        }else{
            await Event.deleteOne({_id:events._id})
            return res.status(200).json({message:"Event deleted"})
        }
    } catch (err) {
        return res.status(500).json({message:"Failed to delete event"})
    }
})

app.post(`/api/bookings`,async(req,res)=>{
    const {userId,eventId,quantity} = req.body;

    try {
        const events = await Event.findById(eventId);

        if(!events){
            return res.status(404).json({message:"Event not found"})
        }else{
            if(events.quota < quantity){
                return res.status(400).json({message:"Quota is not enough"})
            }
            events.quota -= quantity;
            const totalPrice = events.price * quantity;
            
            await events.save();

            const newBookings = new Booking({userId,eventId,quantity,totalPrice});
            await newBookings.save();
            return res.status(201).json({message:"Booking is success,please do the payment",newBookings})


        }
    } catch (err) {
        return res.status(500).json({message:"Failed to book ticket"})
    }
})

app.put(`/api/bookings/:id/payment`,async(req,res)=>{
    const bookingId =req.params.id;
    
    try {
        const bookings = await Booking.findById(bookingId);
        
        if (!bookings) {
            return res.status(404).json({message:"Booking information is not found"})
        } else {
            if(bookings.status==='paid'){
                return res.status(400).json({message:"Booking is already paid"})
            }else if(bookings.status === 'cancelled'){
                return res.status(400).json({message:"Booking is cancelled"})
            }
            bookings.status='paid';
            await bookings.save();
            
            return res.status(200).json({message:"Payment is successful"})
        }
    } catch (err) {
        return res.status(500).json({message:"Failed to make payment"})
    }
})

app.put(`/api/bookings/:id/cancel`,async(req,res)=>{
    const bookingId = req.params.id;

    try {
        const bookings = await Booking.findById(bookingId);
        if(!bookings){
            return res.status(404).json({message:"Booking information is not found"})
        }else{
            if(bookings.status === 'paid'|| bookings.status ==='cancelled'){
                return res.status(400).json({message:"Booking is already paid or cancelled"})
            }else{
                const events = await Event.findById(bookings.eventId);
                if(!events){
                    return res.status(404).json({message:"Event is not found"})
                }else{
                    events.quota+=bookings.quantity;
                    await events.save();

                    bookings.status='cancelled'
                    await bookings.save();

                    return res.status(200).json({message:"Booking cancelled successfully"})
                }
            }
        }
    } catch (err) {
        return res.status(500).json({message:"Failed to cancel booking"})
    }
})

app.get(`/api/bookings/user/:userId`,async(req,res)=>{
    const userId = req.params.userId;

    try {
        const allBookings = await Booking.find({userId}).populate("eventId");
        return res.status(200).json({message:"Success to show all booking",allBookings})
    } catch (error) {
        return res.status(500).json({message:"Failed to show all booking"})
    }
})

app.get(`/api/bookings`,async(req,res)=>{
    try {
        const allBookings = await Booking.find().populate('eventId').populate('userId');
        return res.status(200).json({message:"Success show all Bookings",allBookings});
    } catch (err) {
        return res.status(500).json({message:"Failed to show all Bookings"})
    }
})




