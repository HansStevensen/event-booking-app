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


