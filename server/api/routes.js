const express = require('express')
const moongoose = require('mongoose')

const router = express.Router()
const Catagory = require('../models/catagory')
const Product = require('../models/product')

//Test Server
router.get('/', (req, res) => {
    res.json({ message: "Server is online" })
})

//Read 
router.get('/catagory', async (req, res) => {
    const db_catagory = await Catagory.find({})
    res.json(db_catagory)
})
router.get('/catagory/:id', async (req, res) => {
    const catagory = await Catagory.findOne({ catagory_id: req.params.id })
    res.json(catagory)
})
router.get('/product', async (req, res) => {
    const db_products = await Product.find({})
    res.json(db_products)
})
router.get('/product/:id', async (req, res) => {
    const product = await Product.findOne({ product_id: req.params.id })
    res.json(product)
})

//Create 
router.post('/catagory', async (req, res) => {
    let uid
    try {
        const catagory = new Catagory({
            catagory_id: req.body.catagory_id,
            child_catagories: req.body.child_catagories || [],
            product_list: req.body.product_list || []
        })
        uid = await catagory.save()
        if (uid !== null) {
            if (uid.product_list !== [])
                uid.product_list.forEach(async element => {
                    try {
                        let product = await Product.findOne({ product_id: element })
                        if (product === null)
                            product = await Product.create({ product_id: element })
                        product = await Product.findOneAndUpdate({ product_id: element }, {
                            product_catagories: [...new Set([...product.product_catagories, req.body.catagory_id])]
                        })
                        console.log(`Created Product ${element} at ${product._id}`)
                    } catch (err) {
                        console.log(err);
                    }
                });
            if (uid.child_catagories !== [])
                uid.child_catagories.forEach(async element => {
                    try {
                        let cat = await Catagory.findOne({ catagory_id: element })
                        if (cat === null)
                            cat = await Catagory.create({ catagory_id: element })
                        console.log(`Created Catagory ${element} at ${cat._id}`)
                    } catch (err) {
                        console.log(err)
                    }
                })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
        return;
    }
    res.json({ message: `Added ${req.body.catagory_id} as ${uid._id}` })
    return;
})
router.post('/product', async (req, res) => {
    let uid
    try {
        const product = new Product({
            product_id: req.body.product_id,
            product_catagories: req.body.product_catagories || [],
            product_name: req.body.product_name || "",
            product_cost: req.body.product_cost || -1
        })
        uid = await product.save()
        if (uid !== null)
            if (uid.product_catagories !== [])
                uid.product_catagories.forEach(async element => {
                    try {
                        let catagory = await Catagory.findOne({ catagory_id: element })
                        if (catagory === null)
                            catagory = await Catagory.create({ catagory_id: element })
                        catagory = await Catagory.findOneAndUpdate({ catagory_id: element }, {
                            product_list: [... new Set([...catagory.product_list, req.body.product_id])]
                        })
                        console.log(`Created Catagory ${element} at ${catagory.catagory_id}`)
                    } catch (err) {
                        console.log(err);
                    }
                })
    } catch (err) {
        res.status(500).json({ message: err.message })
        return;
    }
    res.json({ message: `Added ${req.body.product_id} as ${uid._id}` })
    return;
})

//Update
router.patch('/catagory/:id', async (req, res) => {
    let uid
    try {
        let catagory = await Catagory.findOne({ catagory_id: parseInt(req.body.catagory_id, 10) })
        let newProd = [...req.body.product_list.filter(e => parseInt(e, 10))]
        let oldProd = [...catagory.product_list.filter(e => parseInt(e, 10))]
        oldProd = oldProd.filter(item => !newProd.includes(item))
        if (oldProd !== [])
            oldProd.forEach(async e => {
                try {
                    let prod = await Product.findOne({ product_id: e })
                    await Product.findOneAndUpdate({ product_id: e }, {
                        product_catagories: prod.product_catagories.filter(p => p !== parseInt(req.body.catagory_id, 10))
                    })
                } catch (err) {
                    console.log(err)
                }
            })
        catagory = await Catagory.findOneAndUpdate({ catagory_id: parseInt(req.body.catagory_id, 10) }, {
            child_catagories: [...req.body.child_catagories.filter(e => parseInt(e, 10))],
            product_list: newProd
        })
        if (catagory.child_catagories !== [])
            catagory.child_catagories.forEach(async element => {
                try {
                    let cat = await Catagory.findOne({ catagory_id: element })
                    if (cat === null)
                        cat = await Catagory.create({ catagory_id: element })
                    console.log(`Created Catagory ${element} at ${cat._id}`)
                } catch (err) {
                    console.log(err)
                }
            })
        if (newProd !== [])
            newProd.forEach(async e => {
                try {
                    let prod = await Product.findOne({ product_id: e })
                    if (prod === null)
                        prod = await Product.create({ product_id: e })
                    await Product.findOneAndUpdate({ product_id: e }, {
                        product_catagories: [...new Set([...prod.product_catagories, parseInt(req.body.catagory_id, 10)])]
                    })
                    console.log(`Created Product ${element} at ${prod._id}`)
                } catch (err) {
                    console.log(err)
                }
            })
        uid = catagory
    } catch (err) {
        res.status(500).json({ message: err.message })
        return;
    }
    // res.json({ message: 'arigathanks' })
    res.json({ message: `Added ${req.body.product_id} as ${uid._id}` })
    return;
})
router.patch('/product/:id', async (req, res) => {
    let uid
    try {
        let product = await Product.findOne({ product_id: parseInt(req.body.product_id, 10) })
        let newCat = [...req.body.product_catagories.filter(e => parseInt(e, 10))]
        let oldCat = [...product.product_catagories.filter(e => parseInt(e, 10))]
        oldCat = oldCat.filter(item => !newCat.includes(item))
        if (oldCat !== [])
            oldCat.forEach(async e => {
                try {
                    let cat = await Catagory.findOne({ catagory_id: e })
                    await Catagory.findOneAndUpdate({ catagory_id: e }, {
                        product_list: cat.product_list.filter(p => p !== parseInt(req.body.product_id, 10))
                    })
                    console.log(`Removed Product ${req.body.product_id} from Catagory ${e}`)
                } catch (err) {
                    console.log(err)
                }
            })
        product = await Product.findOneAndUpdate({ product_id: parseInt(req.body.product_id, 10) }, {
            product_catagories: newCat,
            product_name: req.body.product_name || product.product_name,
            product_cost: req.body.product_cost || product.product_cost
        })
        if (newCat !== [])
            newCat.forEach(async element => {
                try {
                    let cat = await Catagory.findOne({ catagory_id: element })
                    if (cat === null)
                        cat = await Catagory.create({ catagory_id: element })
                    cat = await Catagory.findOneAndUpdate({ catagory_id: element }, {
                        product_list: [... new Set([...cat.product_list, req.body.product_id])]
                    })
                    console.log(`Added Product ${req.body.product_id} to Catagory ${cat.catagory_id}`)
                } catch (err) {
                    console.log(err);
                }
            })
        uid = product
    } catch (err) {
        res.status(500).json({ message: err.message })
        return;
    }
    // res.json({message: "Done"})
    res.json({ message: `Updated ${req.body.product_id} as ${uid._id}` })
    return;
})

//Delete
router.delete('/catagory/:id', async (req, res) => {
    let catagory
    try {
        catagory = await Catagory.findOne({ catagory_id: req.params.id })
        if (catagory === null) res.status(404).json('Catagory ID not found')
        else {
            catagory = await Catagory.findOneAndDelete({ catagory_id: req.params.id })
            res.json({ message: "Success" })
            catagory.product_list.forEach(async element => {    //Remove Catagory from Product
                let product
                try {
                    product = await Product.findOne({ product_id: element })
                    product = await Product.findOneAndUpdate({ product_id: element }, {
                        product_catagories: product.product_catagories.filter(cat => cat !== parseInt(req.params.id, 10))
                    })
                } catch (err) {
                    console.log(err)
                }
            })

            parent = await Catagory.find({ child_catagories: { $in: [req.params.id] } })
            console.log(parent)
            parent.forEach(async o => {
                try {
                    await Catagory.findOneAndUpdate({ catagory_id: o.catagory_id }, {
                        child_catagories: o.child_catagories.filter(c => c !== parseInt(req.params.id, 10))
                    })
                    console.log(`Updated ${o.catagory_id}`)
                } catch (err) {
                    console.log(err)
                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.delete('/product/:id', async (req, res) => {
    try {
        const product = await Product.findOne({ product_id: req.params.id })
        if (product === null) res.status(404).json('Product ID not found')
        else {
            await Product.findOneAndDelete({ product_id: req.params.id })
            res.json({ message: "Success" })
            product.product_catagories.forEach(async element => {
                let catagory
                try {
                    catagory = await Catagory.findOne({ catagory_id: element })
                    catagory = await Catagory.findOneAndUpdate({ catagory_id: element }, {
                        product_list: catagory.product_list.filter(prod => prod !== parseInt(req.params.id, 10))
                    })
                } catch (err) {

                }
            })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router