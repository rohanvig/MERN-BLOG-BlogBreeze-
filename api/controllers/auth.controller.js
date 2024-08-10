// we use async as data is fetched from the mongodb so it will take time 

import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'

export const signup= async (req,res)=>{
    const {username,email,password}=req.body;

    if(!username || !email || !password || username==="" || email === "" || password === "" ){
        return res.status(400).json({message:"Please fill all the fields"});
    }
    // we check if the user already exists in the database

    const hashedPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({
        username,
        email,
        password:hashedPassword

    });
    try{
        const savedUser=await newUser.save();
        res.status(201).json(savedUser);
    }
  catch(err){
    res.status(500).json({message:err.message});
    }

}