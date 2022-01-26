import React, { useEffect, useState } from 'react';

function Product({ navigate }) {
    const [showForm, setShowForm] = useState(false)
    const [editForm, setEditForm] = useState(false)
    const [products, setProducts] = useState([])

    const [pID, setPID] = useState("")
    const [pName, setPName] = useState("")
    const [pCost, setPCost] = useState("")
    const [pCat, setPCat] = useState("")

    useEffect(() => {
        fetch("/api/product")
            .then((res) => res.json())
            .then((products) => setProducts(products));
    }, []);

    const handleShowForm = () => {
        setEditForm(false)
        setShowForm(!showForm)
    }

    const submitProduct = async (e) => {
        e.preventDefault()
        if (parseInt(pID, 10) < 10) {
            alert("Product ID must be an integer value > 10")
        }
        let product_catagories = []
        if (pCat) product_catagories = pCat.split(",").map(i => Number(i))
        const submitRequest = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: parseInt(pID, 10), product_catagories: product_catagories, product_cost: parseInt(pCost, 10), product_name: pName })
        }
        //Fetch
        console.log(submitRequest)
        await fetch("/api/product/", submitRequest)
            .then((res) => res.json())
            .then((message) => console.log(message))
        setPID("")
        setPCat("")
        handleShowForm()
        await fetch("/api/product")
            .then((res) => res.json())
            .then((products) => setProducts(products));
    }

    const cancelEdit = () => {
        setPID("")
        setPCat("")
        setShowForm(false)
        setEditForm(false)
    }

    const handleEdit = (e) => {
        console.log(e.target.value)
        setShowForm(false)
        setEditForm(true)
        setPID(e.target.value)
        setPCat(products.find(p => p.product_id === parseInt(e.target.value, 10)).product_catagories.join(','))
        setPCost(products.find(p => p.product_id === parseInt(e.target.value, 10)).product_cost)
        setPName(products.find(p => p.product_id === parseInt(e.target.value, 10)).product_name)
    }

    const requestEdit = async (e) => {
        e.preventDefault()
        let product_catagories = []
        if (pCat) product_catagories = pCat.split(",").map(i => Number(i))
        const submitRequest = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: parseInt(pID, 10), product_catagories: product_catagories, product_cost: parseInt(pCost, 10), product_name: pName })
        }
        console.log(submitRequest) //fetch
        await fetch('/api/product/' + pID, submitRequest)
            .then((res) => res.json())
            .then((message) => console.log(message.message))
        cancelEdit() //Viewport Update Only
        await fetch("/api/product")
            .then((res) => res.json())
            .then((products) => setProducts(products));
    }

    const requestDelete = async (e) => {
        if (!confirm(`Really Delete 'Product ID: ${e.target.value}'? This action is irreversible!`)) return;
        console.log(`Deleting ${e.target.value}`)
        await fetch("/api/product/" + e.target.value, { method: 'DELETE' })
            .then((res) => res.json())
            .then((message) => console.log(message))
        await fetch("/api/product")
            .then((res) => res.json())
            .then((products) => setProducts(products));
    }

    return (
        <div className="container">
            <div className="d-flex gap-2 btn-toolbar justify-content-between">
                <div className="btn-group">
                    <div onClick={navigate} >
                        <h3 className='p-2 alt-hover'>Category</h3>
                    </div>
                    <h3 className='p-2 text-danger border-bottom border-danger border-4' >Product</h3>
                </div>
                <div>
                    <button className="btn btn-dark" type='button' onClick={handleShowForm}>{showForm ? 'Close' : 'Add Product'}</button>
                </div>
            </div>
            {showForm && <div className="container border-top border-bottom">
                <form onSubmit={submitProduct}>
                    <div className="p-2 d-block text-center">
                        <span className='text-danger'>Add new product</span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">ID</span>
                        <input type="text" className='form-control' id="product_id" value={pID} placeholder='Product ID' onChange={(e) => { setPID(e.target.value.replace(/[^0-9]/, "")) }} required />
                        <button className='btn btn-outline-danger' type='submit'>Submit</button>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Name</span>
                        <input type="text" id="name" placeholder='Product Name' value={pName} maxLength={20} onChange={(e) => { setPName(e.target.value.replace(/[^0-9a-zA-Z/ ]/, "")) }} className="form-control" />
                        <span className="input-group-text">Cost</span>
                        <input type="text" id="cost" placeholder="Cost" value={pCost} onChange={(e) => { setPCost(e.target.value.replace(/[^0-9]/, ""))}} className="form-control" />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Catagories</span>
                        <input type="text" id="catagories" placeholder='[ product_catagories ]' value={pCat} onChange={(e) => { setPCat(e.target.value.replace(/[^0-9,]/, "")) }} className="form-control" />
                    </div>
                </form>
            </div>}
            {editForm && <div className="container border-top border-bottom">
                <form onSubmit={requestEdit}>
                    <div className="p-2 d-block text-center">
                        <span className='text-danger'>Edit product</span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">ID</span>
                        <input type="text" className='form-control' id="product_id" value={pID} placeholder='Product ID' disabled />
                        <button className='btn btn-outline-info' type='submit'>Update</button>
                        <button type="submit" className="btn btn-danger" onClick={cancelEdit}>Cancel</button>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Name</span>
                        <input type="text" id="name" placeholder='Product Name' value={pName} maxLength={20} onChange={(e) => { setPName(e.target.value.replace(/[^0-9a-zA-Z/ ]/, "")) }} className="form-control" />
                        <span className="input-group-text">Cost</span>
                        <input type="text" id="cost" placeholder="Cost" value={pCost} onChange={(e) => { setPCost(e.target.value.replace(/[^0-9]/, ""))}} className="form-control" />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Catagories</span>
                        <input type="text" id="catagories" placeholder='[ product_catagories ]' value={pCat} onChange={(e) => { setPCat(e.target.value.replace(/[^0-9,]/, "")) }} className="form-control" />
                    </div>
                </form>
            </div>}
            <div className="container p-2">
                <div className="list-group">
                    {products.map((product) => (
                        <details className="list-group-item " key={product._id}>
                            <summary className='font-monospace'>Product: {product.product_name} Cost: {product.product_cost}</summary>
                            <div className="p-2">
                                <p className='font-monospace'>
                                    <span className='font-monospace'>ID: </span> {product.product_id} <span className='font-monospace'>Catagories: </span>[ {product.product_catagories.toString()} ]
                                </p>
                                <div className="d-flex gap-2 float-end">
                                    <button type='submit' value={product.product_id} className='btn btn-sm btn-outline-info' onClick={handleEdit}>Edit</button>
                                    <button type='submit' value={product.product_id} className='btn btm-sm btn-outline-danger' onClick={requestDelete}>Delete</button>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Product;
