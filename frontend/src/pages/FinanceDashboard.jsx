import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../utils/api';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function FinanceDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/finance/dashboard');
      setDashboardData(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching finance dashboard:', err);
      setError('Failed to load finance dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { overview, monthlyData, categoryBreakdown } = dashboardData;

  // Prepare chart data
  const chartData = monthlyData.reduce((acc, item) => {
    const monthKey = `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey, income: 0, expense: 0 };
    }
    acc[monthKey][item._id.type] = item.total;
    return acc;
  }, {});

  const chartDataArray = Object.values(chartData).slice(-12);

  // Prepare pie chart data
  const pieData = categoryBreakdown.map(item => ({
    name: `${item._id.type} - ${item._id.category}`,
    value: item.total
  }));

  return (
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
          Finance Dashboard
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchDashboardData} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Income */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Income
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(overview.totalIncome)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    This Month
                  </Typography>
                </Box>
                <MonetizationOnIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Expenses */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Expenses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(overview.totalExpenses)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    This Month
                  </Typography>
                </Box>
                <ReceiptIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Dues */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: '#333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Pending Dues
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(overview.pendingDues)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                    {overview.pendingCount} pending
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, opacity: 0.8, color: '#f57c00' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Balance */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#333'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(overview.balance)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                    Net Position
                  </Typography>
                </Box>
                <AccountBalanceIcon sx={{ fontSize: 40, opacity: 0.8, color: '#2e7d32' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Monthly Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Income vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartDataArray}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${month}/${year.slice(-2)}`;
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <RechartsTooltip 
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                  labelFormatter={(label) => {
                    const [year, month] = label.split('-');
                    return `${month}/${year}`;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#667eea" 
                  strokeWidth={3}
                  name="Income"
                  dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#f5576c" 
                  strokeWidth={3}
                  name="Expenses"
                  dot={{ fill: '#f5576c', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value) => [formatCurrency(value), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Net Income This Month
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                color: overview.netIncome >= 0 ? 'success.main' : 'error.main'
              }}>
                {formatCurrency(overview.netIncome)}
              </Typography>
              {overview.netIncome >= 0 ? (
                <TrendingUpIcon color="success" />
              ) : (
                <TrendingDownIcon color="error" />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {overview.netIncome >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Outstanding Dues Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={`${overview.pendingCount} Pending`}
                color="warning"
                icon={<ScheduleIcon />}
              />
              <Typography variant="h6" color="warning.main">
                {formatCurrency(overview.pendingDues)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Requires immediate attention
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FinanceDashboard;