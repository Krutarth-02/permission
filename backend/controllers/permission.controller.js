const PermissionMatrix = require("../models/Permission.js");

// GET matrix
exports.getPermissions = async (req, res) => {
  try {
    const matrix = await PermissionMatrix.findOne();
    res.json(matrix);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE matrix
exports.updatePermissions = async (req, res) => {
  try {
    let matrix = await PermissionMatrix.findOne();

    if (!matrix) {
      matrix = new PermissionMatrix({ rows: req.body.rows });
    } else {
      matrix.rows = req.body.rows;
    }

    await matrix.save();
    res.json({ message: "Permissions updated", matrix });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};
