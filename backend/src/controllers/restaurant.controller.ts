import { Response, Request } from "express";
import Restaurant from "../models/restaurant.model";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import { Order } from "../models/order.model";

const ObjectId = mongoose.Types.ObjectId;

export const getRestaurants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    const query: any = {};
    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query);
    if (cityCheck === 0) {
      res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
      return;
    }
    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));

      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize), // 50 results, pageSize = 10 > pages 5
      },
    };

    res.status(200).send(response);
    return;
  } catch (error) {
    console.log(error);
    res.json(500).json({
      message: "Something went wrong",
    });
    return;
  }
};

export const getRestaurantById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findById(new ObjectId(restaurantId));
    if (!restaurant) {
      res.status(404).json({
        message: "Restaurant not found!",
      });
      return;
    }
    res.status(200).send(restaurant);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong!");
    return;
  }
};

export const getRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({
      user: new ObjectId(req.userId),
    });
    if (!restaurant) {
      res.status(404);
      return;
    }
    res.status(200).json(restaurant);
    return;
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching restaurant" });
    return;
  }
};

export const getRestaurantOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({
      user: new ObjectId(req.userId),
    });

    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found!" });
      return;
    } else {
      const orders = await Order.find({ restaurant: restaurant._id })
        .populate("restaurant")
        .populate("user");

      res.status(200).json(orders);
      return;
    }
  } catch (error: any) {
    console.log(error, error.message);
    res.status(500).json({ message: "Something went wrong!" });
    return;
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found!" });
      return;
    } else {
      const restaurant = await Restaurant.findById(order.restaurant);
      if (restaurant?.user?._id.toString() !== req.userId) {
        res.status(401).json({ message: "Invalid order" });
        return;
      }
      order.status = status;
      await order.save();
      res.status(200).json(order);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update order status!" });
    return;
  }
};

export const createRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.userId);
    const existingRestaurant = await Restaurant.findOne({
      user: new ObjectId(req.userId),
    });
    if (existingRestaurant) {
      res.status(409).json({ message: "User restaurant already exists" });
      return;
    }
    // const image = req.file as Express.Multer.File;
    // const base64Image = Buffer.from(image.buffer).toString("base64");
    // const dataURI = `data:${image.mimetype};base64,${base64Image}`;
    // const uploadResponse = await cloudinary.uploader.upload(dataURI);
    console.log("Creating restaurant");
    const restaurant = new Restaurant(req.body);
    console.log(restaurant);
    if (req.file) {
      restaurant.imageUrl = await uploadImage(req.file as Express.Multer.File);
    }
    restaurant.user = new ObjectId(req.userId.toString());
    restaurant.lastUpdate = new Date();
    await restaurant.save();
    res.status(201).send(restaurant);
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};

export const updateRestaurant = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({
      user: new ObjectId(req.userId),
    });

    if (!restaurant) {
      res.status(404).json({ message: "restaurant not found" });
      return;
    } else {
      restaurant.restaurantName = req.body.restaurantName;
      restaurant.city = req.body.city;
      restaurant.country = req.body.country;
      restaurant.deliveryPrice = req.body.deliveryPrice;
      restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
      restaurant.cuisines = req.body.cuisines;
      restaurant.menuItems = req.body.menuItems;
      restaurant.lastUpdate = new Date();

      if (req.file) {
        const imageUrl = await uploadImage(req.file as Express.Multer.File);
        restaurant.imageUrl = imageUrl;
      }
      await restaurant.save();
      res.status(200).send(restaurant);
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something Went wrong");
    return;
  }
};

async function uploadImage(file: Express.Multer.File) {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;
  const uploadResponse = await cloudinary.uploader.upload(dataURI);
  console.log(uploadResponse);
  return uploadResponse.url;
}
