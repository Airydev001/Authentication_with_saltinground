//jshint esversion:6
//This configure whatsoever in .env to be available in this app.js
//To access it here we use process.env.API_KEY 
//~require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
//const md5 = require('md5');
const app = express();

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

app.use(express.static("Public"))
app.set('view engine', "ejs")
app.use(bodyParser.urlencoded({extended:true}));




const userSchema = new mongoose.Schema({
    email:String,
    password:String,
});
//It's important to add the plug in middleware before creating model below

//userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get('/',function(req,res){
    res.render("home")
})
app.get('/login',function(req,res){
    res.render("login")
})
app.get('/register',function(req,res){
    res.render("register")
})


//plaintextoffender.com 
//password-checker.online-domain-tools.com
app.post("/register",(req,res)=>{
    
   bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
    //Create a new user 
    const user = new User ({
        email:req.body.username,
        password:hash
    }) 
    user.save((err)=>{
      if(!err){
        console.log("Saved Successfully")
        res.render('secrets');
      } else {
        console.log(err);
      }
    });
   }) 
    
    
    
})
//to log a user in 
app.post('/login',(req,res)=>{
   const username = req.body.username;
   const password = req.body.password;
    User.findOne({email:username},(err,foundOne)=>{
    if (!err){
      if(foundOne){
        bcrypt.compare(password,foundOne.password,(err,respond)=>{
           if(respond === true){
            res.render('secrets');
           }
        })
      } 
    } else {
        console.log(err);
    }
   })
})
app.listen(4000,()=>{
    console.log("Server is up and running");
})
//To  do list
//cookies are used to save browsing session
//mnpm install the following
//passport
//passport-local
//passport-local-mongoose
//express-session 
//bcrypt