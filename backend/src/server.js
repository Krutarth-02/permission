require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const permissionRoutes = require("../routes/permission.route.js");

app.use("/api/permissions", permissionRoutes);

app.listen(PORT, () => {
  console.log(`-----------------------------`);
  console.log(`PORT listening on ${PORT}...`);
  console.log(`-----------------------------`);
});