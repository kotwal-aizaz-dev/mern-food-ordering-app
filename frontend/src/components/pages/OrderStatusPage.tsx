import { useGetOrders } from "@/api/OrderApi";
import { Order } from "types";
import { Progress } from "../ui/progress";
import { ORDER_STATUS } from "@/config/order-status-config";
import { Separator } from "../ui/separator";
import { AspectRatio } from "../ui/aspect-ratio";

const OrderStatusPage = () => {
  const { orders, isLoading } = useGetOrders();

  const getExpectedDeliveryTime = (order: Order) => {
    const created = new Date(order.createdAt);
    created.setMinutes(
      created.getMinutes() + order.restaurant.estimatedDeliveryTime
    );

    const hours = created.getHours();
    const minutes = created.getMinutes();

    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes} ${hours > 12 ? "PM" : "AM"}`;
  };

  const getOrderProgress = (order: Order) => {
    return (
      ORDER_STATUS.find((status) => status.value === order.status) ||
      ORDER_STATUS[0]
    );
  };
  if (isLoading) {
    return "Loading...";
  }
  if (!orders || orders.length === 0) {
    return "No orders found";
  }
  return (
    <div className="space-y-10">
      {orders.map((order) => (
        <div key={order._id} className="space-y-10 bg-gray-50 p-10 rounded-lg">
            {/* Order Header  */}
          <h1 className="text-4xl font-bold tracking-tighter flex flex-col gap-5 md:flex-row md:justify-between">
            <span className="">
              Order Status: {getOrderProgress(order).label}
            </span>
            <span className="">
              Expected By: {getExpectedDeliveryTime(order)}
            </span>
          </h1>
          <Progress
            className="animate-pulse"
            value={getOrderProgress(order).progressValue}
          />
          {/* Order header ends */}
          {/* Order details */}
          <div className="grid gap-10 md:grid-cols-2">
            {/* Order info */}
            <div className="space-y-5 ">
                <div className="flex flex-col">
                    <span className="font-bold ">Delivering to:</span>
                    <span>{order.deliveryDetails.name}</span>
                    <span>{order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold">Your Order</span>
                    <ul>
                        {
                            order.cartItems.map(cartItem => (
                                <li key={cartItem.menuItemId}>
                                    {cartItem.name} x {cartItem.quantity}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <Separator/>
                <div className="flex flex-col">
                    <span className="font-bold">Total</span>
                    <span>${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
            </div>
            {/* Order info ends */}
            {/* Restaurant image */}
            <AspectRatio ratio={16/5}>
                     <img src={order.restaurant.imageUrl} alt="" className="rounded-md object-fill h-full w-full" />   
            </AspectRatio>
            {/* Restaurant image ends */}
          </div>
          {/* Order details ends */}
        </div>
      ))}
    </div>
  );
};

export default OrderStatusPage;
