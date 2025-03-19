import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ORDER_STATUS } from "@/config/order-status-config";
import { Order } from "types";
import { useUpdateRestaurantOrder } from "@/api/RestaurantApi";
import { useEffect, useState } from "react";
type Props = {
  order: Order;
};
const OrderItemCard = ({ order }: Props) => {
  const { updateOrderStatus, isLoading } = useUpdateRestaurantOrder();
  useEffect(() => {
    setStatus(order.status);
  }, [order.status]);
  const [status, setStatus] = useState<string>(order.status);
  const getTime = (order: Order) => {
    const orderDateTime = new Date(order.createdAt);

    const hours = orderDateTime.getHours();
    const minutes = orderDateTime.getMinutes();
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${paddedMinutes} ${hours > 12 ? "PM" : "AM"}`;
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateOrderStatus({
      orderId: order._id as string,
      status: newStatus,
    });
    setStatus(newStatus);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="grid md:grid-cols-4 gap-2 justify-between mb-3">
          <div className="">
            <span className="text-sm">Customer Name:</span>
            <span className="ml-2 font-normal">
              {order.deliveryDetails.name}
            </span>
          </div>
          <div className="">
            Delivery Address:
            <span className="ml-2 font-normal">
              {order.deliveryDetails.addressLine1}, {order.deliveryDetails.city}
            </span>
          </div>
          <div className="">
            Time:
            <span className="ml-2 font-normal">{getTime(order)}</span>
          </div>
          <div className="">
            Total Cost:
            <span className="ml-2 font-normal">
              $ {(order.totalAmount / 100).toFixed(2)}
            </span>
          </div>
        </CardTitle>
        <Separator />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {order.cartItems.map((item) => (
            <span>
              <Badge variant={"outline"} className="mr-2">
                {item.quantity}
              </Badge>
              {item.name}
            </span>
          ))}
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="status">What is the status of this order?</Label>
          <Select
            value={status}
            disabled={isLoading}
            onValueChange={(value) => handleStatusChange(value)}
          >
            <SelectTrigger id="status" className="cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent position="popper">
              {ORDER_STATUS.map((status) => (
                <SelectItem value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderItemCard;
