import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Select,
  MenuItem,
  Paper
} from "@mui/material";

import { getUsers, deleteUser, updateUserRole } from "../services/adminService";
import { AuthContext } from "../context/AuthContext";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const { user: loggedInUser } = useContext(AuthContext);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to load users", error);
      alert("Admin access denied or server error");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRole(id, newRole);
      loadUsers();
    } catch (error) {
      console.error("Role update failed", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin - Users</h2>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Action</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>

                {/* 🔥 Editable Role */}
                <TableCell>
                  <Select
                    size="small"
                    value={u.role}
                    disabled={u._id === loggedInUser?.id} // prevent changing your own role
                    onChange={(e) =>
                      handleRoleChange(u._id, e.target.value)
                    }
                  >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    disabled={u._id === loggedInUser?.id} // prevent deleting yourself
                    onClick={() => handleDelete(u._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

export default AdminUsers;
