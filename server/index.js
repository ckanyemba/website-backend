const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const register = require("./routes/register");
const login = require("./routes/login");
const productsRoute = require("./routes/products");
const eventsRoute = require("./routes/events");
const jewelleryCollectionsRoute = require("./routes/jewelleryCollections");
const thriftCollectionsRoute = require("./routes/thriftCollections");
const shoeCollectionsRoute = require("./routes/shoeCollections");
const articleCollectionsRoute = require("./routes/articleCollections");
const users = require("./routes/users");
const orders = require("./routes/orders");
const yocoPaymentRoute = require("./routes/yocoPayment"); // Import the new route

const app = express();
require("dotenv").config();

// Increase the JSON payload size limit
app.use(express.json({ limit: "10mb" }));
// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000',  //Specify the origin you want to allow
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify the methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'], // Specify the headers you want to allow
  credentials: true // Allow cookies to be sent with requests
}));

app.options('*', cors());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/products", productsRoute);
app.use("/api/events", eventsRoute);
app.use("/api/jewelleryCollections", jewelleryCollectionsRoute);
app.use("/api/thriftCollections", thriftCollectionsRoute);
app.use("/api/shoeCollections", shoeCollectionsRoute);
app.use("/api/articleCollections", articleCollectionsRoute);
app.use("/api/users", users);
app.use("/api/orders", orders);
app.use("/api/yocoPayment", yocoPaymentRoute); // Use the new route here

app.get("/", (req, res) => {
  res.send("Welcome to our online shop API...");
});

const uri = process.env.DB_URI;
const port = process.env.PORT || 5000;


app.listen(port, () => {
  console.log(`Server running on port: ${port}...`);
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connection established..."))
  .catch((error) => console.error("MongoDB connection failed:", error.message));
