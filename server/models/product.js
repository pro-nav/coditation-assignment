const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        required: true,
        unique: true
    },
    product_name:{
        type: String,
        maxlength: 25
    },
    product_cost:{
        type: Number
    },
    product_catagories: {
        type: [Number]
    }
})

module.exports = mongoose.model('Product', productSchema)