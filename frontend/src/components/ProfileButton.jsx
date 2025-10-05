import React, { useState } from 'react';
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

function ProfileButton({ user, onProfileClick, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleClose();
    onProfileClick();
  };

  const handleLogoutClick = () => {
    handleClose();
    onLogout();
  };

  return (
    <Box>
      <IconButton
        onClick={handleClick}
        sx={{
          p: 0,
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s'
          }
        }}
      >
        <Avatar
          src={user?.profilePhoto ? `http://localhost:5002${user.profilePhoto}` : undefined}
          sx={{
            width: 45,
            height: 45,
            border: '3px solid',
            borderColor: 'white',
            bgcolor: 'primary.main',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
            }
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }
        }}
      >
        {/* User Info */}
        <MenuItem disabled sx={{ opacity: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              House {user?.homeNumber}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role === 'admin' ? 'Administrator' : 'Resident'}
            </Typography>
          </Box>
        </MenuItem>

        <Divider />

        {/* Profile Settings */}
        <MenuItem onClick={handleProfileClick} sx={{ py: 1.5 }}>
          <SettingsIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography>Profile Settings</Typography>
        </MenuItem>

        <Divider />

        {/* Logout */}
        <MenuItem onClick={handleLogoutClick} sx={{ py: 1.5, color: 'error.main' }}>
          <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ProfileButton;
