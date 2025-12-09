import React, { useState } from "react";
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

  const [permissionsState, setPermissionsState] = useState(() => {
    const state = {};
    Object.keys(permissionSections).forEach((section) => {
      permissionSections[section].forEach((perm) => {
        state[perm] = {};
        roles.forEach((role) => {
          state[perm][role] = false;
        });
      });
    });
    return state;
  });

  const handleToggle = async (perm, role) => {
    const newValue = !permissionsState[perm][role];

    setPermissionsState((prev) => ({
      ...prev,
      [perm]: { ...prev[perm], [role]: newValue },
    }));

    try {
      await fetch("https://your-api-url.com/permissions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission: perm, role, value: newValue }),
      });
    } catch (err) {
      console.error("API failed:", err);
    }
  };

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
