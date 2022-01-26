import React, { useEffect, useState } from 'react';

function Catagory({ navigate }) {
    const [showForm, setShowForm] = useState(false)
    const [editForm, setEditForm] = useState(false)
    const [catagories, setCatagories] = useState([])

    const [cID, setCID] = useState("")
    const [childID, setChildID] = useState("")
    const [pIDs, setPIDs] = useState("")

    useEffect(() => {
        fetch("/api/catagory")
            .then((res) => res.json())
            .then((catagories) => setCatagories(catagories));
    }, []);

    const handleShowForm = () => {
        setEditForm(false)
        setShowForm(!showForm)
    }

    const submitCatagory = async (e) => {
        e.preventDefault();
        if (parseInt(cID, 10) < 10) alert("Category ID must be an integer value > 10")
        let child_catagories = []
        if (childID) child_catagories = childID.split(",").map(i => Number(i))
        let product_list = []
        if (pIDs) product_list = pIDs.split(",").map(i => Number(i))
        const submitRequest = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catagory_id: parseInt(cID, 10), child_catagories: child_catagories, product_list: product_list })
        }
        //Fetch
        console.log(submitRequest)
        await fetch("/api/catagory/", submitRequest)
            .then((res) => res.json())
            .then((message) => console.log(message))
        setCID("")
        setChildID("")
        setPIDs("")
        handleShowForm()
        await fetch("/api/catagory")
            .then((res) => res.json())
            .then((catagories) => setCatagories(catagories));
    }

    const cancelEdit = () => {
        setCID("")
        setChildID("")
        setPIDs("")
        setShowForm(false)
        setEditForm(false)
    }

    const handleEdit = (e) => {
        console.log(e.target.value)
        setShowForm(false)
        setEditForm(true)
        setCID(e.target.value)
        setChildID(catagories.find(c => c.catagory_id === parseInt(e.target.value, 10)).child_catagories.join(','))
        setPIDs(catagories.find(c => c.catagory_id === parseInt(e.target.value, 10)).product_list.join(','))
    }

    const requestEdit = async (e) => {
        e.preventDefault()
        let child_catagories = []
        if (childID) child_catagories = childID.split(",").map(i => Number(i))
        let product_list = []
        if (pIDs) product_list = pIDs.split(",").map(i => Number(i))
        const submitRequest = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catagory_id: parseInt(cID, 10), child_catagories: child_catagories, product_list: product_list })
        }
        //Fetch
        console.log(submitRequest)
        await fetch('/api/catagory/' + cID, submitRequest)
            .then(res => res.json())
            .then(message => console.log(message))
        cancelEdit() //Viewport Update Only
        await fetch("/api/catagory")
            .then((res) => res.json())
            .then((catagories) => setCatagories(catagories));
    }

    const requestDelete = async (e) => {
        if (!confirm(`Really Delete 'Category ID: ${e.target.value}'? This action is irreversible!`)) return;
        console.log(`Deleting ${e.target.value}`)
        await fetch("/api/catagory/" + e.target.value, { method: 'DELETE' })
            .then((res) => res.json())
            .then((message) => console.log(message))
        await fetch("/api/catagory")
            .then((res) => res.json())
            .then((catagories) => setCatagories(catagories));
    }

    return (
        <div className="container">
            <div className="d-flex gap-2 btn-toolbar justify-content-between">
                <div className="btn-group">
                    <h3 className='p-2 text-danger border-bottom border-danger border-4'>Category</h3>
                    <div onClick={navigate} >
                        <h3 className='p-2 alt-hover' >Product</h3>
                    </div>
                </div>
                <div>
                    <button className="btn btn-dark" type='button' onClick={handleShowForm}>{showForm ? 'Close' : 'Add Category'}</button>
                </div>
            </div>
            {showForm && <div className="container border-top border-bottom">
                <form onSubmit={submitCatagory}>
                    <div className="p-2 d-block text-center">
                        <span className='text-danger'>Add new Category</span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">ID</span>
                        <input type="text" className='form-control' id="catagory_id" placeholder='Category ID' value={cID} onChange={(e) => { setCID(e.target.value.replace(/[^0-9]/, "")) }} required />
                        <button className='btn btn-outline-danger' type='submit' >Submit</button>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Child Catagories</span>
                        <input type="text" id="child_catagories" placeholder='[ child_catagories ]' value={childID} onChange={(e) => { setChildID(e.target.value.replace(/[^0-9,]/, "")) }} className="form-control" />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Products</span>
                        <input type="text" id="product_list" placeholder='[ product_ids ]' value={pIDs} onChange={(e) => { setPIDs(e.target.value.replace(/[^0-9,]/, "")) }} className="form-control" />
                    </div>
                </form>
            </div>}
            {editForm && <div className="container border-top border-bottom">
                <form onSubmit={requestEdit}>
                    <div className="p-2 d-block text-center">
                        <span className='text-danger'>Add new Category</span>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">ID</span>
                        <input type="text" className='form-control' id="catagory_id" placeholder='Catagory ID' value={cID} disabled />
                        <button className='btn btn-outline-info' type='submit'>Update</button>
                        <button className='btn btn-danger' onClick={cancelEdit}>Close</button>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Child Catagories</span>
                        <input type="text" id="child_catagories" placeholder='[ child_catagories ]' value={childID} onChange={(e) => { setChildID(e.target.value.replace(/[^0-9,]/, "")) }} className="form-control" />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Products</span>
                        <input type="text" id="product_list" placeholder='[ product_ids ]' value={pIDs} onChange={(e) => { setPIDs(e.target.value.replace(/[^0-9,]/, "")) }} className="form-control" />
                    </div>
                </form>
            </div>}
            <div className="container p-2">
                <div className="list-group">
                    {catagories.map((catagory) => (
                        <details className="list-group-item" key={catagory._id}>
                            <summary className='font-monospace gap-2'>Catagory ID: {catagory.catagory_id} </summary>
                            <div className="p-2">
                                <p className='font-monospace'>
                                    <span className='font-monospace'>Child Catagories: </span>[ {catagory.child_catagories.toString()} ]
                                </p>
                                <p className='font-monospace'>
                                    <span className='font-monospace'>Product IDs: </span>[ {catagory.product_list.toString()} ]
                                </p>
                                <div className="d-flex gap-2 float-end">
                                    <button type='button' value={catagory.catagory_id} className='btn btn-sm btn-outline-info' onClick={handleEdit}>Edit</button>
                                    <button type='button' value={catagory.catagory_id} className='btn btm-sm btn-outline-danger' onClick={requestDelete}>Delete</button>
                                </div>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Catagory;
