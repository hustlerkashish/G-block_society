import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, useMediaQuery, useTheme, Fab
} from '@mui/material';
import {
  Add as AddIcon, Notifications as NotificationsIcon,
  PriorityHigh as PriorityIcon, Schedule as ScheduleIcon,
  Announcement as AnnouncementIcon
} from '@mui/icons-material';

function Notices({ user }) {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'Diwali Celebration Notice',
      content: 'We are organizing a grand Diwali celebration on November 12th, 2024. All residents are invited to participate.',
      priority: 'high',
      date: '2024-11-01',
      author: 'Admin',
      category: 'event'
    },
    {
      id: 2,
      title: 'Maintenance Schedule Update',
      content: 'Monthly maintenance will be collected on the 15th of every month. Please ensure timely payment.',
      priority: 'medium',
      date: '2024-10-28',
      author: 'Admin',
      category: 'maintenance'
    },
    {
      id: 3,
      title: 'Water Supply Interruption',
      content: 'Water supply will be interrupted on November 5th from 10 AM to 2 PM for maintenance work.',
      priority: 'urgent',
      date: '2024-11-03',
      author: 'Admin',
      category: 'maintenance'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    priority: 'medium',
    category: 'general'
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddNotice = () => {
    setNoticeForm({
      title: '',
      content: '',
      priority: 'medium',
      category: 'general'
    });
    setDialogOpen(true);
  };

  const handleSaveNotice = () => {
    const newNotice = {
      id: notices.length + 1,
      ...noticeForm,
      date: new Date().toISOString().split('T')[0],
      author: user.username
    };
    setNotices([newNotice, ...notices]);
    setDialogOpen(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'event': return 'primary';
      case 'maintenance': return 'warning';
      case 'security': return 'error';
      case 'general': return 'default';
      default: return 'default';
    }
  };

  const urgentNotices = notices.filter(n => n.priority === 'urgent');
  const highPriorityNotices = notices.filter(n => n.priority === 'high');

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Notice Board & Communication
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <NotificationsIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="primary">
                    {notices.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Notices
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
                <PriorityIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="error.main">
                    {urgentNotices.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Urgent Notices
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
                <AnnouncementIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {highPriorityNotices.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High Priority
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Button for Admin */}
      {user.role === 'admin' && (
        <Box sx={{ mb: 3 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNotice}>
            Post New Notice
          </Button>
        </Box>
      )}

      {/* Notices List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Recent Notices
          </Typography>
          
          {notices.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No notices available at the moment.
            </Typography>
          ) : (
            <List>
              {notices.map((notice, index) => (
                <ListItem key={notice.id}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6">
                          {notice.title}
                        </Typography>
                        <Chip 
                          label={notice.priority} 
                          color={getPriorityColor(notice.priority)} 
                          size="small" 
                        />
                        <Chip 
                          label={notice.category} 
                          color={getCategoryColor(notice.category)} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {notice.content}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Posted by: {notice.author} on {new Date(notice.date).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Notice Dialog (Admin Only) */}
      {user.role === 'admin' && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Post New Notice</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notice Title"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="Enter notice title..."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Priority"
                  value={noticeForm.priority}
                  onChange={(e) => setNoticeForm({ ...noticeForm, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={noticeForm.category}
                  onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="event">Event</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Notice Content"
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Enter notice content..."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveNotice} 
              variant="contained" 
              disabled={!noticeForm.title || !noticeForm.content}
            >
              Post Notice
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default Notices; 