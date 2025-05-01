
import { toast } from "@/components/ui/sonner";

export interface User {
  userName: string;
  email: string;
  password?: string;
  sentimentAnalysis: boolean;
}

export interface JournalEntry {
  id?: number;
  title: string;
  content: string;
  createdAt?: string;
}

const BASE_URL = "http://localhost:8081/journal";

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
  return {
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    "Content-Type": "application/json"
  };
};

// Register a new user
export const registerUser = async (userData: User): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/public/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Registration failed");
    throw error;
  }
};

// Get user data
export const getUserData = async (username: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "GET",
      headers: createAuthHeader(username, password)
    });
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Failed to fetch user data");
    throw error;
  }
};

// Update user data
export const updateUserData = async (username: string, password: string, userData: User): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: "PUT",
      headers: createAuthHeader(username, password),
      body: JSON.stringify(userData)
    });
    
    return handleResponse(response);
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
    
    return handleResponse(response);
  } catch (error) {
    toast.error("Failed to delete account");
    throw error;
  }
};

// Check authentication
export const checkAuth = async (username: string, password: string): Promise<boolean> => {
  try {
    await getUserData(username, password);
    return true;
  } catch (error) {
    return false;
  }
};

// Journal entry APIs

// Create a new journal entry
export const createJournalEntry = async (username: string, password: string, entry: JournalEntry): Promise<JournalEntry> => {
  try {
    const response = await fetch(`${BASE_URL}/journal`, {
      method: "POST",
      headers: createAuthHeader(username, password),
      body: JSON.stringify(entry)
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
