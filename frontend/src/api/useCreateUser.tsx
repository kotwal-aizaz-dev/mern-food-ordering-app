import { useMutation } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
  auth0Id: string;
  email: string;
};

const useCreateUser = () => {
  // POST request to /api/user
  const createUserRequest = async (user: CreateUserRequest) => {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // if there is no response throw an error 
    if (!response.ok) {
      throw new Error("Failed to create user");
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

export default useCreateUser;

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
