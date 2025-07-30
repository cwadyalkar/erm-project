import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add useNavigate

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // ✅ Initialize navigation

  if (!user) return null;

  const commonLinks = [
    { to: "/dashboard", label: "Dashboard" },
    ...(user.role === "Manager"
      ? [
          { to: "/engineers", label: "Engineers" },
          { to: "/projects", label: "Projects" },
          { to: "/assignments", label: "Assignments" },
        ]
      : user.role === "Engineer"
      ? [{ to: "/my-projects", label: "My Projects" }]
      : []),
  ];

  const handleLogout = () => {
    logout();            // clear auth context + localStorage
    navigate("/login");  // ✅ redirect to login
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="text-xl font-bold">
              ERM System
            </Link>

            <div className="flex space-x-4">
              {commonLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm font-semibold tracking-wide hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                {user.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
