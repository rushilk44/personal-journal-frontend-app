
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, updateUserData, deleteUserAccount } from "@/services/api";
import ProfileForm from "./components/ProfileForm";
import DeleteAccountSection from "./components/DeleteAccountSection";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const ProfilePage = () => {
  const { username, password, logout, updateLocalUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username || !password) return;
      
      setIsLoading(true);
      try {
        const userData = await getUserData(username, password);
        setUser(userData);
        updateLocalUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username, password, updateLocalUser]);

  const handleUpdateProfile = async (formData) => {
    // Validate passwords if user is trying to change it
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const updateData = {
        userName: formData.userName,
        email: formData.email,
        sentimentAnalysis: formData.sentimentAnalysis
      };
      
      // Only include password if the user is changing it
      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }
      
      await updateUserData(username, password, updateData);
      toast.success("Profile updated successfully");
      
      // If username was changed, need to log out and login again
      if (formData.userName !== username) {
        toast.info("Username changed, please log in again");
        logout();
      } else {
        // Update local user data
        updateLocalUser(updateData);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount(username, password);
      toast.success("Account deleted successfully");
      logout();
      navigate("/register");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error("Failed to delete account");
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-md mx-auto py-12 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-8">
      <Card className="w-full journal-card animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-journal-primary">
            Your Profile
          </CardTitle>
          <CardDescription className="text-center">
            Manage your account settings
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <ProfileForm 
            user={user} 
            onSubmit={handleUpdateProfile} 
          />
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <DeleteAccountSection onDeleteAccount={handleDeleteAccount} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfilePage;
