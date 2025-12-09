import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Paper,
  Box,
  useMediaQuery,
} from "@mui/material";

const roles = [
  "Everyone",
  "Authenticated Users",
  "Anzo Administrator",
  "Data Analyst",
  "Data Citizen",
  "Data Curator",
  "Data Governor",
  "Data Scientist",
];

const permissionSections = {
  Default: [
    "Browse Dashboards",
    "Browse Models",
    "Create Dashboards",
    "Create Graphmarts",
    "Data On Demand",
    "Import Artifacts",
    "Manage Graphmarts",
    "Manage Models",
    "Show Query Builder",
    "View Datasets",
    "View Graphmarts",
  ],
  Administration: [
    "Administer System Setup",
    "Anzo Admin",
    "Batch Direct Data Loading",
    "Manage Anzo Unstructured Cluster",
  ],
};

export default function App() {
  const isMobile = useMediaQuery("(max-width: 800px)");

  const [permissionsState, setPermissionsState] = useState({});
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // LOAD PERMISSIONS FROM BACKEND
  // -------------------------------
  const loadPermissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/permissions");
      const data = await res.json();

      if (data && data.rows) {
        const formatted = {};
        data.rows.forEach((row) => {
          formatted[row.permission] = row.roles;
        });

        setPermissionsState(formatted);
      } else {
        initializeDefaultState();
      }
    } catch (err) {
      console.error("Failed to load permissions:", err);
      initializeDefaultState();
    }

    setLoading(false);
  };

  // Create initial empty permission matrix if backend is empty
  const initializeDefaultState = () => {
    const state = {};
    Object.keys(permissionSections).forEach((section) => {
      permissionSections[section].forEach((perm) => {
        state[perm] = {};
        roles.forEach((role) => {
          state[perm][role] = false;
        });
      });
    });
    setPermissionsState(state);
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // -------------------------------
  // SAVE TO BACKEND
  // -------------------------------
  const saveToServer = async (newState) => {
    const payload = {
      rows: Object.keys(newState).map((perm) => ({
        permission: perm,
        roles: newState[perm],
      })),
    };

    try {
      await fetch("http://localhost:5000/api/permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to update permissions:", err);
    }
  };

  // -------------------------------
  // HANDLE CHECKBOX TOGGLE
  // -------------------------------
  const handleToggle = (perm, role) => {
    const updated = {
      ...permissionsState,
      [perm]: {
        ...permissionsState[perm],
        [role]: !permissionsState[perm][role],
      },
    };

    setPermissionsState(updated);
    saveToServer(updated);
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Permissions
      </Typography>

      {/* Desktop / Tablet */}
      {!isMobile && (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Permissions</TableCell>
                {roles.map((role) => (
                  <TableCell key={role} align="center" sx={{ fontWeight: "bold" }}>
                    {role}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.keys(permissionSections).map((section) => (
                <React.Fragment key={section}>
                  <TableRow>
                    <TableCell
                      colSpan={roles.length + 1}
                      sx={{
                        background: "#f5f5f5",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {section}
                    </TableCell>
                  </TableRow>

                  {permissionSections[section].map((perm) => (
                    <TableRow key={perm}>
                      <TableCell>{perm}</TableCell>

                      {roles.map((role) => (
                        <TableCell key={role} align="center">
                          <Checkbox
                            checked={permissionsState[perm][role]}
                            onChange={() => handleToggle(perm, role)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile Version */}
      {isMobile && (
        <Box>
          {Object.keys(permissionSections).map((section) => (
            <Box key={section} sx={{ mb: 3 }}>
              <Typography
                sx={{
                  fontWeight: "bold",
                  background: "#f5f5f5",
                  p: 1.5,
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                {section}
              </Typography>

              {permissionSections[section].map((perm) => (
                <Paper key={perm} sx={{ p: 2, mb: 2 }}>
                  <Typography sx={{ fontWeight: 600, mb: 1 }}>{perm}</Typography>

                  {roles.map((role) => (
                    <Box
                      key={role}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 0.5,
                      }}
                    >
                      <Typography>{role}</Typography>
                      <Checkbox
                        checked={permissionsState[perm][role]}
                        onChange={() => handleToggle(perm, role)}
                      />
                    </Box>
                  ))}
                </Paper>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
