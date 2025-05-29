import { toast } from "@/components/ui/sonner";

export interface User {
  userName: string;
  email: string;
  password?: string;
  sentimentAnalysis: boolean;
  role?: 'USER' | 'ADMIN';
}

export interface JournalEntry {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
}

export const BASE_URL = "http://localhost:8081/journal";

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.text().catch(() => "An unknown error occurred");
    throw new Error(errorMessage || `Error: ${response.status}`);
  }
  
  if (response.status === 204) {
    return null;
  }
  
  return response.json().catch(() => null);
};

// Helper function to create auth headers
const createAuthHeader = (username: string, password: string) => {
  const credentials = btoa(`${username}:${password}`);
  console.log('🔐 Creating Basic Auth for user:', username);
  console.log('🔐 Base64 credentials:', credentials);
  
  return {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json"
  };
};

// Test connection to backend
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing connection to:', `${BASE_URL}/public/health`);
    const response = await fetch(`${BASE_URL}/public/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    console.log('🔍 Health check response status:', response.status);
    console.log('🔍 Health check response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Health check successful, response:', data);
      return true;
    } else {
      console.log('❌ Health check failed with status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Health check error:', error);
    return false;
  }
};

// Register a new user
export const registerUser = async (userData: User): Promise<User> => {
  try {
    console.log('🚀 Attempting registration to:', `${BASE_URL}/public/create-user`);
    console.log('🚀 Registration data:', { ...userData, password: '[HIDDEN]' });
    
    const response = await fetch(`${BASE_URL}/public/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    
    console.log('🚀 Registration response status:', response.status);
    console.log('🚀 Registration response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      let errorText;
      try {
        // Try to parse as JSON first
        const errorJson = await response.json();
        errorText = JSON.stringify(errorJson);
        console.log('❌ Registration failed with JSON error:', errorJson);
      } catch {
        // Fallback to text if JSON parsing fails
        errorText = await response.text().catch(() => "Failed to read error response");
        console.log('❌ Registration failed with text error:', errorText);
      }
      
      throw new Error(`Registration failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.text();
    console.log('✅ Registration successful, response:', result);
    
    return userData;
  } catch (error) {
    console.error('❌ Registration error details:', error);
    
    // Provide more user-friendly error messages based on the error
    if (error.message && error.message.includes('500')) {
      throw new Error('Server error occurred. Please check if your backend is running properly and try again.');
    } else if (error.message && error.message.includes('duplicate') || error.message.includes('already exists')) {
      throw new Error('An account with this username or email already exists.');
    } else if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure your backend is running on localhost:8081.');
    }
    
    throw error;
  }
};

// Get user data with better Basic Auth logging
export const getUserData = async (username: string, password: string): Promise<User> => {
  try {
    console.log('👤 Getting user data for:', username);
    const headers = createAuthHeader(username, password);
    console.log('👤 Request headers:', headers);
    
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers
    });
    
    console.log('👤 Response status:', response.status);
    console.log('👤 Response headers:', [...response.headers.entries()]);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw new Error(`Failed to get user data: ${response.status}`);
    }
    
    const greeting = await response.text();
    console.log('✅ User greeting:', greeting);
    
    return {
      userName: username,
      email: '',
      sentimentAnalysis: true,
      role: username === 'admin' ? 'ADMIN' : 'USER'
    };
  } catch (error) {
    console.error('❌ getUserData error:', error);
    if (error.message && error.message.includes('401')) {
      toast.error("Invalid username or password");
    } else {
      toast.error("Failed to fetch user data");
    }
    throw error;
  }
};

// Check authentication with improved logging
export const checkAuth = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log('🔍 Checking authentication for user:', username);
    await getUserData(username, password);
    console.log('✅ Authentication successful');
    return true;
  } catch (error) {
    console.log('❌ Authentication failed:', error.message);
    return false;
  }
};

// Update user data
export const updateUserData = async (username: string, password: string, userData: User): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: createAuthHeader(username, password),
      body: JSON.stringify({
        userName: userData.userName,
        password: userData.password
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    
    return userData;
  } catch (error) {
    toast.error("Failed to update user data");
    throw error;
  }
};

// Delete user account
export const deleteUserAccount = async (username: string, password: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "DELETE",
      headers: createAuthHeader(username, password)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete account: ${response.status}`);
    }
  } catch (error) {
    toast.error("Failed to delete account");
    throw error;
  }
};

// Create a new journal entry
export const createJournalEntry = async (username: string, password: string, entry: JournalEntry): Promise<JournalEntry> => {
  try {
    const response = await fetch(`${BASE_URL}/journal`, {
      method: "POST",
      headers: createAuthHeader(username, password),
      body: JSON.stringify({
        title: entry.title,
        content: entry.content
      })
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Failed to create journal entry");
    throw error;
  }
};

// Get all journal entries
export const getJournalEntries = async (username: string, password: string): Promise<JournalEntry[]> => {
  try {
    const response = await fetch(`${BASE_URL}/journal`, {
      method: "GET",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Failed to fetch journal entries");
    throw error;
  }
};

// Get all users (admin only)
export const getAllUsers = async (username: string, password: string): Promise<User[]> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/all-users`, {
      method: "GET",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Failed to fetch users");
    throw error;
  }
};

// Create admin user (admin only)
export const createAdminUser = async (username: string, password: string, userData: User): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/create-admin-user`, {
      method: "POST",
      headers: createAuthHeader(username, password),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Failed to create admin user");
    throw error;
  }
};
