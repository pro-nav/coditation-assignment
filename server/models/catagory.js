const mongoose = require('mongoose')

const catagorySchema = new mongoose.Schema({
    catagory_id: {
        type: Number,
        required: true,
        unique: true
    },
    child_catagories: {
        type: [Number],
    },
    product_list: {
        type: [Number]
    }
})

module.exports = mongoose.model('Catagory', catagorySchema)