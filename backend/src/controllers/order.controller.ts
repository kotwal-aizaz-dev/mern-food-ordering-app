import Stripe from "stripe";
import { Request, Response } from "express";
import Restaurant, { MenuItemType } from "../models/restaurant.model";
import { ObjectId } from "mongodb";
import { Order } from "../models/order.model";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);
const frontendURL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  restaurantId: string;
};

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  // console.log("Received Event")
  // console.log("=================")
  // console.log("event", req.body)
  // res.send()
  let event;
  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    console.log(error);
    res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event?.type === "checkout.session.completed") {
    const orderId = event.data.object.metadata?.orderId;
    const order = await Order.findById(new ObjectId(orderId));
    if (!order) {
      res.status(404).json({ message: "Order not found!" });
    } else {
      order.totalAmount = event.data.object.amount_total;
      order.status = "paid";
      await order?.save();
    }
  }
  res.status(200).send();
};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: new ObjectId(req.userId) })
      .populate("restaurant")
      .populate("user");
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong!",
    });
  }
};
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    const restaurant = await Restaurant.findById(
      new ObjectId(checkoutSessionRequest.restaurantId)
    );
    if (!restaurant) {
      throw new Error("restaurant not found!");
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: new ObjectId(req.userId),
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant.id.toString()
    );

    if (!session.url) {
      res
        .status(500)
        .json({ message: "error creating stripe session " });
    }
    await newOrder.save();
    res.status(201).json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );
    if (!menuItem) {
      throw new Error(`menu item not found: ${cartItem.menuItemId}`);
    }
    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };
    return line_item;
  });
  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "usd",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${frontendURL}/order-status?success=true`,
    cancel_url: `${frontendURL}/restaurant/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};
