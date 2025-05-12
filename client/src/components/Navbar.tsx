import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { CalendarCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

export default function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center">
                <CalendarCheck className="text-primary w-6 h-6 mr-2" />
                <span className="font-bold text-xl text-primary">AttendTrack</span>
              </a>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {!isLoading && isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {user?.firstName || user?.email || "User"}
                </span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl} alt="Profile" />
                  <AvatarFallback>{user?.firstName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <a href="/api/logout">Logout</a>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-primary bg-white hover:bg-gray-50"
                >
                  <a href="/api/login">Log in</a>
                </Button>
                <Button 
                  size="sm"
                  asChild
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                >
                  <a href="/api/login">Sign up</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
