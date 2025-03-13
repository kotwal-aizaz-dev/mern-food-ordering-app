import { useGetCurrentUser, useUpdateUser } from "@/api/useCreateUser";
import UserProfileForm from "../forms/UserProfileForm";

const UserProfilePage = () => {
  const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();
  const { currentUser, isLoading: isGetLoading } = useGetCurrentUser();
  if (isGetLoading) {
    return <span>Loading...</span>;
  }
  if (!currentUser) {
    return <span>Unable to load user profile</span>;
  }

  return <UserProfileForm currentUser={currentUser} onSave={updateUser} isLoading={isUpdateLoading} />;
};

export default UserProfilePage;
