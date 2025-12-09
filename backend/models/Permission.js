const mongoose = require("mongoose");

const roleFields = {
  Everyone: { type: Boolean, default: true },
  "Authenticated Users": { type: Boolean, default: true },
  "Anzo Administrator": { type: Boolean, default: true },
  "Data Analyst": { type: Boolean, default: true },
  "Data Citizen": { type: Boolean, default: true },
  "Data Curator": { type: Boolean, default: true },
  "Data Governor": { type: Boolean, default: true },
  "Data Scientist": { type: Boolean, default: true },
};

const PermissionRowSchema = new mongoose.Schema({
  permission: { type: String, required: true },
  roles: roleFields,
});

const PermissionMatrixSchema = new mongoose.Schema(
  {
    rows: [PermissionRowSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("PermissionMatrix", PermissionMatrixSchema);
