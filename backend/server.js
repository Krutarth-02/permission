const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const permissionRoutes = require("./routes/permission.route.js");
const errorHandler = require("./middleware/errorHandle.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// DB
connectDB();

// Routes
app.use("/api/permissions", permissionRoutes);

// Error middleware
app.use(errorHandler);

const PORT =  5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
