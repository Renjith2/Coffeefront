const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    productsOrdered:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    totalPrice:{
        type:String,
        required:true
    },

    orderDate:{
        type:Date,
        required:true
    },
    orderStatus:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('orders',orderSchema)