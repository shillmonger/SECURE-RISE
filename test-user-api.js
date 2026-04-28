// Simple test to verify user API endpoint
const testUserAPI = async () => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('auth-token') || 
                 document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1];
    
    if (!token) {
      console.log('No auth token found');
      return null;
    }

    console.log('Testing API with token:', token);
    
    const response = await fetch('/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error Response:', errorText);
      throw new Error(`Failed to fetch user data: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    console.log('User role from API:', data.user?.role);
    console.log('Is admin check:', data.user?.role?.includes('admin'));
    
    return data.user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Test the API
testUserAPI();
