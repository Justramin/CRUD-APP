const express = require('express')
const session = require('express-session')
const nocache = require('nocache')
const flash = require('express-flash')
const userRouter = require('./control/usercontroller')
const adminRouter = require('./control/admincontroller')

const app = express()
const PORT = 4000

app.set('view engine','ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(nocache())
app.use(flash())
app.use(session({
    secret:'yyutftyufu786r',
    resave:false,
    saveUninitialized:true
}))
app.use(userRouter)
app.use(adminRouter)




app.listen(PORT,()=>{
    console.log(`Server listen port: ${PORT}`);
})
