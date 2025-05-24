
import { toast } from "@/components/ui/sonner";

export const BASE_URL = "http://localhost:8081/journal";

// Helper function to handle API responses
const handleResponse = async (response) => {
  console.log('API Response status:', response.status);
  console.log('API Response headers:', response.headers);
  
  if (!response.ok) {
    const errorMessage = await response.text().catch(() => "An unknown error occurred");
    console.error('API Error response:', errorMessage);
    throw new Error(errorMessage || `Error: ${response.status}`);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json().catch(() => null);
};

// Helper function to create auth headers
const createAuthHeader = (username, password) => {
  return {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    "Content-Type": "application/json"
  };
};

// Test connection to backend
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', BASE_URL);
    const response = await fetch(`${BASE_URL}/public/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    console.log('Connection test response:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    console.log('Attempting to register user:', { ...userData, password: '[HIDDEN]' });
    console.log('Registration URL:', `${BASE_URL}/public/create-user`);
    
    const response = await fetch(`${BASE_URL}/public/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    
    console.log('Registration response status:', response.status);
    return handleResponse(response);
  } catch (error) {
    console.error('Registration error details:', error);
    toast.error(`Registration failed: ${error.message}`);
    throw error;
  }
};

// Get user data
export const getUserData = async (username, password) => {
  try {
    console.log('Getting user data for:', username);
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Get user data error:', error);
    toast.error(`Failed to fetch user data: ${error.message}`);
    throw error;
  }
};

// Update user data
export const updateUserData = async (username, password, userData) => {
  try {
    console.log('Updating user data for:', username);
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: createAuthHeader(username, password),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Update user data error:', error);
    toast.error(`Failed to update user data: ${error.message}`);
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async (username, password) => {
  try {
    console.log('Deleting account for:', username);
    const response = await fetch(`${BASE_URL}/user`, {
      method: "DELETE",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Delete account error:', error);
    toast.error(`Failed to delete account: ${error.message}`);
    throw error;
  }
};

// Check authentication
export const checkAuth = async (username, password) => {
  try {
    console.log('Checking authentication for:', username);
    await getUserData(username, password);
    return true;
  } catch (error) {
    console.log('Authentication check failed:', error.message);
    return false;
  }
};

// Journal entry APIs

// Create a new journal entry
export const createJournalEntry = async (username, password, entry) => {
  try {
    console.log('Creating journal entry for:', username);
    const response = await fetch(`${BASE_URL}/journal`, {
      method: "POST",
      headers: createAuthHeader(username, password),
      body: JSON.stringify(entry)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Create journal entry error:', error);
    toast.error(`Failed to create journal entry: ${error.message}`);
    throw error;
  }
};

// Get all journal entries
export const getJournalEntries = async (username, password) => {
  try {
    console.log('Getting journal entries for:', username);
    const response = await fetch(`${BASE_URL}/journal`, {
      method: "GET",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Get journal entries error:', error);
    toast.error(`Failed to fetch journal entries: ${error.message}`);
    throw error;
  }
};

// Admin APIs

// Get all users (admin only)
export const getAllUsers = async (username, password) => {
  try {
    console.log('Getting all users (admin)');
    const response = await fetch(`${BASE_URL}/admin/all-users`, {
      method: "GET",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Get all users error:', error);
    toast.error(`Failed to fetch users: ${error.message}`);
    throw error;
  }
};

// Create admin user (admin only)
export const createAdminUser = async (username, password, userData) => {
  try {
    console.log('Creating admin user');
    const response = await fetch(`${BASE_URL}/admin/create-admin-user`, {
      method: "POST",
      headers: createAuthHeader(username, password),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Create admin user error:', error);
    toast.error(`Failed to create admin user: ${error.message}`);
    throw error;
  }
};
