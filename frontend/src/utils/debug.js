// Debug utility for troubleshooting login issues

export const debugUserData = (user) => {
  console.log('🔍 Debug User Data:');
  console.log('User object:', user);
  console.log('User type:', typeof user);
  console.log('User keys:', user ? Object.keys(user) : 'null');
  console.log('User ID:', user?._id);
  console.log('User role:', user?.role);
  console.log('User username:', user?.username);
  console.log('User homeNumber:', user?.homeNumber);
  console.log('LocalStorage user:', localStorage.getItem('user'));
  console.log('LocalStorage token:', localStorage.getItem('token'));
};

export const debugLoginResponse = (response) => {
  console.log('🔍 Debug Login Response:');
  console.log('Response:', response);
  console.log('Response data:', response?.data);
  console.log('Response status:', response?.status);
  console.log('Response headers:', response?.headers);
};

export const debugAPIError = (error) => {
  console.log('🔍 Debug API Error:');
  console.log('Error:', error);
  console.log('Error message:', error?.message);
  console.log('Error response:', error?.response);
  console.log('Error status:', error?.response?.status);
  console.log('Error data:', error?.response?.data);
};

export const checkUserValidity = (user) => {
  const issues = [];
  
  if (!user) {
    issues.push('User object is null or undefined');
    return { valid: false, issues };
  }
  
  if (!user._id) {
    issues.push('User missing _id field');
  }
  
  if (!user.role) {
    issues.push('User missing role field');
  }
  
  if (!user.username) {
    issues.push('User missing username field');
  }
  
  if (!user.homeNumber) {
    issues.push('User missing homeNumber field');
  }
  
  const valid = issues.length === 0;
  return { valid, issues };
};
