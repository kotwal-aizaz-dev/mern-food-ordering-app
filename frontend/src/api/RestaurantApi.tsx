import { SearchState } from "@/components/pages/SearchPage";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";
import { Order, Restaurant, RestaurantSearchResponse } from "types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetRestaurantById = (restaurantId?: string) => {
  const getRestaurantRequest = async (): Promise<Restaurant> => {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/${restaurantId}`,
      {}
    );
    if (!response.ok) {
      throw new Error("Failed to get restaurant by id");
    }

    return response.json();
  };

  const { data: restaurant, isLoading } = useQuery(
    ["fetchRestaurant"],
    getRestaurantRequest,
    {
      enabled: !!restaurantId,
    }
  );

  return { restaurant, isLoading };
};

export const useGetRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const getRestaurantRequest = async (): Promise<Restaurant> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response) {
      throw new Error("failed to get restaurant");
    }

    return response.json();
  };

  const { data: restaurant, isLoading, isError } = useQuery(
    "fetchMyRestaurant",
    getRestaurantRequest
  );
  return { restaurant, isLoading, isError };
};

export const useGetRestaurantOrders = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getRestaurantOrdersRequest = async (): Promise<Order[]> => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/restaurant/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch orders!");
    }
    return response.json();
  };

  const { data: orders, isLoading } = useQuery(
    ["fetchRestaurantOrders"],
    getRestaurantOrdersRequest,
    {
      refetchInterval: 10000
    }
  );

  return { orders, isLoading };
};

type UpdateOrderStatusRequest = {
  orderId: string;
  status: string;
};

export const useUpdateRestaurantOrder = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateRestaurantOrder = async (
    updateStatusOrderRequest: UpdateOrderStatusRequest
  ) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/order/${updateStatusOrderRequest.orderId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({status: updateStatusOrderRequest.status})
      }
    );
    if(!response.ok) {
      throw new Error("Failed to update status")
    }

    return response.json()
  };
const {mutateAsync: updateOrderStatus, isLoading, isError, isSuccess, reset} = 
  useMutation(updateRestaurantOrder)
  if(isSuccess) {
    toast.success("Order updated")
  }
  if(isError) {
    toast.error("Unable to update order")
    reset()
  }

  return {
    updateOrderStatus, isLoading
  }
};


export const useCreateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();

  const createRestaurantRequest = async (
    restaurantFormData: FormData
  ): Promise<Restaurant[]> => {
    const accessToken = await getAccessTokenSilently();

    const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });
    if (!response.ok) {
      throw new Error("failed to create restaurant");
    }

    return response.json();
  };

  const {
    mutateAsync: createRestaurant,
    isLoading,
    isSuccess,
    error,
  } = useMutation(createRestaurantRequest);

  if (isSuccess) toast.success("Restaurant created");
  if (error) toast.error("Unable to update restaurant");

  return { createRestaurant, isLoading };
};

export const useUpdateRestaurant = () => {
  const { getAccessTokenSilently } = useAuth0();
  const updateRestaurantRequest = async (restaurantFormData: FormData) => {
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/restaurant`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: restaurantFormData,
    });
    if (!response.ok) {
      throw new Error("Failed to update restaurant");
    }
    return response.json();
  };

  const {
    mutate: updateRestaurant,
    isLoading,
    error,
    isSuccess,
  } = useMutation(updateRestaurantRequest);

  if (isSuccess) toast.success("Restaurant updated");
  if (error) toast.error("Unable to update restaurant");

  return {
    updateRestaurant,
    isLoading,
  };
};

export const useSearchRestaurants = (
  searchState: SearchState,
  city?: string
) => {
  const searchRequest = async (): Promise<RestaurantSearchResponse> => {
    const params = new URLSearchParams();
    params.set("searchQuery", searchState.searchQuery);
    params.set("page", searchState.page.toString());
    params.set("selectedCuisines", searchState.selectedCuisines.join(","));
    params.set("sortOption", searchState.sortOption);
    const response = await fetch(
      `${API_BASE_URL}/api/restaurant/search/${city}?${params.toString()}`,
      {}
    );
    if (!response.ok) {
      throw new Error("Failed to get restaurants");
    }

    return response.json();
  };

  const { data: results, isLoading } = useQuery(
    ["searchRestaurants", searchState],
    searchRequest,
    {
      enabled: !!city,
    }
  );

  return { results, isLoading };
};
