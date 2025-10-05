import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";

function MemberManagement() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ ownership: "", status: "", block: "" });
  const [openForm, setOpenForm] = useState(false);
  const [openView, setOpenView] = useState(null);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("/members.json")
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch((err) => console.error("Failed to load member data", err));
  }, []);

  const handleSearch = (e) => setSearch(e.target.value.toLowerCase());

  const filteredMembers = members.filter((m) =>
    (m.fullName.toLowerCase().includes(search) ||
      m.flat.toLowerCase().includes(search) ||
      m.memberNumber.toLowerCase().includes(search)) &&
    (!filter.ownership || m.ownership === filter.ownership) &&
    (!filter.status || m.status === filter.status) &&
    (!filter.block || m.block === filter.block)
  );

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (editingId) {
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...form, id: editingId } : m))
      );
    } else {
      const newMember = {
        ...form,
        id: Date.now(),
        memberNumber: `M${Date.now().toString().slice(-4)}`,
      };
      setMembers((prev) => [...prev, newMember]);
    }
    setOpenForm(false);
    setForm({});
    setEditingId(null);
  };

  const handleEdit = (member) => {
    setForm(member);
    setEditingId(member.id);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Member Management
      </Typography>

      {/* Search & Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <TextField
          label="Search by name, flat, or ID"
          onChange={handleSearch}
          sx={{ minWidth: 200 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Ownership</InputLabel>
          <Select
            value={filter.ownership}
            onChange={(e) => setFilter({ ...filter, ownership: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Owner">Owner</MenuItem>
            <MenuItem value="Tenant">Tenant</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Block</InputLabel>
          <Select
            value={filter.block}
            onChange={(e) => setFilter({ ...filter, block: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="A">A</MenuItem>
            <MenuItem value="B">B</MenuItem>
            <MenuItem value="C">C</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => setOpenForm(true)} sx={{ ml: "auto" }}>
          Add Member
        </Button>
      </Box>

      {/* Member Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Member #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Block</TableCell>
              <TableCell>Flat</TableCell>
              <TableCell>Ownership</TableCell>
              <TableCell>Rental</TableCell>
              <TableCell>Family</TableCell>
              <TableCell>Join Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dues</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.memberNumber}</TableCell>
                <TableCell>{m.fullName}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>{m.email}</TableCell>
                <TableCell>{m.block}</TableCell>
                <TableCell>{m.flat}</TableCell>
                <TableCell>{m.ownership}</TableCell>
                <TableCell>{m.rentalStatus}</TableCell>
                <TableCell>{m.familyCount}</TableCell>
                <TableCell>{m.joinDate}</TableCell>
                <TableCell>{m.status}</TableCell>
                <TableCell>{m.dues}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setOpenView(m)}>
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(m)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(m.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Member Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth>
        <DialogTitle>{editingId ? "Edit Member" : "Add New Member"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Full Name" name="fullName" value={form.fullName || ""} onChange={handleFormChange} required />
          <TextField label="Phone" name="phone" value={form.phone || ""} onChange={handleFormChange} required />
          <TextField label="Email" name="email" value={form.email || ""} onChange={handleFormChange} required />
          <TextField label="Block" name="block" value={form.block || ""} onChange={handleFormChange} required />
          <TextField label="Flat Number" name="flat" value={form.flat || ""} onChange={handleFormChange} required />
          <FormControl>
            <InputLabel>Ownership</InputLabel>
            <Select name="ownership" value={form.ownership || ""} onChange={handleFormChange}>
              <MenuItem value="Owner">Owner</MenuItem>
              <MenuItem value="Tenant">Tenant</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Rental Status</InputLabel>
            <Select name="rentalStatus" value={form.rentalStatus || ""} onChange={handleFormChange}>
              <MenuItem value="Self-Occupied">Self-Occupied</MenuItem>
              <MenuItem value="Rented">Rented</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Family Members Count" type="number" name="familyCount" value={form.familyCount || ""} onChange={handleFormChange} required />
          <TextField label="Joining Date" type="date" name="joinDate" value={form.joinDate || ""} onChange={handleFormChange} InputLabelProps={{ shrink: true }} required />
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status || ""} onChange={handleFormChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Due Payments" name="dues" value={form.dues || ""} onChange={handleFormChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddOrUpdate}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Member Dialog */}
      <Dialog open={Boolean(openView)} onClose={() => setOpenView(null)} fullWidth>
        <DialogTitle>Member Details</DialogTitle>
        <DialogContent>
          {openView &&
            Object.entries(openView).map(([key, value]) => (
              <Typography key={key}>
                <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {value}
              </Typography>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MemberManagement;
