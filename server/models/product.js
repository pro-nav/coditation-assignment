const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_name:{
        type: String,
        maxlength: 25
    },
    product_cost:{
        type: Number
    },
    product_categories: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    }]
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product