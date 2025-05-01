
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-journal-primary font-bold text-xl">Personal Journal</span>
        </Link>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Link to="/journal">
              <Button variant="outline" size="sm" className="gap-2">
                <BookOpen size={16} />
                <span>Journal</span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User size={16} />
                <span>Profile</span>
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 gap-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-journal-primary hover:bg-journal-primary/90">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
