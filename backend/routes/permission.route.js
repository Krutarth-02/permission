const express = require("express");
const { getPermissions, updatePermissions } = require("../controllers/permission.controller.js");

const router = express.Router();

router.get("/", getPermissions);
router.put("/", updatePermissions);

module.exports = router;
