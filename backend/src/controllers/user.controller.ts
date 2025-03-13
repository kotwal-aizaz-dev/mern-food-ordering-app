import { Request, Response } from "express";
import User from "../models/user.model";

// Controller function to create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    // Check if auth0Id is provided in the request body
    if (!auth0Id) {
      return res.status(400).json({ message: "auth0Id is required" });
    }

    // Check if a user with the provided auth0Id already exists
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
      });
    }

    // Log the request body for debugging purposes
    console.log(req.body);

    // Create a new user with the provided data
    const newUser = new User(req.body);

    // Log the new user object for debugging purposes
    console.log(newUser);

    // Save the new user to the database
    await newUser.save();

    // Respond with success message and the created user data
    res.status(201).json({
      message: "success",
      data: newUser,
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.log(error);

    // Respond with error message
    res.status(500).json({ message: "Error creating user", error: error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, country, city } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.country = country;
    await user.save();
    
    return res.status(201).json({ message: "success", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating user",
    });
  }
};
