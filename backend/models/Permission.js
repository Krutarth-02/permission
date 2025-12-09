import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema({
  role: { type: String, required: true },
  allowed: { type: Boolean, default: false }
});

const permissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rolePermissions: [rolePermissionSchema]
});

const permissionGroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  permissions: [permissionSchema]
}, { timestamps: true });

export default mongoose.model("PermissionGroup", permissionGroupSchema);