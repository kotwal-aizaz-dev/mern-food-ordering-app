import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const MainNav = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Button
      variant={"ghost"}
      className="font-bold hover:text-orange-500 hover:bg-orange-200 cursor-pointer"
      onClick={async () => await loginWithRedirect()}
    >
      LOG IN
    </Button>
  );
};

export default MainNav;
