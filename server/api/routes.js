const express = require('express')
const mongoose = require('mongoose')

const Category = require('../models/category')
const Product = require('../models/product')

const router = express.Router()

//Test Server
router.get('/', (req, res) => {
    res.json({ message: "Server is online" })
})

//New routes for improved Schema
router.post('/category', async (req, res) => {
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        parent: req.body.parent || null,
        child_categories: req.body.child_categories || [],
        products: req.body.products || []
    })
    try {
        const reply = await category.save()
        if (category.parent !== null)
            try {
                await Category.findByIdAndUpdate(category.parent, {
                    $push: { child_categories: category._id }
                })
            } catch (err) {
                console.log(err)
            }

        if (category.products !== [])
            category.products.forEach(async p => {
                try {
                    const product = Product.findById(p)
                    if (product !== null)
                        await Product.findByIdAndUpdate(p, {
                            $push: { product_categories: category._id }
                        })
                } catch (err) {
                    console.log(err)
                }
            });
        res.json(reply)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.post('/product', async (req, res) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        product_name: req.body.product_name || `Product ${Math.floor((Math.random() * 10000) + 1)}`,
        product_cost: req.body.product_cost || -1,
        product_categories: req.body.product_categories || []
    })
    try {
        const reply = await product.save()
        if (product.product_categories !== [])
            product.product_categories.forEach(async c => {
                try {
                    await Category.findByIdAndUpdate(c, {
                        $push: { products: product._id }
                    })
                } catch (err) {
                    console.log(err)
                }
            })
        res.json(reply)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.get('/category', async (req, res) => {
    const categories = await Category.find({})
    res.json(categories)
})
router.get('/category/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    res.json(category)
})
router.get('/product', async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})
router.get('/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.json(product)
})

router.delete('/category/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    try {
        await category.remove();
        try {
            await Category.findByIdAndUpdate(category.parent, {
                $pull: { child_categories: category._id }
            })
        } catch (err) { console.log(err) }
        try {
            await Category.updateMany({ '_id': category.child_categories }, { parent: null })
        } catch (err) { console.log(err) }
        try {
            await Product.updateMany({ '_id': category.products }, {
                $pull: { product_categories: category._id }
            })
        } catch (err) { console.log(err) }
        res.json({ message: `Category ${category._id} deleted` })
    } catch (err) {
        res.status(404).json({ message: `${req.params.id} do not exist. Could not delete the category` })
    }
})
router.delete('/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    try {
        await product.remove()
        try {
            await Category.updateMany({ '_id': product.product_categories }, {
                $pull: { products: product._id }
            })
        } catch (err) { console.log(err) }
        res.json({ message: `Product ${product._id} deleted` })
    } catch (err) {
        res.status(404).json({ message: `${req.params.id} do not exist. Could not delete the product` })
    }
})

router.patch('/category/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)
    const request = new Object({
        parent: req.body.parent || null,
        products: req.body.products || [],
        child_categories: req.body.categories || []
    })
    try {
        const updated = await Category.findByIdAndUpdate(category._id, {
            parent: request.parent || category.parent,
            products: req.body.products || category.products,
            child_categories: req.body.child_categories || category.child_categories
        }, { new: true })

        if (request.parent !== null && request.parent !== category.parent)
            try {
                await Category.findByIdAndUpdate(request.parent, {
                    $push: { child_categories: category._id }
                })
                await Category.findByIdAndUpdate(category.parent, {
                    $pull: { child_categories: category._id }
                })
            } catch (err) { console.log(err) }
        let removeProducts = [...category.products.filter(prod => !request.products.includes(prod))]
        if (removeProducts !== [])
            try {
                await Product.updateMany({ _id: removeProducts }, {
                    $pull: { product_categories: category._id }
                })
            } catch (err) { console.log(err) }
        let removeCategories = [...category.child_categories.filter(cat => !request.child_categories.includes(cat))]
        if (removeCategories !== [])
            try {
                await Category.updateMany({ _id: removeCategories }, {
                    $pull: { child_categories: category._id }
                })
            } catch (err) { console.log(err) }

        let addProducts = [...request.products.filter(prod => !category.products.includes(prod))]
        if (addProducts !== [])
            try {
                await Product.updateMany({ _id: addProducts }, {
                    $push: { product_categories: category._id }
                })
            } catch (err) { console.log(err) }
        let addCategories = [...request.child_categories.filter(cat => !category.child_categories.includes(cat))]
        if (addCategories !== [])
            try {
                await Category.updateMany({ _id: addCategories }, {
                    $push: { child_categories: category._id }
                })
            } catch (err) { console.log(err) }

        res.json(updated)
    } catch (err) {
        res.status(404).json({ message: `Cannot find specified category ID ${req.params.id}` })
    }
})
router.patch('/product/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    const request = new Object({
        product_categories: req.body.product_categories || [],
        product_name: req.body.product_name || null,
        product_cost: req.body.product_cost || null
    })
    try {
        const updated = await Product.findByIdAndUpdate(product._id, {
            product_categories: req.body.product_categories || product.product_categories,
            product_name: request.product_name || product.product_name,
            product_cost: request.product_cost || product.product_cost
        })
        let removeCategories = [...product.product_categories.filter(cat => !request.product_categories.includes(cat))]
        if (removeCategories !== [])
            try {
                await Category.updateMany({ _id: removeCategories }, {
                    $pull: { products: product._id }
                })
            } catch (err) { console.log(err) }
        let addCategories = [...request.product_categories.filter(cat => !product.product_categories.includes(cat))]
        if (addCategories !== [])
            try {
                await Category.updateMany({ _id: addCategories }, {
                    $push: { products: product._id }
                })
            } catch (err) { console.log(err) }
        res.json(updated)
    } catch (err) {
        res.status(404).json({ message: `Cannot find specified Product ID ${req.params.id}` })
    }
})

//Get products by a catagory id
router.get('/product/c/:id', async (req, res) => {
    const products = await Product.find({ 
        product_categories: { $all: [req.params.id] }
    })
    res.json(products)
})

module.exports = router