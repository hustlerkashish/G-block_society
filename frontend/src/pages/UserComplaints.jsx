import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, CircularProgress, useMediaQuery, useTheme,
  Divider, Paper, Fab
} from '@mui/material';
import {
  Add as AddIcon, Report as ReportIcon, Build as BuildIcon,
  Warning as WarningIcon, CheckCircle as CheckIcon,
  Schedule as ScheduleIcon, PriorityHigh as PriorityIcon
} from '@mui/icons-material';
import api from '../utils/api';

const complaintTypes = [
  { value: 'maintenance', label: 'Maintenance Issue', icon: <BuildIcon /> },
  { value: 'security', label: 'Security Concern', icon: <WarningIcon /> },
  { value: 'cleaning', label: 'Cleaning Service', icon: <ReportIcon /> },
  { value: 'electrical', label: 'Electrical Issue', icon: <BuildIcon /> },
  { value: 'plumbing', label: 'Plumbing Issue', icon: <BuildIcon /> },
  { value: 'parking', label: 'Parking Issue', icon: <ReportIcon /> },
  { value: 'noise', label: 'Noise Complaint', icon: <WarningIcon /> },
  { value: 'other', label: 'Other', icon: <ReportIcon /> }
];

const priorityLevels = [
  { value: 'low', label: 'Low', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'high', label: 'High', color: 'error' },
  { value: 'urgent', label: 'Urgent', color: 'error' }
];

function UserComplaints({ user }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [complaintForm, setComplaintForm] = useState({
    type: '',
    priority: 'medium',
    title: '',
    description: '',
    location: ''
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

  const handleSubmitComplaint = async () => {
    try {
      setLoading(true);
      await api.post('/complaints', complaintForm);
      setSuccess('Complaint submitted successfully');
      setDialogOpen(false);
      setComplaintForm({
        type: '',
        priority: 'medium',
        title: '',
        description: '',
        location: ''
      });
      fetchComplaints();
    } catch (err) {
      setError('Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorityLevels.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'default';
  };

  if (loading && complaints.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const openComplaints = complaints.filter(c => c.status === 'open');
  const inProgressComplaints = complaints.filter(c => c.status === 'in_progress');
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved');

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Complaints & Service Requests
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
                <ScheduleIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {inProgressComplaints.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
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
                <PriorityIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
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

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Complaints List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            My Complaints & Requests
          </Typography>
          
          {complaints.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No complaints submitted yet. Click the + button to submit a new complaint.
            </Typography>
          ) : (
            <List>
              {complaints.map((complaint, index) => (
                <React.Fragment key={complaint._id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6">
                            {complaint.title}
                          </Typography>
                          <Chip 
                            label={complaint.priority} 
                            color={getPriorityColor(complaint.priority)} 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Type: {complaintTypes.find(t => t.value === complaint.type)?.label}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Location: {complaint.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Submitted: {new Date(complaint.createdAt).toLocaleDateString()}
                          </Typography>
                          {complaint.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {complaint.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Chip 
                        label={complaint.status.replace('_', ' ')} 
                        color={getStatusColor(complaint.status)} 
                        size="small" 
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < complaints.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add complaint"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setDialogOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Submit Complaint Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Submit New Complaint</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Complaint Type"
                value={complaintForm.type}
                onChange={(e) => setComplaintForm({ ...complaintForm, type: e.target.value })}
              >
                {complaintTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center">
                      {type.icon}
                      <Typography sx={{ ml: 1 }}>{type.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Priority"
                value={complaintForm.priority}
                onChange={(e) => setComplaintForm({ ...complaintForm, priority: e.target.value })}
              >
                {priorityLevels.map((priority) => (
                  <MenuItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={complaintForm.title}
                onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={complaintForm.location}
                onChange={(e) => setComplaintForm({ ...complaintForm, location: e.target.value })}
                placeholder="Where is the issue located?"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Detailed Description"
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                placeholder="Please provide detailed information about the issue..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitComplaint} 
            variant="contained" 
            disabled={loading || !complaintForm.type || !complaintForm.title}
          >
            {loading ? <CircularProgress size={20} /> : 'Submit Complaint'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserComplaints; 