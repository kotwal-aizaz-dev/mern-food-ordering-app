import { useGetRestaurantById } from "@/api/RestaurantApi";
import { useParams } from "react-router-dom";
import { AspectRatio } from "../ui/aspect-ratio";
import RestaurantInfo from "../RestaurantInfo";
import RestaurantMenuItem from "../RestaurantMenuItem";
import { useState } from "react";
import { Card } from "../ui/card";
import OrderSummary from "../OrderSummary";
import { MenuItem } from "types";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
};

const DetailPage = () => {
  const { restaurantId } = useParams();
  const { restaurant, isLoading } = useGetRestaurantById(restaurantId);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem) => {
    setCartItems((prevState) => {
      const existingCartItem = prevState.find(
        (item) => item._id === menuItem._id
      );
      let updatedCartItems;
      if (existingCartItem) {
        updatedCartItems = prevState.map((item) =>
          item._id === menuItem._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      } else {
        updatedCartItems = [
          ...prevState,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ];
      }

      return updatedCartItems;
    });
  };

  const removeFromCart = (cartItem: CartItem) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = prevCartItems.filter(
        (item) => item._id !== cartItem._id
      );

      return updatedCartItems;
    });
  };
  if (isLoading || !restaurant) {
    return " Loading...";
  }
  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurant.imageUrl}
          alt=""
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>
      <div className="grid md:grid-cols-[4fr_2fr] gap-5">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurant} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurant.menuItems.map((menuItem, index) => (
            <RestaurantMenuItem
              key={index}
              menuItem={menuItem}
              addToCart={() => addToCart(menuItem)}
            />
          ))}
        </div>
        <div className="">
          <Card>
            <OrderSummary
              restaurant={restaurant}
              cartItems={cartItems}
              removeFromCart={removeFromCart}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
