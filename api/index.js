const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const salt = bcrypt.genSaltSync(10);
const key = 'azouzbelmouz'

const app = express();

app.use(cookieParser())
app.use(cors({credentials:true,origin:'http://localhost:5173'}));
app.use(express.json())
mongoose.connect('mongodb+srv://blog:CVwLMnS5DqczUgb8@blog.cyokc.mongodb.net/?retryWrites=true&w=majority&appName=Blog')

app.get('/test', (req,res)=>{
    res.json('test ok');
});
app.post('/login', async (req,res)=>{
    const {username,password}=req.body;
    const userDoc = await User.findOne({username})
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk){
        jwt.sign({username,id:userDoc._id},key,{},(err,token)=>{
            if(err) throw err;
            res.cookie('token',token).json('ok');

        })
    }else{
        res.status(400).json('Could not login')
    }
});
app.post('/signin', async (req,res)=>{
    const {username,password}=req.body;
    const userDoc = await User.create({username,password:bcrypt.hashSync(password,salt)});
    res.json(userDoc);
});
app.get('/profile',(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,key,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
    })
})
app.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok')
})
app.listen(4000);
//CVwLMnS5DqczUgb8
//mongodb://blog:CVwLMnS5DqczUgb8@blog/?ssl=true&replicaSet=atlas-14g1rj-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Blog
