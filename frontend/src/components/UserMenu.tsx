import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth0 } from "@auth0/auth0-react";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
const UserMenu = () => {
  // Get user and logout function from Auth0
  const { user, logout } = useAuth0();

  // Handle user logout
  async function handleLogout() {
    // Call Auth0 logout function
    await logout()
  }
  return (
    //! dropdown menu for larger screens 
    <DropdownMenu>
      {/* Trigger */}
      <DropdownMenuTrigger className="flex items-center px-3 font-bold hover:text-orange-500 gap-2 cursor-pointer">
        <CircleUserRound className="text-orange-500" />
        {user?.nickname}
      </DropdownMenuTrigger>
      {/* content */}
      <DropdownMenuContent>
        {/* Item 1*/}
        <DropdownMenuItem>
          {/* Link to user profile */}
          <Link
            to={"/manage-restaurant"}
            className="font-bold hover:text-orange-500"
          >
            Manage Restaurant
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {/* Link to user profile */}
          <Link
            to={"/user-profile"}
            className="font-bold hover:text-orange-500"
          >
            User profile
          </Link>
        </DropdownMenuItem>
        <Separator/>
        {/* Item 2 */}
        <DropdownMenuItem>
          {/* Logout button */}
          <Button onClick={handleLogout} className="cursor-pointer font-bold flex flex-1 bg-orange-500">Log Out</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
