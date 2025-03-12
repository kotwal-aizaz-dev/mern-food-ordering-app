import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import UserMenu from "./UserMenu";
const MainNav = () => {
  // Destructure loginWithRedirect and isAuthenticated from useAuth0 hook
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
// ! Navbar for larger screens 
<>
      <span className="flex space-x-2 items-center">
        {/* show the large screen dropdown if the user is authenticated */}
        {isAuthenticated ? (
          <UserMenu/>
        ) : (
          // Login button
          <Button
            variant={"ghost"}
            className="font-bold hover:text-orange-500 hover:bg-orange-200 cursor-pointer"
            onClick={async () => await loginWithRedirect()}
          >
            Login
          </Button>
        )}
      </span>
    </>
  );
};

export default MainNav;
