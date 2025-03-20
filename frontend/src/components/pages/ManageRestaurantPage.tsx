import {
  useCreateRestaurant,
  useGetRestaurant,
  useGetRestaurantOrders,
  useUpdateRestaurant,
} from "@/api/RestaurantApi";
import ManageRestaurantForm from "../forms/restaurant/ManageRestaurantForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import OrderItemCard from "../OrderItemCard";

const ManageRestaurantPage = () => {
  const { orders } = useGetRestaurantOrders();
  const { createRestaurant, isLoading: isCreateLoading } =
    useCreateRestaurant();
  const { restaurant } = useGetRestaurant();

  const { updateRestaurant, isLoading: isUpdateLoading } =
    useUpdateRestaurant();
  const isEditing = !!restaurant; // give a truthy value
  
  return (
    <Tabs defaultValue="orders">
      <TabsList>
        <TabsTrigger className="cursor-pointer" value="orders">
          Orders
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="manage-restaurant">
          Manage Restaurant
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="orders"
        className="space-y-5 bg-gray-50 rounded-lg p-10"
      >
        {orders ? (
          <>
            <h2 className="text-2xl font-bold ">
              {orders?.length} active orders
            </h2>
            {orders?.map((order) => (
              <OrderItemCard order={order} />
            ))}
          </>
        ) : (
          <span>You don't have any active orders</span>
        )}
      </TabsContent>
      <TabsContent value="manage-restaurant">
        {!restaurant && <span>You don't have own a restaurant. Please add a restaurant below.</span>}
        <ManageRestaurantForm
          restaurant={restaurant}
          onSave={isEditing ? updateRestaurant : createRestaurant}
          isLoading={isCreateLoading || isUpdateLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ManageRestaurantPage;
