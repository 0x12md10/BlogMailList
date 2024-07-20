const express = require("express");
require("dotenv").config()
const { default: helmet } = require("helmet");
const { default: mongoose } = require("mongoose");
const PORT = process.env.PORT || 3000;
const app = express();
const MailList = require("./db/UserSchema")
const cors = require("cors");
const zod = require("zod");

app.use(helmet());
app.use(cors())
app.use(express.json());


app.get("/" , (req,res,next)=> {
    try {
        res.status(200).json({res : "get/"})
    } catch (error) {
        next(error)
    }
})

app.post("/post" ,async (req,res,next)=> {
    try {
        const {email} = req.body;

        const validateSchema = zod.object({
            email : zod.string().email().min(7 , "email can't be less than 7 characters").max(50,"Email can't be more than 50 characters long"),
    
        })
    
        const result = validateSchema.safeParse({email});
    
        if(!result.success) {
            return res.status(400).json({err : result.error.issues[0].message})
        }
    
        const origin  = req.headers.origin ? req.headers.origin : "" ;
        const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : "";
    
        await MailList.create({email,origin, userAgent});
    
        res.status(201).json({res : "You're subscribed."})
        
    } catch (error) {
        next(error)
    }
})


app.use((err,req,res,next)=> {
    res.status(500).json({err : err.message})
})


mongoose.connection.once("connected" , ()=> {
    console.log("Connected to DB.")
})

mongoose.connection.on("error" , ()=> {
    console.log("error connecting to DB")
})

async function startServer() {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(PORT , ()=> {
        console.log("Listening on port "+ PORT);
    })
}

startServer()