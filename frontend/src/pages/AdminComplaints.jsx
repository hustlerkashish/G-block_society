import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, CircularProgress, useMediaQuery, useTheme,
  IconButton, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  Report as ReportIcon, CheckCircle as CheckIcon, Schedule as ScheduleIcon
} from '@mui/icons-material';
import api from '../utils/api';

function AdminComplaints({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [complaintForm, setComplaintForm] = useState({
    type: '',
    priority: 'medium',
    title: '',
    description: '',
    location: '',
    status: 'open'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/complaints');
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveComplaint = async () => {
    try {
      setLoading(true);
      if (selectedComplaint) {
        await api.put(`/complaints/${selectedComplaint._id}`, complaintForm);
        setSuccess('Complaint updated successfully');
      } else {
        await api.post('/complaints', complaintForm);
        setSuccess('Complaint created successfully');
      }
      setDialogOpen(false);
      fetchComplaints();
    } catch (err) {
      setError('Failed to save complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      default: return 'default';
    }
  };

  if (loading && complaints.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const openComplaints = complaints.filter(c => c.status === 'open');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Complaints Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReportIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="error.main">
                    {openComplaints.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open Complaints
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="success.main">
                    {resolvedComplaints.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ScheduleIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="info.main">
                    {complaints.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Requests
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Add Complaint
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Complaints Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>{complaint.title}</TableCell>
                    <TableCell>{complaint.type}</TableCell>
                    <TableCell>
                      <Chip label={complaint.status} color={getStatusColor(complaint.status)} size="small" />
                    </TableCell>
                    <TableCell>{complaint.location}</TableCell>
                    <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => {
                            setSelectedComplaint(complaint);
                            setComplaintForm({
                              type: complaint.type || '',
                              priority: complaint.priority || 'medium',
                              title: complaint.title || '',
                              description: complaint.description || '',
                              location: complaint.location || '',
                              status: complaint.status || 'open'
                            });
                            setDialogOpen(true);
                          }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Complaint Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedComplaint ? 'Edit Complaint' : 'Add New Complaint'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type"
                value={complaintForm.type}
                onChange={(e) => setComplaintForm({ ...complaintForm, type: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Status"
                value={complaintForm.status}
                onChange={(e) => setComplaintForm({ ...complaintForm, status: e.target.value })}
              >
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={complaintForm.title}
                onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={complaintForm.location}
                onChange={(e) => setComplaintForm({ ...complaintForm, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveComplaint} 
            variant="contained" 
            disabled={loading || !complaintForm.title}
          >
            {loading ? <CircularProgress size={20} /> : (selectedComplaint ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminComplaints; 