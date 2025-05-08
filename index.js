const path = require("path");
const express = require("express");
const producten = require("./producten.json"); // Loads productdata

const app = express();
const port = 3000;

app.use(express.json()); // Middleware  JSON
app.use(express.static("./"))


let products = JSON.parse(JSON.stringify(producten)); // Werkbare kopie van productdata

// ___________________________________\\
// FRONTEND ROUTES - HTML pages
// ___________________________________\\

// Homepage - Product overview
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./overview.html"));
});

// Shopping cart page
app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "./cart.html"));
});

// Admin overview
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "./admin-overview.html"));
});

// Admin add product form
app.get("/admin/add", (req, res) => {
  res.sendFile(path.join(__dirname, "./admin-add.html"));
});

// Admin edit product form
app.get("/admin/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "./admin-edit.html"));
});

// ---------------------------
// API ENDPOINTS (JSON data)
// ---------------------------

// Get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Add new product
app.post("/products", (req, res) => {
  req.body.id = products.length + 1; // Auto-increment ID
  products.push(req.body);
  res.status(201).send(); // 201 Created

});

// Reset products to original state
app.post("/products/reset", (req, res) => {
  products = JSON.parse(JSON.stringify(producten));
  res.sendStatus(200);
});

// Get single product by ID
app.get("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  product ? res.json(product) : res.sendStatus(404);
});

// Delete product by ID
app.delete("/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);

  if (index > -1) {
    products.splice(index, 1);
    res.sendStatus(204); // 204 No Content
  } else {
    res.sendStatus(404);
  }
});

// Update product price by ID
app.patch("/products/:id", (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.sendStatus(404);

  product.price = Number(req.body.price);
  res.json(product);
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
