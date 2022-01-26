import React, { useState } from 'react';
import Catagory from './components/Catagory';
import Product from './components/Product';
import Tree from './components/Tree';

function App() {
  //make dynamic
  const database_url = 'mongodb://localhost:27017/api'
  const api_endpoint = '/api'

  const [nav, setNav] = useState(false)
  const handleNav = () => {
    setNav(!nav)
  }

  return (
    <div className='container border ' >
      <header className='p-2'>
        Viewing database at <code>{database_url}</code> via api endpoint <code>{api_endpoint}</code>
      </header>
      <hr />

      {!nav && <Catagory navigate={handleNav}/>}
      {nav && <Product navigate={handleNav}/>}
      
      <hr />
      <Tree />
    </div>
  )
}

export default App;
