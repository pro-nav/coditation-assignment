# CODITATION ASSIGNMENT

Pranav Dudhane ([@pro-nav](https://www.github.com/pro-nav)) 

Only Backend and APIs (for frontend and backend check `-main` branch)

# Dependencies

MongoDB installed on system is preferred, alternativly use MongoDB Atlas

Preferred NodeJS version is `16.x`
- MongoDB
- Express
- Mongoose
- NodeJS

## Run Locally

Clone the project

```bash
git clone -b no-frontend https://github.com/pro-nav/coditation-assignment.git
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

## API Reference


### Test server status
Returns `{ message: "Server is online" }`

```http
  GET http://localhost:3001/api/ 
```


### Get all categories
Returns array with available categories

```http
  GET http://localhost:3001/api/category
```

### Get category with id
Returns requested category as a JSON Object if unavailable returns `null`
```http
  GET http://localhost:3001/api/category/${id}
```


### Get all products
Returns array with available products
```http
  GET http://localhost:3001/api/product
```

### Get product with id
Returns requested product as a JSON Object if unavailable returns `null`
```http
  GET http://localhost:3001/api/product/${id}
```

### Get products by category id
Returns array with products in requested catagory
```http
  GET http://localhost:3001/api/product/c/${id}
```

### Add a category
Creates a category with specified parameters and returns as a JSON Object
```http
POST http://localhost:3001/api/category
Content-Type: application/json

{
    "parent": {Category ObjectID},              #OPTIONAL Defaults to null
    "child_catagories":[{Catagory ObjectID}],   #OPTIONAL Defaults to []
    "product_list":[{Product ObjectID}]         #OPTIONAL Defaults to []
}
```

### Add a product
Creates a product with specified parameters and returns as a JSON Object
```http
POST http://localhost:3001/api/category
Content-Type: application/json

{
    "product_name": "String(MAX_LENGTH 25)"     #OPTIONAL Defaults to Product XXXX
    "product_cost": INT,                        #OPTIONAL Defaults to -1
    "product_catagories":[{Catagory ObjectID}]  #OPTIONAL Defaults to []
}
```
### Update a category
Updates the requested category with specified parameters and returns as a JSON Object
```http
POST http://localhost:3001/api/category/${id}
Content-Type: application/json

{
    "parent": {Category ObjectID},
    "child_catagories":[{Catagory ObjectID}],
    "product_list":[{Product ObjectID}]
}
```
### Update a product
Updates the requested product with specified parameters and returns as a JSON Object
```http
POST http://localhost:3001/api/product/${id}
Content-Type: application/json

{
    "product_name": "String(MAX_LENGTH 25)"
    "product_cost": INT,
    "product_catagories":[{Catagory ObjectID}]
}
```
### Delete a category
Deletes the requested Category and returns status 200 if successful, 404 if Category not found
```http
DELETE http://localhost:3001/api/category/${id}

```
### Delete a product
Deletes the requested product and returns status 200 if successful, 404 if product not found

```http
DELETE http://localhost:3001/api/product/${id}
```

Feel free to contact via email pranavsd152@gmail.com or call [+91-(774)-387-1556](tel:7743871556)

