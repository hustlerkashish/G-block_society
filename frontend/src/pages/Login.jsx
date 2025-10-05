import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { debugLoginResponse, debugAPIError, checkUserValidity } from '../utils/debug';

function Login({ setUser, onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Attempting login for user:', username);
      
      const res = await axios.post('http://localhost:5002/api/auth/login', { 
        username, 
        password 
      });
      
      console.log('✅ Login successful');
      debugLoginResponse(res);
      
      // Validate user data
      const userData = res.data;
      const validation = checkUserValidity(userData);
      
      if (!validation.valid) {
        console.error('❌ User data validation failed:', validation.issues);
        setError(`Login successful but user data is incomplete: ${validation.issues.join(', ')}`);
        setLoading(false);
        return;
      }
      
      // Store token and user data in localStorage
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('💾 User data stored in localStorage');
      console.log('User data to be set:', userData);
      
      setUser(userData);
      setError('');
      
      // Trigger loading page if callback is provided
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Fallback: Redirect based on role
        if (userData.role === 'admin') {
          console.log('🔄 Redirecting to admin dashboard');
          navigate('/admin-dashboard');
        } else {
          console.log('🔄 Redirecting to user dashboard');
          navigate('/user-dashboard');
        }
      }
    } catch (err) {
      console.error('❌ Login error');
      debugAPIError(err);
      
      if (err.response?.status === 401) {
        setError('Invalid username or password. Please check your credentials.');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please make sure the backend is running.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 400,
      margin: '100px auto',
      padding: '2rem',
      background: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '12px',
      marginBottom: '1rem',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '1rem'
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: loading ? '#ccc' : '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      cursor: loading ? 'not-allowed' : 'pointer',
      opacity: loading ? 0.7 : 1
    },
    error: {
      marginTop: '1rem',
      color: 'red',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#ffe6e6',
      borderRadius: '4px',
      border: '1px solid #ffcccc'
    },
    helpText: {
      marginTop: '1rem',
      fontSize: '0.9rem',
      color: '#666',
      textAlign: 'center',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px',
      border: '1px solid #e9ecef'
    }
  };

  return (
    <form onSubmit={handleLogin} style={styles.container}>
      <h2 style={styles.heading}>Society Management Login</h2>
      
      <input
        type="text"
        placeholder="Username (e.g., admin, H101)"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        style={styles.input}
        disabled={loading}
      />
      
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        style={styles.input}
        disabled={loading}
      />
      
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <div style={styles.helpText}>
        <strong>Demo Credentials:</strong><br/>
        Admin: username=admin, password=admin123<br/>
        Resident: username=H101, password=resident123<br/>
        <br/>
        <strong>Note:</strong> Make sure the backend server is running on port 5002
      </div>
    </form>
  );
}

export default Login;
