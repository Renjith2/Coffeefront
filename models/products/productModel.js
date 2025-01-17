const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },

    availability:{
        type:String,
        required:true
    },
    vendorname:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('products',productSchema)