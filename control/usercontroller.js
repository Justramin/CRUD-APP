const express = require('express')
const collection = require('../model/mongodb')
const { validateName, validateEmail, validatePassword } = require('../utils/validation');


const router = express.Router()







router.get('/',(req,res)=>{
    if(req.session.isAuth){
        res.redirect('/home')
    }else{
        res.redirect('login')
    } 
})

router.get('/login',(req,res)=>{
    if(req.session.isAuth){
        res.redirect('/home')
    }else{
        res.render('login')
    }
    
})



router.post('/login',async (req,res)=>{
    try {
        const data = {
        name:req.body.name,
        password:req.body.password
    }
    const userData = await collection.findOne({name:data.name})
    if(userData.name ===data.name && userData.password===data.password){
        req.session.isAuth=true
        req.session.name = req.body.name
        res.redirect('/home')
    }
    else{
        res.redirect('/')
    }
        
    } catch (error) {
        console.log(error);
        
    }
   
})

router.get('/home',(req,res)=>{
    if(req.session.isAuth){
        const userData = req.session.name
        res.render('home',{userData})
    }else{
        res.redirect('/login')
    }
    
})

router.get('/signup',(req,res)=>{
    res.render('signup')
})


router.post('/signup', async (req,res)=>{
    const data = {
        name: req.body.name,
        email:req.body.email,
        password:req.body.password
    };

     // Simple validation
  if (!validateName(data.name)) {
    req.flash('error', 'Enter a valid username');
    return res.redirect('/signup');
  }

  else if ( !validateEmail(data.email)) {
    req.flash('error', 'Enter valid email');
    return res.redirect('/signup'); 
  }


  else if ( !validatePassword(data.password)) {
    req.flash('error', 'Make strong  password');
    return res.redirect('/signup');
  }



    const userData =await collection.findOne({email:data.email});
    try {
        if(userData){
            req.flash('error', 'Email already exist.')
            res.redirect('/signup')
        }else{
            await collection.insertMany([data])
            req.flash('success', 'Signup successful. You can now log in.')
            res.redirect('/login')
        }
    } catch (error) {
        req.flash('error', 'An error occurred during signup. Please try again.');
        res.redirect('/signup'); 
    }

})



router.get('/logout',(req,res)=>{
    req.session.isAuth=false
    res.redirect('/login')
})

module.exports = router