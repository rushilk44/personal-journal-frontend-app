
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { getUserData, updateUserData, deleteUserAccount, User } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { username, password, logout, updateLocalUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    sentimentAnalysis: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!username || !password) return;
      
      setIsLoading(true);
      try {
        const userData = await getUserData(username, password);
        setUser(userData);
        updateLocalUser(userData);
        setFormData({
          userName: userData.userName || "",
          email: userData.email || "",
          newPassword: "",
          confirmPassword: "",
          sentimentAnalysis: userData.sentimentAnalysis || false
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [username, password, updateLocalUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sentimentAnalysis: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords if user is trying to change it
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData: User = {
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
    } finally {
      setIsSubmitting(false);
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
    } finally {
      setIsDeleteDialogOpen(false);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                value={formData.userName}
                onChange={handleChange}
                className="journal-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="journal-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password (leave blank to keep current)</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="journal-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="journal-input"
              />
            </div>
            
            <div className="flex items-center space-x-2 my-4">
              <Checkbox 
                id="sentimentAnalysis" 
                checked={formData.sentimentAnalysis}
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="sentimentAnalysis" className="text-sm">
                Enable sentiment analysis for journal entries
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-journal-primary hover:bg-journal-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <Alert className="mt-6 bg-red-50 border-red-200">
            <AlertDescription>
              <div className="flex flex-col space-y-2">
                <span>Danger Zone</span>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
