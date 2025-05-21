const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: "true"
    })
);

mongoose
  .connect(
    "mongodb+srv://adityagarg:adityagarg@cluster0.nrepxpj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

  app.use('/api/tasks', require('./routes/tasks'));
app.get('/', (req, res) => {
    res.send('Hello from Node.js backend!');
  });

  
  app.listen(port, () => {
    console.log(`Server running on port 5000`);
  });
  