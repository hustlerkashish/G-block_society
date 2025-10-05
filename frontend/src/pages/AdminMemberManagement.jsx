import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Alert, CircularProgress, useMediaQuery, useTheme, IconButton, Tooltip,
  Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider
} from '@mui/material';
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Person as PersonIcon,
  AdminPanelSettings as AdminIcon, Home as HomeIcon, Email as EmailIcon,
  Phone as PhoneIcon, Search as SearchIcon, FilterList as FilterIcon
} from '@mui/icons-material';
import api from '../utils/api';

function AdminMemberManagement({ user }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [memberForm, setMemberForm] = useState({
    username: '',
    password: '',
    role: 'resident',
    homeNumber: '',
    name: '',
    email: '',
    phone: '',
    familyMembers: '',
    vehicleNumber: '',
    occupation: ''
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/users');
      setMembers(response.data);
    } catch (err) {
      setError('Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setMemberForm({
      username: '',
      password: '',
      role: 'resident',
      homeNumber: '',
      name: '',
      email: '',
      phone: '',
      familyMembers: '',
      vehicleNumber: '',
      occupation: ''
    });
    setDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setMemberForm({
      username: member.username || '',
      password: '',
      role: member.role || 'resident',
      homeNumber: member.homeNumber || '',
      name: member.name || '',
      email: member.email || '',
      phone: member.phone || '',
      familyMembers: member.familyMembers || '',
      vehicleNumber: member.vehicleNumber || '',
      occupation: member.occupation || ''
    });
    setDialogOpen(true);
  };

  const handleSaveMember = async () => {
    try {
      setLoading(true);
      if (selectedMember) {
        // Update existing member (password only if provided)
        const updateData = { ...memberForm };
        if (!updateData.password) {
          delete updateData.password;
        }
        await api.put(`/auth/users/${selectedMember._id}`, updateData);
        setSuccess('Member updated successfully');
      } else {
        // Create new member
        await api.post('/auth/register', memberForm);
        setSuccess('Member created successfully');
      }
      setDialogOpen(false);
      fetchMembers();
    } catch (err) {
      setError('Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        setSuccess('Member deleted successfully');
        fetchMembers();
      } catch (err) {
        setError('Failed to delete member');
      }
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.homeNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const adminCount = members.filter(m => m.role === 'admin').length;
  const residentCount = members.filter(m => m.role === 'resident').length;

  if (loading && members.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Member Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="primary">
                    {members.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Members
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
                <AdminIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="secondary">
                    {adminCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrators
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
                <HomeIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="success.main">
                    {residentCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Residents
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
                <HomeIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="info.main">
                    {Math.max(...members.map(m => parseInt(m.homeNumber) || 0))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Homes
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Search Members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Filter by Role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="admin">Administrators</MenuItem>
                <MenuItem value="resident">Residents</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddMember}
                >
                  Add New Member
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Members Table */}
      <Card>
        <CardContent>
          {isMobile ? (
            // Mobile List View
            <List>
              {filteredMembers.map((member, index) => (
                <React.Fragment key={member._id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6">{member.name || member.username}</Typography>
                          <Chip
                            label={member.role}
                            color={member.role === 'admin' ? 'secondary' : 'primary'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" component="div">
                            Home: {member.homeNumber}
                          </Typography>
                          {member.email && (
                            <Typography variant="body2" color="text.secondary" component="div">
                              Email: {member.email}
                            </Typography>
                          )}
                          {member.phone && (
                            <Typography variant="body2" color="text.secondary" component="div">
                              Phone: {member.phone}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <IconButton size="small" onClick={() => handleEditMember(member)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteMember(member._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  {index < filteredMembers.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            // Desktop Table View
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Member</TableCell>
                    <TableCell>Home Number</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Additional Info</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1">
                              {member.name || member.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {member.occupation || 'Not specified'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <HomeIcon fontSize="small" color="action" />
                          {member.homeNumber}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          color={member.role === 'admin' ? 'secondary' : 'primary'}
                          icon={member.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          {member.email && (
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <EmailIcon fontSize="small" color="action" />
                              <Typography variant="body2">{member.email}</Typography>
                            </Box>
                          )}
                          {member.phone && (
                            <Box display="flex" alignItems="center" gap={1}>
                              <PhoneIcon fontSize="small" color="action" />
                              <Typography variant="body2">{member.phone}</Typography>
                            </Box>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          {member.familyMembers && (
                            <Typography variant="body2" color="text.secondary">
                              Family: {member.familyMembers}
                            </Typography>
                          )}
                          {member.vehicleNumber && (
                            <Typography variant="body2" color="text.secondary">
                              Vehicle: {member.vehicleNumber}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Member">
                            <IconButton size="small" onClick={() => handleEditMember(member)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Member">
                            <IconButton size="small" color="error" onClick={() => handleDeleteMember(member._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Member Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedMember ? 'Edit Member' : 'Add New Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ margin: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Home Number (Username)"
                value={memberForm.username}
                onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Home Number (Display)"
                value={memberForm.homeNumber}
                onChange={(e) => setMemberForm({ ...memberForm, homeNumber: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={memberForm.password}
                onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                required={!selectedMember}
                helperText={selectedMember ? 'Leave blank to keep current password' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Role"
                value={memberForm.role}
                onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
              >
                <MenuItem value="resident">Resident</MenuItem>
                <MenuItem value="admin">Administrator</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={memberForm.phone}
                onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Occupation"
                value={memberForm.occupation}
                onChange={(e) => setMemberForm({ ...memberForm, occupation: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Family Members"
                value={memberForm.familyMembers}
                onChange={(e) => setMemberForm({ ...memberForm, familyMembers: e.target.value })}
                helperText="e.g., Spouse, 2 Children"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vehicle Number"
                value={memberForm.vehicleNumber}
                onChange={(e) => setMemberForm({ ...memberForm, vehicleNumber: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveMember}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (selectedMember ? 'Update' : 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminMemberManagement; 