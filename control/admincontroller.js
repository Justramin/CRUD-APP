const express = require('express')
const collection = require('../model/mongodb')
const { validateName, validateEmail, validatePassword } = require('../utils/validation');



const router = express.Router()

function chekAdmin(req,res,next){
    if(req.session.isAdmin){
        next()
    }else{
        res.redirect('/admin')
    }
}


router.get('/admin',(req,res)=>{
    if(req.session.isAdmin){
        res.redirect('/adminhome')
    }
    res.render('adminLogin')
})

router.post('/admin',async (req,res)=>{
    try {
        const data = {
        name:req.body.name,
        password:req.body.password
    }
    const userData = await collection.findOne({name:data.name})
    if(userData.name ===data.name && userData.password===data.password && userData.isAdmin === true){
        req.session.isAdmin=true
        req.session.name = req.body.name
        res.redirect('/adminhome')
    }
    else{
        res.redirect('/admin')
    }
        
    } catch (error) {
        console.log(error);
        
    }
   
})

router.get('/adminhome',chekAdmin , async(req,res)=>{
    
        const userData =await collection.find({isAdmin:false})
        res.render('adminHome',{users:userData , data:''})
   
   
})



router.get('/update', chekAdmin ,  async(req,res)=>{
    const data = {
        name:req.query.name
    }

    req.session.oldName = data.name

    const userData = await collection.find({name:data.name})
  
    res.render('adminEdit',{users:userData})
})

router.post('/update',chekAdmin,async(req,res)=>{
    const oldName = req.session.oldName
    await collection.updateOne({name:oldName},{$set:{name:req.body.name, email:req.body.email}})
    res.redirect('/adminhome')
})

router.get('/delete', chekAdmin , async(req,res)=>{
    const name = req.query.name
    await collection.deleteOne({name:name})
    res.redirect('/adminhome')
})

router.get('/adduser', chekAdmin , (req,res)=>{
    res.render('adminuseradd')
})


router.post('/adduser', chekAdmin,async (req,res)=>{
    const data = {
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    };

     // Simple validation
  if (!validateName(data.name)) {
    req.flash('error', 'Enter a valid username');
    return res.redirect('/adduser');
  }

  else if ( !validateEmail(data.email)) {
    req.flash('error', 'Enter valid email');
    return res.redirect('/adduser'); 
  }


  else if ( !validatePassword(data.password)) {
    req.flash('error', 'Make strong  password');
    return res.redirect('/adduser');
  }



    const userData =await collection.findOne({email:data.email});
    try {
        if(userData){
            req.flash('error', 'Email already exist.')
            res.redirect('/adduser')
        }else{
            await collection.insertMany([data])
            req.flash('success', 'Signup successful. You can now log in.')
            res.redirect('/adminhome')
        }
    } catch (error) {
        req.flash('error', 'An error occurred during signup. Please try again.');
        res.redirect('/adduser'); 
    }
  
})



router.post('/admin-userSearch', chekAdmin , async(req,res)=>{
    const data = req.body.name
  
    const searchedData = await collection.find({name:{$regex: new RegExp(`${data}`,'i')},isAdmin:false})
    // Change the condition to check if the array has elements
if(searchedData.length > 0) {
    res.render('adminHome', { users: searchedData , data:data});
} else {
    // Handle the case where no matching users are found
    res.render('adminHome', { users: [] , data:data});
}
})

router.get('/adminlogout',(req,res)=>{
    req.session.isAdmin=false
    res.redirect('/admin')
})


module.exports = router
