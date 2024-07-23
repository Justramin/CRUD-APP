const mongoose = require('mongoose')



mongoose.connect('mongodb://localhost:27017/week6')
.then(()=>{
    console.log('MONGODB Connected Successfuly ! ');
})
.catch((error)=>{
    console.log('error catched: ',error);
})
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:true
    }
})
const collection = new mongoose.model('data',schema)
module.exports = collection