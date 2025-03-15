import { useCreateRestaurant } from "@/api/RestaurantApi";
import ManageRestaurantForm from "../forms/restaurant/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading } = useCreateRestaurant();
  return (
    <ManageRestaurantForm onSave={createRestaurant} isLoading={isLoading} />
  );
};

export default ManageRestaurantPage;
