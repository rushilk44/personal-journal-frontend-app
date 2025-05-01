
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const ProfileForm = ({ user, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    sentimentAnalysis: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        newPassword: "",
        confirmPassword: "",
        sentimentAnalysis: user.sentimentAnalysis || false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      sentimentAnalysis: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default ProfileForm;
