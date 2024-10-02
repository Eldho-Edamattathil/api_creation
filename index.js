const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Reading products from the JSON file
    let products = fs.readFileSync("./products.json", "utf-8");

    if (parsedUrl.pathname === "/products" && req.method === "GET" && parsedUrl.query.id === undefined) {
        // Return all products
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        res.end(products);
    } 
    else if (parsedUrl.pathname === "/products" && req.method === "GET" && parsedUrl.query.id !== undefined) {
        // Return specific product by ID
        let productArray = JSON.parse(products);
        let product = productArray.find((product) => {
            return product.id === Number(parsedUrl.query.id);
        });

        if (product) {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(product));
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 404;
            res.end(JSON.stringify({ "message": "Product Not Found" }));
        }
    }
    // POST request to add new product
    else if (parsedUrl.pathname === "/products" && req.method === "POST") {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let newProduct = JSON.parse(body);
            let productArray = JSON.parse(products);
            productArray.push(newProduct);

            fs.writeFileSync("./products.json", JSON.stringify(productArray, null, 2), "utf-8");

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 201;
            res.end(JSON.stringify(newProduct));
        });
    }
    // DELETE request to remove product by ID
    else if (parsedUrl.pathname === "/products" && req.method === "DELETE") {
        let id = Number(parsedUrl.query.id);
        let productArray = JSON.parse(products);
        let productIndex = productArray.findIndex((product) => product.id === id);

        if (productIndex !== -1) {
            productArray.splice(productIndex, 1);
            fs.writeFileSync("./products.json", JSON.stringify(productArray, null, 2), "utf-8");

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ "message": "Product deleted successfully" }));
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 404;
            res.end(JSON.stringify({ "message": "Product Not Found" }));
        }
    }
    // PUT request to update product by ID
    else if (parsedUrl.pathname === "/products" && req.method === "PUT") {
        let id = Number(parsedUrl.query.id);
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let updatedProduct = JSON.parse(body);
            let productArray = JSON.parse(products);
            let productIndex = productArray.findIndex((product) => product.id === id);

            if (productIndex !== -1) {
                // Replace the existing product with the updated one
                productArray.splice(productIndex, 1, updatedProduct);
                fs.writeFileSync("./products.json", JSON.stringify(productArray, null, 2), "utf-8");

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(JSON.stringify({ "message": "Product updated successfully" }));
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 404;
                res.end(JSON.stringify({ "message": "Product Not Found" }));
            }
        });
    } 
    else {
        res.statusCode = 400;
        res.end(JSON.stringify({ "message": "Bad Request" }));
    }
});

app.listen(6000, () => {
    console.log('Server is running on port 6000');
});
