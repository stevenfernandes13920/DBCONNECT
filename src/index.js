// import mongoose from "mongoose";
// import {DB_NAME} from "./constants";

import dotenv from "dotenv"
import connectDB from "./DB/index.js";

dotenv.config({
    path: './env'
})

connectDB()







// import express from "express";
// const app = express()
// (async()=>{
//     try{
//         await mongoose.connect(`${process.env.V}/${DB_NAME}`)
//     }catch(ERROR){
//         console.error("ERROR:",error)
//         throw err
//     }
// })()