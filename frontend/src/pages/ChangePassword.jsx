import React, { useState } from 'react';
import api from '../utils/api';

function ChangePassword({ user }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      setMessage('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error changing password');
    }
  };

  return (
    <form onSubmit={handleChange} style={{ maxWidth: 400, margin: 'auto', marginTop: 40, padding: 24, boxShadow: '0 2px 8px #ccc', borderRadius: 8 }}>
      <h2>Change Password</h2>
      <input type="password" placeholder="Old Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', marginBottom: 16, padding: 8 }} />
      <button type="submit" style={{ width: '100%', padding: 10 }}>Change Password</button>
      {message && <div style={{marginTop: 12, color: 'green'}}>{message}</div>}
      {error && <div style={{marginTop: 12, color: 'red'}}>{error}</div>}
    </form>
  );
}

export default ChangePassword; 