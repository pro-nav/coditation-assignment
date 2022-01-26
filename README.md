
# CODITATION ASSIGNMENT

Pranav Dudhane ([@pro-nav](https://www.github.com/pro-nav)) 

Satck used: MERN
- MongoDB
- Express
- React
- NodeJS

# Dependencies

MongoDB installed on system is preferred, alternativly use MongoDB Atlas 

```bash
express
react
mongoose
bootstrap
```


## Run Locally

Clone the project

```bash
  git clone https://github.com/pro-nav/coditation-assignment.git
```

Go to the project directory

```bash
  cd coditation-assignment
```

Install dependencies

```bash
  npm install
```

Start the database server in another terminal window

```bash
mkdir database
mongod --dbpath=.
```

Start Express server with
```bash
npm start
```

Serve React build locally by 
```bash
npm run server
```

Open browser and navigate to [http://localhost:3000/](http://localhost:3000)

## Screenshots

![App Screenshot](https://github.com/pro-nav/coditation-assignment/blob/main/docs/ss_1.png?raw=true)


## API Reference

#### Test server status

```http
  GET http://localhost:3001/api/ 
```


#### Get all categories

```http
  GET http://localhost:3001/api/catagory
```

#### Get category with id

```http
  GET http://localhost:3001/api/catagory/${id}
```


#### Get all products

```http
  GET http://localhost:3001/api/product
```

#### Get product with id

```http
  GET http://localhost:3001/api/product/${id}
```
#### Add a catagory

```http
POST http://localhost:3001/api/catagory
Content-Type: application/json

{
    "catagory_id":16,
    "child_catagories":[11, 12, 13],
    "product_list":[101, 102, 103]
}
```

#### Add a product

```http
POST http://localhost:3001/api/catagory
Content-Type: application/json

{
    "product_id":123,
    "product_name": "Dairy Mikl"
    "product_cost":20,
    "product_catagories":[15, 16]
}
```
#### Update a catagory

```http
POST http://localhost:3001/api/catagory/${id}
Content-Type: application/json

{
    "child_catagories":[11, 12, 13],
    "product_list":[101, 102, 103]
}
```
#### Update a product
```http
POST http://localhost:3001/api/product/${id}
Content-Type: application/json

{
    "product_name": "Dairy Milk"
    "product_cost":20,
    "product_catagories":[15, 16]
}
```

#### Delete a catagory
```http
DELETE http://localhost:3001/api/catagory/${id}

```

#### Delete a product
```http
DELETE http://localhost:3001/api/product/${id}
```

Feel free to contact via email pranavsd152@gmail.com or call [+91-(774)-387-1556](tel:7743871556)

