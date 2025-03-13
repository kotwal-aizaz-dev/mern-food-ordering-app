import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import {User} from "types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetCurrentUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const getUserRequest = async (): Promise<User> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  };
  const {
    data: currentUser,
    isLoading,
    error,
  } = useQuery("fetchCurrentUser", getUserRequest);
  if (error) {
    toast.error(error.toString());
  }
  return { currentUser, isLoading };
};

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

export const useCreateUser = () => {
  // POST request to /api/user
  const { getAccessTokenSilently } = useAuth0();
  const createUserRequest = async (user: CreateUserRequest) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      // if there is no response throw an error
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  // use react-query for handling user creation
  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createUserRequest);
  return { createUser, isError, isLoading, isSuccess };
};

type UpdateUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};
export const useUpdateUser = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateUserRequest = async (formData: UpdateUserRequest) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }
  };

  const {
    mutateAsync: updateUser,
    isLoading,
    error,
    isSuccess,
    reset,
  } = useMutation(updateUserRequest);

  if (isSuccess) {
    toast.success("User profile updated!");
  }

  if (error) {
    toast.error(error.toString());
    reset();
  }

  return { updateUser, isLoading };
};

/**
 * ?React Query
React Query is a library that simplifies data fetching and state management in React applications. It handles:

Fetching, caching, and updating server data
Loading and error states
Background refetching
Cache invalidation

//?useMutation Hook
The useMutation hook is for operations that modify data (create, update, delete) rather than just fetching it.

//?Key features:

Status tracking (isPending, isError, isSuccess)
Optimistic updates
Retry logic
Lifecycle callbacks (onMutate, onError, onSuccess)

Use useMutation whenever you need to create, update or delete data on your server.
 */
