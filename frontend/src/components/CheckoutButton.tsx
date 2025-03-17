import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";
import { useLocation } from "react-router-dom";
import LoadingButton from "./LoadingButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import UserProfileForm, { UserFormData } from "./forms/user/UserProfileForm";
import { useGetCurrentUser } from "@/api/UserApi";

type Props = {
  onCheckout: (userFormData: UserFormData) => void;
  disabled: boolean;
};

const CheckoutButton = ({ onCheckout, disabled }: Props) => {
  const { currentUser, isLoading: isGetUserLoading } = useGetCurrentUser();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    loginWithRedirect,
  } = useAuth0();
  const { pathname } = useLocation();
  const onLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: pathname,
      },
    });
  };
  if (!isAuthenticated) {
    return (
      <Button className="bg-orange-500 cursor-pointer flex-1" onClick={onLogin}>
        Log in to check out
      </Button>
    );
  }

  if (isAuthLoading || !currentUser) {
    return <LoadingButton />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 flex-1" disabled={disabled}>
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[425px] md:min-w-[700px] bg-gray-50">
        <DialogHeader>
          <DialogTitle>user details</DialogTitle>
          <DialogDescription>Confirm your details</DialogDescription>
        </DialogHeader>
        <UserProfileForm
        title="Confirm delivery details"
        buttonText="Continue to payment"
          currentUser={currentUser}
          onSave={onCheckout}
          isLoading={isGetUserLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutButton;
