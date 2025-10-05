import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, useMediaQuery, useTheme, IconButton, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Payment as PaymentIcon,
  AccountBalanceWallet as WalletIcon, 
  CheckCircle as CheckIcon, Warning as WarningIcon, Receipt as ReceiptIcon
} from '@mui/icons-material';
import api from '../utils/api';

function AdminMaintenance({ user }) {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [maintenanceForm, setMaintenanceForm] = useState({
    memberId: '', month: '', amount: '', dueDate: '', status: 'Unpaid'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintenanceRes, usersRes] = await Promise.all([
        api.get('/maintenance'),
        api.get('/auth/users')
      ]);
      console.log('Fetched maintenance records:', maintenanceRes.data); // Debug log
      console.log('Fetched users:', usersRes.data); // Debug log
      setMaintenanceRecords(maintenanceRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching data:', err); // Debug log
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMaintenance = () => {
    setSelectedRecord(null);
    setMaintenanceForm({
      memberId: '', month: '', amount: '', dueDate: '', status: 'Unpaid'
    });
    setMaintenanceDialogOpen(true);
  };

  const handleSaveMaintenance = async () => {
    try {
      setLoading(true);
      console.log('Saving maintenance record:', maintenanceForm); // Debug log
      
      if (selectedRecord) {
        await api.put(`/maintenance/${selectedRecord._id}`, maintenanceForm);
        setSuccess('Maintenance record updated successfully');
      } else {
        await api.post('/maintenance', maintenanceForm);
        setSuccess('Maintenance record created successfully');
      }
      setMaintenanceDialogOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving maintenance record:', err); // Debug log
      setError('Failed to save maintenance record');
    } finally {
      setLoading(false);
    }
  };



  const updateStatus = async (id, status) => {
    try {
      await api.put(`/maintenance/${id}`, { status });
      setSuccess('Status updated successfully');
      fetchData();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Unpaid': return 'error';
      case 'Overdue': return 'warning';
      default: return 'default';
    }
  };

  if (loading && maintenanceRecords.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Maintenance Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WalletIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="primary">
                    ₹{maintenanceRecords.reduce((sum, record) => sum + (record.amount || 0), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
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
                <WarningIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {maintenanceRecords.filter(r => r.status !== 'Paid').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Payments
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
                    {maintenanceRecords.filter(r => r.status === 'Paid').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Payments
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
                <ReceiptIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="info.main">
                    {users.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Members
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddMaintenance}>
          Add Maintenance Record for Resident
        </Button>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Maintenance Records Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Home Number</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceRecords.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.memberId?.username || 'Unknown'}</TableCell>
                    <TableCell>{record.memberId?.homeNumber || 'N/A'}</TableCell>
                    <TableCell>{record.month}</TableCell>
                    <TableCell>₹{record.amount?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip label={record.status} color={getStatusColor(record.status)} size="small" />
                    </TableCell>
                    <TableCell>{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => {
                            console.log('Editing record:', record); // Debug log
                            setSelectedRecord(record);
                            setMaintenanceForm({
                              memberId: record.memberId?._id || record.memberId,
                              month: record.month || '',
                              amount: record.amount || '',
                              dueDate: record.dueDate ? new Date(record.dueDate).toISOString().split('T')[0] : '',
                              status: record.status || 'Unpaid'
                            });
                            setMaintenanceDialogOpen(true);
                          }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => {
                            if (window.confirm('Are you sure?')) {
                              api.delete(`/maintenance/${record._id}`).then(() => {
                                setSuccess('Record deleted');
                                fetchData();
                              });
                            }
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        {record.status !== 'Paid' && (
                          <Tooltip title="Mark as Paid">
                            <IconButton size="small" color="success" onClick={() => updateStatus(record._id, 'Paid')}>
                              <PaymentIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Maintenance Dialog */}
      <Dialog open={maintenanceDialogOpen} onClose={() => setMaintenanceDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRecord ? 'Edit Maintenance Record' : 'Add Maintenance Record'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
                         <Grid item xs={12} sm={6}>
               <TextField select fullWidth label="Resident" value={maintenanceForm.memberId}
                 onChange={(e) => setMaintenanceForm({ ...maintenanceForm, memberId: e.target.value })}>
                 {users.filter(user => user.role === 'resident').map((user) => {
                   console.log('Available resident:', user); // Debug log
                   return (
                     <MenuItem key={user._id} value={user._id}>
                       {user.username} - {user.homeNumber}
                     </MenuItem>
                   );
                 })}
               </TextField>
             </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Month" value={maintenanceForm.month}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, month: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Amount" type="number" value={maintenanceForm.amount}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, amount: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Due Date" type="date" InputLabelProps={{ shrink: true }}
                value={maintenanceForm.dueDate}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, dueDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Status" value={maintenanceForm.status}
                onChange={(e) => setMaintenanceForm({ ...maintenanceForm, status: e.target.value })}>
                <MenuItem value="Unpaid">Unpaid</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMaintenanceDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMaintenance} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      
    </Box>
  );
}

export default AdminMaintenance; 