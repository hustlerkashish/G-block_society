import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, TextField,
  MenuItem, Alert, CircularProgress, useMediaQuery, useTheme,
  Stepper, Step, StepLabel, Paper, Divider, Chip
} from '@mui/material';
import {
  Payment as PaymentIcon, AccountBalanceWallet as WalletIcon,
  CreditCard as CardIcon, AccountBalance as BankIcon,
  ArrowBack as ArrowBackIcon, CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const steps = ['Payment Details', 'Payment Method', 'Confirmation'];

const paymentMethods = [
  { value: 'online_banking', label: 'Online Banking', icon: <BankIcon />, description: 'Pay through your bank account' },
  { value: 'credit_card', label: 'Credit Card', icon: <CardIcon />, description: 'Pay using credit card' },
  { value: 'debit_card', label: 'Debit Card', icon: <CardIcon />, description: 'Pay using debit card' },
  { value: 'upi', label: 'UPI', icon: <PaymentIcon />, description: 'Pay using UPI ID' },
  { value: 'cash', label: 'Cash', icon: <WalletIcon />, description: 'Pay in cash at office' },
];

function PayMaintenance() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const record = location.state?.record;

  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!record) {
    return (
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Alert severity="error">No payment record found. Please go back and try again.</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/maintenance')}
          sx={{ mt: 2 }}
        >
          Back to Maintenance
        </Button>
      </Box>
    );
  }

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    setPaymentDetails({});
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Update maintenance record
      await api.put(`/maintenance/${record._id}`, {
        status: 'Paid',
        paymentMethod: paymentMethod,
        paymentDate: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/maintenance');
      }, 3000);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentDetails = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Maintenance Month
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {record.month}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Due Date
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {new Date(record.dueDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">Total Amount</Typography>
              <Typography variant="h4" color="primary">
                ₹{record.amount?.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderPaymentMethod = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Select Payment Method
        </Typography>
        <Grid container spacing={2}>
          {paymentMethods.map((method) => (
            <Grid item xs={12} sm={6} key={method.value}>
              <Card
                variant={paymentMethod === method.value ? "outlined" : "elevation"}
                sx={{
                  cursor: 'pointer',
                  border: paymentMethod === method.value ? 2 : 1,
                  borderColor: paymentMethod === method.value ? 'primary.main' : 'divider',
                  '&:hover': { borderColor: 'primary.main' }
                }}
                onClick={() => handlePaymentMethodSelect(method.value)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                    {method.icon}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      {method.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {method.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {paymentMethod && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            {paymentMethod === 'upi' && (
              <TextField
                fullWidth
                label="UPI ID"
                placeholder="example@upi"
                value={paymentDetails.upiId || ''}
                onChange={(e) => handlePaymentDetailsChange('upiId', e.target.value)}
                sx={{ mb: 2 }}
              />
            )}
            {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
              <>
                <TextField
                  fullWidth
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber || ''}
                  onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={paymentDetails.expiry || ''}
                      onChange={(e) => handlePaymentDetailsChange('expiry', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      value={paymentDetails.cvv || ''}
                      onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            {paymentMethod === 'online_banking' && (
              <TextField
                select
                fullWidth
                label="Select Bank"
                value={paymentDetails.bank || ''}
                onChange={(e) => handlePaymentDetailsChange('bank', e.target.value)}
              >
                <MenuItem value="sbi">State Bank of India</MenuItem>
                <MenuItem value="hdfc">HDFC Bank</MenuItem>
                <MenuItem value="icici">ICICI Bank</MenuItem>
                <MenuItem value="axis">Axis Bank</MenuItem>
                <MenuItem value="kotak">Kotak Mahindra Bank</MenuItem>
              </TextField>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderConfirmation = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Payment Confirmation
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
              <CheckIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h6">Payment Summary</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h6">
              ₹{record.amount?.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Payment Method
            </Typography>
            <Typography variant="h6">
              {paymentMethods.find(m => m.value === paymentMethod)?.label}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Alert severity="info">
              Please review the payment details before proceeding. This action cannot be undone.
            </Alert>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPaymentDetails();
      case 1:
        return renderPaymentMethod();
      case 2:
        return renderConfirmation();
      default:
        return 'Unknown step';
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return true;
      case 1:
        return paymentMethod && (
          paymentMethod === 'cash' || 
          (paymentMethod === 'upi' && paymentDetails.upiId) ||
          (paymentMethod === 'credit_card' && paymentDetails.cardNumber && paymentDetails.expiry && paymentDetails.cvv) ||
          (paymentMethod === 'debit_card' && paymentDetails.cardNumber && paymentDetails.expiry && paymentDetails.cvv) ||
          (paymentMethod === 'online_banking' && paymentDetails.bank)
        );
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/maintenance')}
        >
          Back
        </Button>
        <Typography variant="h4">
          Pay Maintenance
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Payment processed successfully! Redirecting to maintenance page...
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Box sx={{ mb: 3 }}>
        {getStepContent(activeStep)}
      </Box>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={processPayment}
              disabled={!canProceed() || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
            >
              {loading ? 'Processing Payment...' : 'Confirm Payment'}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default PayMaintenance; 