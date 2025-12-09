import express from "express";
import PermissionGroup from "../models/PermissionGroup.js";

const router = express.Router();

/* -------------------------------------------------------
   1️⃣ GET ALL PERMISSION GROUPS 
   (Loads full table for frontend)
------------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const groups = await PermissionGroup.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------
   2️⃣ UPDATE A SINGLE CHECKBOX 
   (Update “allowed” for ONE role in ONE permission)
------------------------------------------------------- */
router.patch("/:groupId/:permissionId/:roleName", async (req, res) => {
  try {
    const { groupId, permissionId, roleName } = req.params;
    const { allowed } = req.body;

    const group = await PermissionGroup.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const permission = group.permissions.id(permissionId);
    if (!permission) return res.status(404).json({ error: "Permission not found" });

    const rolePerm = permission.rolePermissions.find(r => r.role === roleName);
    if (!rolePerm) return res.status(404).json({ error: "Role not found" });

    rolePerm.allowed = allowed;

    await group.save();

    res.json({ message: "Updated successfully", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------
   3️⃣ UPDATE ENTIRE PERMISSION ROW 
   (For example: updating all roles in "Browse Dashboards")
------------------------------------------------------- */
router.put("/permission-row/:groupId/:permissionId", async (req, res) => {
  try {
    const { groupId, permissionId } = req.params;
    const { rolePermissions } = req.body;

    const group = await PermissionGroup.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    const permission = group.permissions.id(permissionId);
    if (!permission) return res.status(404).json({ error: "Permission not found" });

    permission.rolePermissions = rolePermissions;

    await group.save();

    res.json({ message: "Permission row updated", group });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------
   4️⃣ UPDATE ENTIRE GROUP 
   (If UI saves group at once)
------------------------------------------------------- */
router.put("/group/:groupId", async (req, res) => {
  try {
    const updatedGroup = await PermissionGroup.findByIdAndUpdate(
      req.params.groupId,
      req.body,
      { new: true }
    );

    res.json({ message: "Group updated", updatedGroup });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------------------------------
   5️⃣ SEED SAMPLE PERMISSION GROUP 
------------------------------------------------------- */
router.post("/seed", async (req, res) => {
  try {
    await PermissionGroup.deleteMany(); // Reset

    const sample = new PermissionGroup({
      groupName: "Default",
      permissions: [
        {
          name: "Browse Dashboards",
          rolePermissions: [
            { role: "Everyone", allowed: true },
            { role: "Authenticated Users", allowed: false },
            { role: "Amo Administrator", allowed: false },
            { role: "Data Analyst", allowed: true },
            { role: "Data Citizen", allowed: false }
          ]
        },
        {
          name: "Create Dashboards",
          rolePermissions: [
            { role: "Everyone", allowed: false },
            { role: "Authenticated Users", allowed: true },
            { role: "Amo Administrator", allowed: true },
            { role: "Data Analyst", allowed: false },
            { role: "Data Citizen", allowed: false }
          ]
        }
      ]
    });

    await sample.save();

    res.json({ message: "Sample seeded", sample });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;