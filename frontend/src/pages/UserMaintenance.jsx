import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, CircularProgress, useMediaQuery, useTheme,
  Divider, Paper
} from '@mui/material';
import {
  Payment as PaymentIcon, AccountBalanceWallet as WalletIcon,
  Warning as WarningIcon, CheckCircle as CheckIcon,
  Schedule as ScheduleIcon, Receipt as ReceiptIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function UserMaintenance({ user }) {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const fetchMaintenanceRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/maintenance');
      setMaintenanceRecords(response.data);
    } catch (err) {
      setError('Failed to fetch maintenance records');
    } finally {
      setLoading(false);
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

  const getDueStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    return due < today ? 'Overdue' : 'Due';
  };

  const handlePayMaintenance = (record) => {
    navigate('/pay-maintenance', { state: { record } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const unpaidRecords = maintenanceRecords.filter(record => record.status !== 'Paid');
  const paidRecords = maintenanceRecords.filter(record => record.status === 'Paid');
  const totalDue = unpaidRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Maintenance & Billing
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
                    ₹{totalDue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Due
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
                    {unpaidRecords.length}
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
                    {paidRecords.length}
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
                <ScheduleIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="info.main">
                    {new Date().getDate()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Days in Month
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Due Payments Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Due Payments
          </Typography>
          {unpaidRecords.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No pending payments
            </Typography>
          ) : (
            <List>
              {unpaidRecords.map((record, index) => (
                <React.Fragment key={record._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${record.month} Maintenance`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Due Date: {new Date(record.dueDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Status: {getDueStatus(record.dueDate)}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" color="primary">
                        ₹{record.amount?.toLocaleString()}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<PaymentIcon />}
                        onClick={() => handlePayMaintenance(record)}
                        size="small"
                      >
                        Pay Now
                      </Button>
                    </Box>
                  </ListItem>
                  {index < unpaidRecords.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Payment History
          </Typography>
          {paidRecords.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No payment history
            </Typography>
          ) : (
            <List>
              {paidRecords.slice(0, 5).map((record, index) => (
                <React.Fragment key={record._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${record.month} Maintenance`}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Paid on: {record.paymentDate ? new Date(record.paymentDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Method: {record.paymentMethod || 'N/A'}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="h6" color="success.main">
                        ₹{record.amount?.toLocaleString()}
                      </Typography>
                      <Chip label="Paid" color="success" size="small" />
                    </Box>
                  </ListItem>
                  {index < Math.min(paidRecords.length, 5) - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserMaintenance; 