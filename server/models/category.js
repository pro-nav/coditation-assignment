const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    parent: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    },    
    child_categories: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Category'
    }],
    products: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Products'
    }]
})
const Category = mongoose.model('Category', categorySchema)
module.exports = Category