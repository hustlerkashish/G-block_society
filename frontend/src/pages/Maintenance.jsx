import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, TextField, MenuItem
} from "@mui/material";

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ memberId: "", month: "", amount: "", dueDate: "" });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const res = await axios.get("http://localhost:5000/api/maintenance");
    setRecords(res.data);
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/maintenance", form);
    setForm({ memberId: "", month: "", amount: "", dueDate: "" });
    fetchRecords();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/maintenance/${id}`, { status });
    fetchRecords();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Maintenance & Billing</Typography>

      {/* Form */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Member ID"
          value={form.memberId}
          onChange={(e) => setForm({ ...form, memberId: e.target.value })}
        />
        <TextField
          label="Month"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
        />
        <TextField
          label="Amount"
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <TextField
          label="Due Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <Button variant="contained" onClick={handleSubmit}>Add</Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Member</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.memberId?.username || row.memberId}</TableCell>
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{new Date(row.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => updateStatus(row._id, "Paid")} color="success">Mark Paid</Button>
                  <Button onClick={() => updateStatus(row._id, "Unpaid")} color="error">Mark Unpaid</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
