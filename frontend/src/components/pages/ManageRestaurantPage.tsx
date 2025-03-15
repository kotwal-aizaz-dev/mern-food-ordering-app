import {
  useCreateRestaurant,
  useGetRestaurant,
  useUpdateRestaurant,
} from "@/api/RestaurantApi";
import ManageRestaurantForm from "../forms/restaurant/ManageRestaurantForm";

const ManageRestaurantPage = () => {
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateRestaurant();
  const { restaurant } = useGetRestaurant();
  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateRestaurant();
  const isEditing = !!restaurant; // give a truthy value
  return (
    <ManageRestaurantForm
      restaurant={restaurant}
      onSave={isEditing ? updateRestaurant : createRestaurant}
      isLoading={isCreateLoading || isUpdateLoading}
    />
  );
};

export default ManageRestaurantPage;
