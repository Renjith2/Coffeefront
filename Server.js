const express = require('express')
require('dotenv').config()
var cors=require('cors')
const userRoute=require('./routes/userRoute')
const productRoute =  require('./routes/productRoute')
const orderRoute=require('./routes/orderRoute')

const dbConfig=require('./config/dbConfig')
const app=express()
app.use(cors())
app.use(express.json())
app.use('/api/user',userRoute)
app.use('/',productRoute)
app.use('/',orderRoute);

const corsOptions = {
  origin: 'https://quiet-dusk-299fb7.netlify.app',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.listen(7766,()=>{
    console.log("Server is Running!!!!!!@@@")
})

app.get('/',(req,res)=>{
    res.send("HIIIIII@!!!!!")
})
