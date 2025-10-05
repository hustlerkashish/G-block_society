import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  AttachFile as AttachFileIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../utils/api';

const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' }
];

const TRANSACTION_CATEGORIES = {
  income: [
    'maintenance',
    'rent',
    'donation',
    'parking',
    'event',
    'clubhouse',
    'guesthouse',
    'other'
  ],
  expense: [
    'utility',
    'repair',
    'salary',
    'security',
    'housekeeping',
    'admin',
    'vendor',
    'other'
  ]
};

const PAYMENT_METHODS = [
  'cash',
  'bank_transfer',
  'upi',
  'card',
  'cheque',
  'online'
];

const STATUS_OPTIONS = [
  'pending',
  'paid',
  'overdue',
  'cancelled'
];

function Transactions({ user }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    status: '',
    startDate: null,
    endDate: null,
    search: ''
  });

  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    subCategory: '',
    amount: '',
    gstAmount: '',
    description: '',
    date: new Date(),
    dueDate: null,
    status: 'pending',
    paymentMethod: 'cash',
    referenceNumber: '',
    relatedTo: 'maintenance',
    flatNumber: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });

      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await api.get(`/finance/transactions?${params}`);
      setTransactions(response.data.transactions);
      setTotalRecords(response.data.pagination.totalRecords);
      setError('');
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, rowsPerPage, filters]);

  const handleSubmit = async () => {
    try {
      // Validate required fields
      const requiredFields = ['type', 'category', 'subCategory', 'amount', 'description', 'relatedTo'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }

      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        gstAmount: parseFloat(formData.gstAmount) || 0
      };

      console.log('Submitting transaction data:', submitData);

      if (editingTransaction) {
        await api.put(`/finance/transactions/${editingTransaction._id}`, submitData);
      } else {
        await api.post('/finance/transactions', submitData);
      }

      setDialogOpen(false);
      setEditingTransaction(null);
      resetForm();
      fetchTransactions();
      setError('');
    } catch (err) {
      console.error('Error saving transaction:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save transaction');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/finance/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      subCategory: transaction.subCategory,
      amount: transaction.amount.toString(),
      gstAmount: transaction.gstAmount?.toString() || '',
      description: transaction.description,
      date: new Date(transaction.date),
      dueDate: transaction.dueDate ? new Date(transaction.dueDate) : null,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      referenceNumber: transaction.referenceNumber || '',
      relatedTo: transaction.relatedTo,
      flatNumber: transaction.flatNumber || '',
      notes: transaction.notes || '',
      isRecurring: transaction.isRecurring || false,
      recurringFrequency: transaction.recurringFrequency || 'monthly'
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      category: '',
      subCategory: '',
      amount: '',
      gstAmount: '',
      description: '',
      date: new Date(),
      dueDate: null,
      status: 'pending',
      paymentMethod: 'cash',
      referenceNumber: '',
      relatedTo: 'maintenance',
      flatNumber: '',
      notes: '',
      isRecurring: false,
      recurringFrequency: 'monthly'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: isMobile ? 1 : 3 }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography variant={isMobile ? "h5" : "h4"} component="h1">
            Transactions
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingTransaction(null);
              resetForm();
              setDialogOpen(true);
            }}
          >
            Add Transaction
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <FilterIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  {TRANSACTION_TYPES.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {STATUS_OPTIONS.map(status => (
                    <MenuItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => setFilters({ ...filters, startDate: date })}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => setFilters({ ...filters, endDate: date })}
                renderInput={(params) => <TextField {...params} size="small" fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={1}>
              <Button
                variant="outlined"
                onClick={() => setFilters({
                  type: '',
                  category: '',
                  status: '',
                  startDate: null,
                  endDate: null,
                  search: ''
                })}
                fullWidth
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Transactions Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.transactionId}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          {formatCurrency(transaction.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          color={getStatusColor(transaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton size="small" color="primary">
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleEdit(transaction)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {user.role === 'admin' && (
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(transaction._id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalRecords}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>

        {/* Add/Edit Transaction Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                    label="Type"
                  >
                    {TRANSACTION_TYPES.map(type => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    label="Category"
                  >
                    {TRANSACTION_CATEGORIES[formData.type]?.map(category => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sub Category"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST Amount"
                  type="number"
                  value={formData.gstAmount}
                  onChange={(e) => setFormData({ ...formData, gstAmount: e.target.value })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Related To</InputLabel>
                  <Select
                    value={formData.relatedTo}
                    onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
                    label="Related To"
                  >
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="rent">Rent</MenuItem>
                    <MenuItem value="donation">Donation</MenuItem>
                    <MenuItem value="parking">Parking</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="clubhouse">Clubhouse</MenuItem>
                    <MenuItem value="guesthouse">Guesthouse</MenuItem>
                    <MenuItem value="utility">Utility</MenuItem>
                    <MenuItem value="repair">Repair</MenuItem>
                    <MenuItem value="salary">Salary</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Due Date"
                  value={formData.dueDate}
                  onChange={(date) => setFormData({ ...formData, dueDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="Status"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    label="Payment Method"
                  >
                    {PAYMENT_METHODS.map(method => (
                      <MenuItem key={method} value={method}>
                        {method.replace('_', ' ').charAt(0).toUpperCase() + method.replace('_', ' ').slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Flat Number"
                  value={formData.flatNumber}
                  onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingTransaction ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

export default Transactions;
