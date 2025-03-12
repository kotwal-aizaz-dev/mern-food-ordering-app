import { CircleUserRound, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import MobileNavLinks from "./MobileNavLinks";

const MobileNav = () => {
  const {isAuthenticated, loginWithRedirect, user} = useAuth0()
  async function handleLogin() {
    await loginWithRedirect()
  }
  return (
    // ! Dropdown for mobile nav 
    <Sheet>
      {/* Trigger  */}
      <SheetTrigger>
        <Menu className="text-orange-500 cursor-pointer" />
      </SheetTrigger>
      {/* Content */}
      <SheetContent className="p-6">
        <SheetTitle>
            {/* Display user info if authenticated, otherwise show welcome message */}
            {isAuthenticated ? (
            <span className="flex items-center font-bold gap-2">
              <CircleUserRound className="text-orange-500" />
              {user?.nickname}
            </span>
            ) : (
            <span>Welcome to MERNeats.com!</span>
            )}
        </SheetTitle>
        <Separator />
        <SheetDescription className="flex flex-col gap-4">
          {/* If the user is authenticated, show the mobile navigation links, otherwise show the login button */}
          {
            isAuthenticated ? <MobileNavLinks/> : 
            // login button
          <Button className="flex-1 font-bold bg-orange-500 cursor-pointer" onClick={handleLogin}>Log In</Button>
          }
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
