import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  List, ListItem, ListItemText, ListItemSecondaryAction,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Alert, useMediaQuery, useTheme, IconButton, Tooltip
} from '@mui/material';
import {
  Add as AddIcon, Description as DocumentIcon,
  Download as DownloadIcon, Visibility as ViewIcon,
  Delete as DeleteIcon, Folder as FolderIcon,
  PictureAsPdf as PdfIcon, Image as ImageIcon
} from '@mui/icons-material';

function Documents({ user }) {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: 'Society Bye-Laws',
      type: 'pdf',
      size: '2.5 MB',
      category: 'legal',
      uploadDate: '2024-01-15',
      uploadedBy: 'Admin'
    },
    {
      id: 2,
      title: 'Maintenance Receipt - October 2024',
      type: 'pdf',
      size: '1.2 MB',
      category: 'maintenance',
      uploadDate: '2024-10-31',
      uploadedBy: 'Admin'
    },
    {
      id: 3,
      title: 'Society Rules & Regulations',
      type: 'pdf',
      size: '3.1 MB',
      category: 'legal',
      uploadDate: '2024-01-10',
      uploadedBy: 'Admin'
    },
    {
      id: 4,
      title: 'Emergency Contact List',
      type: 'pdf',
      size: '0.8 MB',
      category: 'emergency',
      uploadDate: '2024-09-20',
      uploadedBy: 'Admin'
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    title: '',
    category: 'general',
    description: ''
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleAddDocument = () => {
    setDocumentForm({
      title: '',
      category: 'general',
      description: ''
    });
    setDialogOpen(true);
  };

  const handleSaveDocument = () => {
    const newDocument = {
      id: documents.length + 1,
      ...documentForm,
      type: 'pdf',
      size: '1.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: user.username
    };
    setDocuments([newDocument, ...documents]);
    setDialogOpen(false);
  };

  const handleDeleteDocument = (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'legal': return 'error';
      case 'maintenance': return 'warning';
      case 'emergency': return 'error';
      case 'general': return 'info';
      default: return 'default';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <PdfIcon />;
      case 'image': return <ImageIcon />;
      default: return <DocumentIcon />;
    }
  };

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'legal', label: 'Legal Documents' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'events', label: 'Events' }
  ];

  const totalDocuments = documents.length;
  const legalDocuments = documents.filter(d => d.category === 'legal').length;
  const maintenanceDocuments = documents.filter(d => d.category === 'maintenance').length;

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Document Management
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DocumentIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="primary">
                    {totalDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Documents
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
                <FolderIcon color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="error.main">
                    {legalDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Legal Documents
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
                <DocumentIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" color="warning.main">
                    {maintenanceDocuments}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maintenance Docs
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddDocument}>
            Upload Document
          </Button>
        </Box>
      )}

      {/* Documents List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Available Documents
          </Typography>
          
          {documents.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No documents available at the moment.
            </Typography>
          ) : (
            <List>
              {documents.map((document, index) => (
                <ListItem key={document.id}>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {getFileIcon(document.type)}
                        <Typography variant="h6">
                          {document.title}
                        </Typography>
                        <Chip 
                          label={document.category} 
                          color={getCategoryColor(document.category)} 
                          size="small" 
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Size: {document.size} • Uploaded by: {document.uploadedBy} • Date: {new Date(document.uploadDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View">
                        <IconButton size="small">
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small">
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      {user.role === 'admin' && (
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Upload Document Dialog (Admin Only) */}
      {user.role === 'admin' && (
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload New Document</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Document Title"
                  value={documentForm.title}
                  onChange={(e) => setDocumentForm({ ...documentForm, title: e.target.value })}
                  placeholder="Enter document title..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={documentForm.category}
                  onChange={(e) => setDocumentForm({ ...documentForm, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={documentForm.description}
                  onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                  placeholder="Enter document description..."
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<AddIcon />}
                >
                  Choose File
                  <input type="file" hidden accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveDocument} 
              variant="contained" 
              disabled={!documentForm.title}
            >
              Upload Document
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default Documents; 