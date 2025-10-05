import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Avatar,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, useMediaQuery, useTheme, IconButton, Chip, Divider,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  FormControl, InputLabel, Select, MenuItem, InputAdornment, CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon,
  Add as AddIcon, Delete as DeleteIcon, PhotoCamera as PhotoIcon,
  Person as PersonIcon, FamilyRestroom as FamilyIcon,
  Lock as LockIcon, Logout as LogoutIcon, Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import api from '../utils/api';

function UserProfile({ user, onLogout }) {
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    homeNumber: user?.homeNumber || '',
    profilePhoto: user?.profilePhoto || ''
  });
  
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [photoDialog, setPhotoDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [addFamilyDialog, setAddFamilyDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    age: '',
    phone: '',
    relationship: 'family'
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchUserProfile();
    fetchFamilyMembers();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get(`/profile/${user._id}`);
      setProfile(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const response = await api.get(`/profile/family/${user._id}`);
      setFamilyMembers(response.data);
    } catch (err) {
      console.error('Error fetching family members:', err);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const response = await api.put(`/profile/${user._id}`, profile);
      setProfile(response.data);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) {
      setError('Please select a photo');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePhoto', selectedPhoto);

      const response = await api.put(`/profile/${user._id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile({ ...profile, profilePhoto: response.data.profilePhoto });
      setPhotoDialog(false);
      setSelectedPhoto(null);
      setPhotoPreview('');
      setSuccess('Profile photo updated successfully!');
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await api.put(`/profile/${user._id}/password`, {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordDialog(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Password changed successfully!');
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFamilyMember = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/profile/family/${user._id}`, newFamilyMember);
      setFamilyMembers([...familyMembers, response.data]);
      setAddFamilyDialog(false);
      setNewFamilyMember({ name: '', age: '', phone: '', relationship: 'family' });
      setSuccess('Family member added successfully!');
    } catch (err) {
      console.error('Error adding family member:', err);
      setError('Failed to add family member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFamilyMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this family member?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/profile/family/${user._id}/${memberId}`);
      setFamilyMembers(familyMembers.filter(member => member._id !== memberId));
      setSuccess('Family member removed successfully!');
    } catch (err) {
      console.error('Error removing family member:', err);
      setError('Failed to remove family member. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <Box sx={{ 
      p: isMobile ? 1 : 3,
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: isMobile ? 2 : 3,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          gutterBottom 
          sx={{ textAlign: isMobile ? 'center' : 'left' }}
        >
          My Profile
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            size={isMobile ? "small" : "medium"}
          >
            Logout
          </Button>
          <Button
            variant="outlined"
            startIcon={<LockIcon />}
            onClick={() => setPasswordDialog(true)}
            size={isMobile ? "small" : "medium"}
          >
            Change Password
          </Button>
        </Box>
      </Box>

      {/* Success/Error Alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Profile Photo Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={profile.profilePhoto ? `http://localhost:5002${profile.profilePhoto}` : photoPreview}
                  sx={{ 
                    width: isMobile ? 120 : 150, 
                    height: isMobile ? 120 : 150,
                    fontSize: isMobile ? '3rem' : '4rem',
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                  onClick={() => setPhotoDialog(true)}
                >
                  <PhotoIcon />
                </IconButton>
              </Box>
              <Typography variant="h6" gutterBottom>
                {profile.name || 'User Name'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                House {profile.homeNumber}
              </Typography>
              <Chip 
                label={user?.role === 'admin' ? 'Administrator' : 'Resident'} 
                color={user?.role === 'admin' ? 'primary' : 'success'} 
                size="small" 
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details Section */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography variant="h6">
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                <Button
                  variant={editMode ? "contained" : "outlined"}
                  startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                  onClick={editMode ? handleProfileUpdate : () => setEditMode(true)}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                >
                  {editMode ? 'Save' : 'Edit'}
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editMode}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editMode}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editMode}
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="House Number"
                    value={profile.homeNumber}
                    disabled
                    size={isMobile ? "small" : "medium"}
                  />
                </Grid>
              </Grid>

              {editMode && (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => {
                      setEditMode(false);
                      fetchUserProfile(); // Reset to original data
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Family Members Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2
              }}>
                <Typography variant="h6">
                  <FamilyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Family Members
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setAddFamilyDialog(true)}
                  size={isMobile ? "small" : "medium"}
                >
                  Add Member
                </Button>
              </Box>

              {familyMembers.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No family members added yet.
                </Typography>
              ) : (
                <List>
                  {familyMembers.map((member, index) => (
                    <React.Fragment key={member._id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1">
                                {member.name}
                              </Typography>
                              <Chip 
                                label={member.relationship} 
                                size="small" 
                                color="primary" 
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" component="div">
                                Age: {member.age} years
                              </Typography>
                              {member.phone && (
                                <Typography variant="body2" color="text.secondary" component="div">
                                  Phone: {member.phone}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            color="error"
                            onClick={() => handleDeleteFamilyMember(member._id)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < familyMembers.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialog} onClose={() => setPhotoDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoSelect}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoIcon />}
                sx={{ mb: 2 }}
              >
                Select Photo
              </Button>
            </label>
            {photoPreview && (
              <Box sx={{ mt: 2 }}>
                <Avatar
                  src={photoPreview}
                  sx={{ width: 100, height: 100, mx: 'auto' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePhotoUpload} 
            variant="contained"
            disabled={!selectedPhoto || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Change Dialog */}
      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      >
                        {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      >
                        {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      >
                        {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)}>Cancel</Button>
          <Button 
            onClick={handlePasswordChange} 
            variant="contained"
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Change Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Family Member Dialog */}
      <Dialog open={addFamilyDialog} onClose={() => setAddFamilyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Family Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newFamilyMember.name}
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={newFamilyMember.age}
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, age: e.target.value })}
                inputProps={{ min: 0, max: 120 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Relationship</InputLabel>
                <Select
                  value={newFamilyMember.relationship}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                  label="Relationship"
                >
                  <MenuItem value="spouse">Spouse</MenuItem>
                  <MenuItem value="child">Child</MenuItem>
                  <MenuItem value="parent">Parent</MenuItem>
                  <MenuItem value="sibling">Sibling</MenuItem>
                  <MenuItem value="family">Other Family</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                value={newFamilyMember.phone}
                onChange={(e) => setNewFamilyMember({ ...newFamilyMember, phone: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFamilyDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddFamilyMember} 
            variant="contained"
            disabled={!newFamilyMember.name || !newFamilyMember.age || loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserProfile;
