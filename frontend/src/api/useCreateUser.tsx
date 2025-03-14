import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import {User} from "types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// Custom hook to get the current user's data from the API
export const useGetCurrentUser = () => {
  // Get the function to silently obtain Auth0 access token
  const { getAccessTokenSilently } = useAuth0();

  // Function to fetch the current user's data from the server
  const getUserRequest = async (): Promise<User> => {
    // Get the access token for authentication
    const accessToken = await getAccessTokenSilently();
    
    // Send GET request to the API endpoint with auth token
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // If the API request fails, throw an error with message
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    // Parse and return the JSON response containing user data
    return response.json();
  };

  // Use react-query's useQuery hook to handle data fetching and caching
  const {
    data: currentUser, // Rename the returned data as currentUser
    isLoading,        // Track loading state
    error,           // Track any errors that occur
  } = useQuery("fetchCurrentUser", getUserRequest);

  // Display error message if the request fails
  if (error) {
    toast.error(error.toString());
  }

  // Return the user data and loading state to the component
  return { currentUser, isLoading };
};

// Type definition for the required fields when creating a new user
type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

// Custom hook to handle user creation in the database 
export const useCreateUser = () => {
  // Get the function to silently obtain Auth0 access token
  const { getAccessTokenSilently } = useAuth0();

  // Function to send POST request to create a new user
  const createUserRequest = async (user: CreateUserRequest) => {
    try {
      // Get the access token for authentication
      const accessToken = await getAccessTokenSilently();
      
      // Send POST request to the API with user data
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      // Throw error if the request was not successful
      if (!response.ok) {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  // Use react-query's useMutation hook to handle the creation operation
  const {
    mutateAsync: createUser,
    isLoading,
    isError,
    isSuccess,
  } = useMutation(createUserRequest);

  // Return the create function and status flags
  return { createUser, isError, isLoading, isSuccess };
};

// Type definition for user update request containing required fields
type UpdateUserRequest = {
  name: string;
  addressLine1: string;
  city: string;
  country: string;
};

// Custom hook for handling user profile updates
export const useUpdateUser = () => {
  // Get the function to silently obtain Auth0 access token
  const { getAccessTokenSilently } = useAuth0();

  // Function to send PUT request to update user data
  const updateUserRequest = async (formData: UpdateUserRequest) => {
    // Get the access token for authentication
    const accessToken = await getAccessTokenSilently();
    
    // Send PUT request to the API with user data
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Throw error if the request was not successful
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
  };

  // Use react-query's useMutation hook to handle the update operation
  const {
    mutateAsync: updateUser,
    isLoading,
    error,
    isSuccess,
    reset,
  } = useMutation(updateUserRequest);

  // Show success message when update is successful
  if (isSuccess) {
    toast.success("User profile updated!");
  }

  // Show error message and reset mutation state if there's an error
  if (error) {
    toast.error(error.toString());
    reset();
  }

  // Return the update function and loading state
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
